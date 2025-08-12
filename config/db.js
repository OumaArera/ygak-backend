const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sslCa = process.env.CA_CERT;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: true,
    ca: sslCa,
  },
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on PostgreSQL client', err);
  process.exit(-1);
});

module.exports = pool;