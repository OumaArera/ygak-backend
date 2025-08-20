const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Event = require('./event.model');

const EventMedia = sequelize.define(
  'EventMedia',
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
      field: 'event_id',
    },

    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'event_media',
    timestamps: true,
    underscored: true,
  }
);

module.exports = EventMedia;
