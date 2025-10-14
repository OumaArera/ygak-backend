const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user.model');

const Inventory = sequelize.define(
  'Inventory',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    // Association
    currentUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
     field: 'current_user_id',
    },
    // Core fields
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    serialNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      field: 'serial_number'
    },

    acquisitionDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'acquisition_date'
    },

    value: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM('available', 'in_use', 'under_repair', 'retired'),
      allowNull: false,
      defaultValue: 'available',
    },

    lastMaintenanceDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_maintenance_date'
    },

  },
  {
    tableName: 'inventory',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Inventory;
