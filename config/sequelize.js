const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sslCa = fs.readFileSync(path.resolve(__dirname, 'prod-ca-2021.crt')).toString();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: sslCa,
      },
      family: 4,
    },
  }
);

module.exports = sequelize;
