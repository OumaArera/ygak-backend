const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Donation = sequelize.define(
  'Donation',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    otherNames: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
      type: DataTypes.ENUM,
      values: ['Mpesa', 'Debit Card', 'PayPal'],
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    mpesaNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    debitCardNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paypalEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    transactionId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    transactionalParticulars: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    donorEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    donorPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
        type: DataTypes.ENUM,
        values: ['Pending', 'Paid', 'Declined'],
        defaultValue: 'Pending',
        allowNull: false,
    },
  },
  {
    tableName: 'donations',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Donation;
