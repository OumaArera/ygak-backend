const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const UpcomingProject = sequelize.define(
  'UpcomingProject',
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

    theme: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    date: { 
      type: DataTypes.DATEONLY,
      allowNull: true, 
    },
  },
  {
    tableName: 'upcoming_projects',
    timestamps: true,
    underscored: true,
  }
);

module.exports = UpcomingProject;