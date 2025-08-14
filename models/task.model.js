const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user.model');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    field: 'assigned_to',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'end_date',
  },
}, {
  tableName: 'tasks',
  timestamps: true,
  underscored: true,
});

module.exports = Task;
