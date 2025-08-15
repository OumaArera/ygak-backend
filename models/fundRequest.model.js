const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user.model');
const Budget = require('./budget.model');
const GeneralLedger = require('./generalLedger.model');

const FundRequest = sequelize.define('FundRequest', {
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
  requestedAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'requested_amount',
  },
  purpose: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  urgencyLevel: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
    field: 'urgency_level',
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
      'Allocated'
    ),
    defaultValue: 'Pending Approval',
    allowNull: false,
  },
}, {
  tableName: 'fund_requests',
  timestamps: true,
  underscored: true,
});

module.exports = FundRequest;