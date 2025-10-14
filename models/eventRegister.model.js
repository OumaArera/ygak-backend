const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Event = require('./event.model');

const EventRegister = sequelize.define(
  'EventRegister',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Event,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },

    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        is: {
          args: /^\+?[1-9]\d{1,14}$/, 
          msg: 'Phone number must be in valid international format, e.g., +254712345678',
        },
      },
    },
  },
  {
    tableName: 'event_registrations',
    timestamps: true,
    underscored: true,
  }
);

module.exports = EventRegister;
