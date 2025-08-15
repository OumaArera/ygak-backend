'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('fund_allocations', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
      },
      fund_request_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'fund_requests',
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
      allocated_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      remaining_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      allocated_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        type: Sequelize.ENUM('active', 'fully_utilized', 'reallocated'),
        defaultValue: 'active',
        allowNull: false,
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: true,
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
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('fund_allocations');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_fund_allocations_status";');
  }
};
