const express = require('express');
const router = express.Router();
const { pool, redisClient } = require('../db');
const { sendToQueue } = require('../queue');

// POST - Create Order and send to queue
router.post('/', async (req, res) => {
  try {
    const { product_id } = req.body;

    const result = await pool.query(
      'INSERT INTO orders (product_id, status) VALUES ($1, $2) RETURNING *',
      [product_id, 'pending']
    );

    const order = result.rows[0];
    console.log("✅ Order placed:", order);

    // Add the order to Redis list
    const redisKey = `orders:product:${product_id}`;
    await redisClient.rPush(redisKey, JSON.stringify(order));

    await sendToQueue(order);

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Fetch orders by product_id from Redis or PostgreSQL
router.get('/:id', async (req, res) => {
  const { id: product_id } = req.params;
  const redisKey = `orders:product:${product_id}`;

  try {
    // Try to get from Redis
    const cachedOrders = await redisClient.lRange(redisKey, 0, -1);

    if (cachedOrders.length > 0) {
      const orders = cachedOrders.map(JSON.parse);
      console.log(`📦 Redis hit for product_id ${product_id}`);
      return res.json(orders);
    }

    // Fallback to DB if Redis empty
    const result = await pool.query(
      'SELECT * FROM orders WHERE product_id = $1 ORDER BY id DESC',
      [product_id]
    );

    const orders = result.rows;

    // Store them in Redis for future requests
    for (const order of orders) {
      await redisClient.rPush(redisKey, JSON.stringify(order));
    }

    console.log(`🗄️ Redis miss — fetched ${orders.length} from DB`);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
