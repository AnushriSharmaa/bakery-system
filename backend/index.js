const express = require('express');
const { consumeOrders } = require('./queue');  // Import the consumer function
const orderRouter = require('./routes/orders');
const productRouter = require('./routes/products');

const app = express();
const port = process.env.PORT || 5000;
const cors=require('cors');
app.use(cors());
app.use(express.json());
app.use('/orders', orderRouter);
app.use('/products', productRouter);

// Start consuming orders
consumeOrders();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
