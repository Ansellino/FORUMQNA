const { Client } = require('pg');
require('dotenv').config();

console.log('🔍 Checking DATABASE_URL...');
console.log('Host:', new URL(process.env.DATABASE_URL).hostname);
console.log('Port:', new URL(process.env.DATABASE_URL).port);
console.log('Database:', new URL(process.env.DATABASE_URL).pathname);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  statement_timeout: 10000,
  application_name: 'test-connection',
});

console.log('📡 Attempting to connect...');

client.on('error', (err) => {
  console.log('❌ Client error:', err.message);
});

client
  .connect()
  .then(() => {
    console.log('✅ Connected to database!');
    return client.query('SELECT version();');
  })
  .then((res) => {
    console.log('✅ Query successful!');
    console.log(res.rows[0]);
    return client.end();
  })
  .catch((err) => {
    console.log('❌ Connection error:', err.message);
    console.log('Code:', err.code);
    process.exit(1);
  });
