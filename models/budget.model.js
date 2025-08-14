const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./user.model'); 

const Budget = sequelize.define('Budget', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    field: 'user_id',
  },
   title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Test Budget',
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  recipient: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  invoice: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  receipt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  particulars: {
    type: DataTypes.JSON,
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
  treasurerApprovalStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'declined'),
    defaultValue: 'pending',
    allowNull: false,
    field: 'treasurer_approval_status',
  },
  treasurerDeclineReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'treasurer_decline_reason',
  },
  status: {
    type: DataTypes.ENUM(
      'Pending Approval',
      'Approved Pending Disbursement',
      'Declined',
      'Disbursed Pending Receipts',
      'Closed'
    ),
    defaultValue: 'Pending Approval',
    allowNull: false,
  },
}, {
  tableName: 'budgets',
  timestamps: true,
  underscored: true,
});


module.exports = Budget;
