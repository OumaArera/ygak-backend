const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user.model');
const Budget = require('./budget.model');
const FundAllocation = require('./fundAllocation.model');
const GeneralLedger = require('./generalLedger.model');
const Payment = require('./payment.model');

const FinancialTransaction = sequelize.define('FinancialTransaction', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  glId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: GeneralLedger,
      key: 'id',
    },
    field: 'gl_id',
  },
  budgetId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Budget,
      key: 'id',
    },
    field: 'budget_id',
  },
  paymentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Payment,
      key: 'id',
    },
    field: 'payment_id',
  },
  allocationId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: FundAllocation,
      key: 'id',
    },
    field: 'allocation_id',
  },
  transactionType: {
    type: DataTypes.ENUM(
      'fund_allocation',
      'payment',
      'reallocation_debit',
      'reallocation_credit',
      'adjustment',
      'reversal'
    ),
    allowNull: false,
    field: 'transaction_type',
  },
  debitAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    field: 'debit_amount',
  },
  creditAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    field: 'credit_amount',
  },
  runningBalance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'running_balance',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  processedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    field: 'processed_by',
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'transaction_date',
  },
}, {
  tableName: 'financial_transactions',
  timestamps: true,
  underscored: true,
});

module.exports = FinancialTransaction;