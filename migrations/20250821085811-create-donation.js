'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('donations', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      other_names: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('Mpesa', 'Debit Card', 'PayPal'),
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      mpesa_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      debit_card_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paypal_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      transaction_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      transactional_particulars: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      donor_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      donor_phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Paid', 'Declined'),
        allowNull: false,
        defaultValue: 'Pending',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('donations');
  },
};
