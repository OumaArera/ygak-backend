const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user.model');
const Budget = require('./budget.model');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    field: 'user_id',
  },
  budgetId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Budget,
      key: 'id',
    },
    field: 'budget_id',
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comments: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_date',
  },
  isPending: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    field: 'is_pending',
  },
  isComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: 'is_complete',
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: 'is_approved',
  },
  isDeclined: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: 'is_declined',
  },
  declineReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'decline_reason',
  },
}, {
  tableName: 'reports',
  timestamps: true,
  underscored: true,
});

module.exports = Report;
