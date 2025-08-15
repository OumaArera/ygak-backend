const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const GeneralLedger = sequelize.define('GeneralLedger', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  glCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'gl_code',
  },
  glName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'gl_name',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  currentBalance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    allowNull: false,
    field: 'current_balance',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
}, {
  tableName: 'general_ledgers',
  timestamps: true,
  underscored: true,
});

module.exports = GeneralLedger;