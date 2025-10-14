const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Newsletter = sequelize.define(
  'Newsletter',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Invalid email address format'
        }
      }
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: 'newsletter_subscriptions',
    timestamps: true, 
    underscored: true,
  }
);

module.exports = Newsletter;
