const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user.model');
const Budget = require('./budget.model');

const AssetRequest = sequelize.define(
  'AssetRequest',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    // Associations
    budgetId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Budget,
        key: 'id',
      },
      field: 'budget_id',
    },

    requestedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
      field: 'requested_by',
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

    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // Status
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'purchased', 'declined'),
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    tableName: 'asset_requests',
    timestamps: true,
    underscored: true,
  }
);

module.exports = AssetRequest;
