'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('budgets', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      recipient: {
        type: Sequelize.JSON,
        allowNull: false
      },
      invoice: {
        type: Sequelize.STRING,
        allowNull: true
      },
      receipt: {
        type: Sequelize.STRING,
        allowNull: true
      },
      particulars: {
        type: Sequelize.JSON,
        allowNull: false
      },
      secretary_approval_status: {
        type: Sequelize.ENUM('pending', 'approved', 'declined'),
        defaultValue: 'pending',
        allowNull: false
      },
      secretary_decline_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      chairperson_approval_status: {
        type: Sequelize.ENUM('pending', 'approved', 'declined'),
        defaultValue: 'pending',
        allowNull: false
      },
      chairperson_decline_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      treasurer_approval_status: {
        type: Sequelize.ENUM('pending', 'approved', 'declined'),
        defaultValue: 'pending',
        allowNull: false
      },
      treasurer_decline_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM(
          'Pending Approval',
          'Approved Pending Disbursement',
          'Declined',
          'Disbursed Pending Receipts',
          'Closed'
        ),
        defaultValue: 'Pending Approval',
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('budgets');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_budgets_secretary_approval_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_budgets_chairperson_approval_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_budgets_treasurer_approval_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_budgets_status";');
  }
};
