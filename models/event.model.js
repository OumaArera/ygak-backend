const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Event = sequelize.define(
  'Event',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    county: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    subCounty: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'sub_county',
    },

    // Location coordinates (latitude & longitude)
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },

    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },

    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_approved',
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    flyer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'events',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Event;
