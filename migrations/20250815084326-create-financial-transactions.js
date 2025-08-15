'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('financial_transactions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
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
      budget_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'budgets',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      payment_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'payments',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      allocation_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'fund_allocations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      transaction_type: {
        type: Sequelize.ENUM(
          'fund_allocation',
          'payment',
          'reallocation_debit',
          'reallocation_credit',
          'adjustment',
          'reversal'
        ),
        allowNull: false,
      },
      debit_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00,
      },
      credit_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.00,
      },
      running_balance: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      processed_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      transaction_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
    await queryInterface.dropTable('financial_transactions');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_financial_transactions_transaction_type";');
  }
};
