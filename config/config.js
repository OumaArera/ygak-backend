require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Load certificate file
const sslCa = fs.readFileSync(path.resolve(__dirname, 'prod-ca-2021.crt')).toString();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: sslCa,
        // servername: process.env.DB_HOST,  <-- optional, usually inferred automatically
      },
      family: 4,
    },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: sslCa,
        // servername: process.env.DB_HOST,
      },
      family: 4,
    },
  },
};
