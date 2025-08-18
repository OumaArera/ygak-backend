const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user.model');
const Budget = require('./budget.model');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  maker: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    field: 'maker_id',
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
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  milestones: {
    type: DataTypes.JSON,
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
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'declined', 'on_hold', 'closed'),
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  tableName: 'projects',
  timestamps: true,
  underscored: true,
});

module.exports = Project;
