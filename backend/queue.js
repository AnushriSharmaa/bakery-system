const amqp = require('amqplib');
const { pool, redisClient } = require('./db');

let channel = null;

const connectRabbitMQ = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      const connection = await amqp.connect('amqp://user:password@rabbitmq:5672');
      channel = await connection.createChannel();
      const queue = 'order_queue';
      await channel.assertQueue(queue, { durable: true });
      console.log('✅ Connected to RabbitMQ');
      return { connection, channel };
    } catch (err) {
      console.log(`❌ RabbitMQ connection failed. Retries left: ${retries - 1}`);
      retries--;
      if (retries === 0) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

connectRabbitMQ();

// Send a message (order) to the queue
const sendToQueue = async (orderDetails) => {
  await channel.sendToQueue('order_queue', Buffer.from(JSON.stringify(orderDetails)), {
    persistent: true,
  });

  console.log('📦 Order sent to queue:', orderDetails);
};

const updateOrderStatusInDB = async (orderId) => {
  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      ['completed', orderId]
    );

    const updatedOrder = result.rows[0];
    if (!updatedOrder) return null;

    // Update Redis
    const redisKey = `orders:product:${updatedOrder.product_id}`;
    const orders = await redisClient.lRange(redisKey, 0, -1);

    // Replace the old order with the new one
    for (let i = 0; i < orders.length; i++) {
      const order = JSON.parse(orders[i]);
      if (order.id === updatedOrder.id) {
        await redisClient.lSet(redisKey, i, JSON.stringify(updatedOrder));
        console.log('♻️ Redis order updated for ID:', updatedOrder.id);
        break;
      }
    }

    return updatedOrder;
  } catch (error) {
    console.error('❌ Error updating order in DB/Redis:', error);
    return null;
  }
};
// Consume messages (orders) from the queue
const consumeOrders = async () => {
  const { channel } = await connectRabbitMQ();

  channel.consume('order_queue', async (msg) => {
    if (msg !== null) {
      const order = JSON.parse(msg.content.toString());
      console.log('⚙️ Processing order:', order);

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Update status in Redis
      await redisClient.set(`order_status:${order.id}`, 'processing');

      // Update DB
      const updated = await updateOrderStatusInDB(order.id);
      if (updated) {
        console.log('✅ Order status updated in DB:', updated);

        // Update Redis to completed
        await redisClient.set(`order_status:${order.id}`, 'completed');
      }

      channel.ack(msg);
    } else {
      console.log('⚠️ Received null message.');
    }
  });

  console.log('🕐 Waiting for orders...');
};

module.exports = { sendToQueue, consumeOrders };
