'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
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
      allocation_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'fund_allocations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      paid_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      payment_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM(
          'Bank Transfer',
          'Mpesa Pay Bill',
          'Mpesa Buy Goods',
          'Mpesa Pochi la Biashara',
          'Mpesa Send Money',
          'Cash',
          'Cheque'
        ),
        allowNull: false,
      },
      transaction_reference: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      supporting_document: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'reversed'),
        defaultValue: 'pending',
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
    await queryInterface.dropTable('payments');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payments_payment_method";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payments_status";');
  }
};
