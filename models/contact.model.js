const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); 

const Contact = sequelize.define(
  'Contact',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
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
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    preferredContact: {
      type: DataTypes.ENUM('Email', 'Phone', 'WhatsApp'),
      allowNull: false,
      defaultValue: 'Email',
    },
    heardFrom: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bestTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'contact_submissions',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Contact;