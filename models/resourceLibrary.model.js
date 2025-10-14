const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 

const ResourceLibrary = sequelize.define(
  'ResourceLibrary',
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
      allowNull: true,
    },

    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    author: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    file: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
  },
  {
    tableName: 'resource_library',
    timestamps: true,
    underscored: true,
  }
);

module.exports = ResourceLibrary;