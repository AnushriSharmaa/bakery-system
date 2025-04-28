const { Pool } = require('pg');
const { createClient } = require('redis');

const pool = new Pool({
  host: 'postgres',
  user: 'postgres',
  password: 'postgres',
  database: 'postgres',
  port: 5432,
});

const redisClient = createClient({ url: 'redis://redis:6379' });

redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));

(async () => {
  await redisClient.connect();
  console.log('✅ Connected to Redis');
})();

module.exports = { pool, redisClient };
