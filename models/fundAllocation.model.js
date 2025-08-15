const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user.model');
const Budget = require('./budget.model');
const FundRequest = require('./fundRequest.model');
const GeneralLedger = require('./generalLedger.model');

const FundAllocation = sequelize.define('FundAllocation', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  fundRequestId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: FundRequest,
      key: 'id',
    },
    field: 'fund_request_id',
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
  glId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: GeneralLedger,
      key: 'id',
    },
    field: 'gl_id',
  },
  allocatedAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'allocated_amount',
  },
  remainingAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'remaining_amount',
  },
  allocatedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    field: 'allocated_by',
  },
  status: {
    type: DataTypes.ENUM('active', 'fully_utilized', 'reallocated'),
    defaultValue: 'active',
    allowNull: false,
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expiry_date',
  },
}, {
  tableName: 'fund_allocations',
  timestamps: true,
  underscored: true,
});
module.exports = FundAllocation;