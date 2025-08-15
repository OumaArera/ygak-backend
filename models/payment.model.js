const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user.model');
const Budget = require('./budget.model');
const FundAllocation = require('./fundAllocation.model');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  budgetId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Budget,
      key: 'id',
    },
    field: 'budget_id',
  },
  allocationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: FundAllocation,
      key: 'id',
    },
    field: 'allocation_id',
  },
  paidBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    field: 'paid_by',
  },
  paymentAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'payment_amount',
  },
  paymentMethod: {
    type: DataTypes.ENUM(
      'Bank Transfer',
      'Mpesa Pay Bill',
      'Mpesa Buy Goods',
      'Mpesa Pochi la Biashara',
      'Mpesa Send Money',
      'Cash',
      'Cheque'
    ),
    allowNull: false,
    field: 'payment_method',
  },
  transactionReference: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'transaction_reference',
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'payment_date',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  supportingDocument: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'supporting_document',
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'reversed'),
    defaultValue: 'pending',
    allowNull: false,
  },
}, {
  tableName: 'payments',
  timestamps: true,
  underscored: true,
});

module.exports = Payment;