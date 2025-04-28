const express = require('express');
const router = express.Router();
const { pool, redisClient } = require('../db');

router.get('/', async (req, res) => {
  try {
    const cached = await redisClient.get('products');
    if (cached) return res.json(JSON.parse(cached));

    const { rows } = await pool.query('SELECT * FROM products');
    await redisClient.set('products', JSON.stringify(rows), { EX: 60 });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
