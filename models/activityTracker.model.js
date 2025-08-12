const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user.model');

const ActivityTracker = sequelize.define(
  'ActivityTracker',
  {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'activity_trackers',
    timestamps: true
  }
);

ActivityTracker.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = ActivityTracker;
