const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user.model');
const Budget = require('./budget.model');
const FundAllocation = require('./fundAllocation.model');


const FundReallocation = sequelize.define('FundReallocation', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  requesterId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    field: 'requester_id',
  },
  fromAllocationId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: FundAllocation,
      key: 'id',
    },
    field: 'from_allocation_id',
  },
  toBudgetId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Budget,
      key: 'id',
    },
    field: 'to_budget_id',
  },
  reallocationAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'reallocation_amount',
  },
  justification: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  secretaryApprovalStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'declined'),
    defaultValue: 'pending',
    allowNull: false,
    field: 'secretary_approval_status',
  },
  secretaryDeclineReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'secretary_decline_reason',
  },
  chairpersonApprovalStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'declined'),
    defaultValue: 'pending',
    allowNull: false,
    field: 'chairperson_approval_status',
  },
  chairpersonDeclineReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'chairperson_decline_reason',
  },
  status: {
    type: DataTypes.ENUM(
      'Pending Approval',
      'Approved',
      'Declined',
      'Completed'
    ),
    defaultValue: 'Pending Approval',
    allowNull: false,
  },
}, {
  tableName: 'fund_reallocations',
  timestamps: true,
  underscored: true,
});
module.exports = FundReallocation;