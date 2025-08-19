const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user.model');

const Newsletter = sequelize.define(
  'Newsletter',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  },
  {
    timestamps: true
  }
);

Newsletter.belongsTo(User, {
  foreignKey: 'creatorId',
  as: 'creator'
});

module.exports = Newsletter;
