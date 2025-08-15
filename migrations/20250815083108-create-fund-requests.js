'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fund_requests', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
      },
      requester_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      budget_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'budgets',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      gl_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'general_ledgers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      requested_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      purpose: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      urgency_level: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium',
      },
      secretary_approval_status: {
        type: Sequelize.ENUM('pending', 'approved', 'declined'),
        defaultValue: 'pending',
        allowNull: false,
      },
      secretary_decline_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      chairperson_approval_status: {
        type: Sequelize.ENUM('pending', 'approved', 'declined'),
        defaultValue: 'pending',
        allowNull: false,
      },
      chairperson_decline_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
          'Pending Approval',
          'Approved',
          'Declined',
          'Allocated'
        ),
        defaultValue: 'Pending Approval',
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('fund_requests');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_fund_requests_urgency_level";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_fund_requests_secretary_approval_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_fund_requests_chairperson_approval_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_fund_requests_status";');
  }
};
