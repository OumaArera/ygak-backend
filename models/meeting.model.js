const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Meeting = sequelize.define('Meeting', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('online', 'physical'),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'date_time',
  },
  agenda: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
}, {
  tableName: 'meetings',
  timestamps: true,
  underscored: true,
});

module.exports = Meeting;
