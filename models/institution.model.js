const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Institution = sequelize.define('Institution', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  county: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subCounty: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('university', 'college', 'TVET', 'polytechnic'),
    allowNull: false
  },
  ownership: {
    type: DataTypes.ENUM('public', 'private'),
    allowNull: false
  }
}, {
  tableName: 'institutions',
  timestamps: true
});

module.exports = Institution;
