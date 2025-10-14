'use strict';

module.exports = {
  /**
   * Defines the 'up' function to create the 'newsletter_subscriptions' table.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('newsletter_subscriptions', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        // Uses PostgreSQL's function to generate UUIDs
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Enforces the unique constraint from your model
      },
      is_active: { // Note the use of underscored: true
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      // Timestamps (underscored: true)
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

  /**
   * Defines the 'down' function to drop the 'newsletter_subscriptions' table.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('newsletter_subscriptions');
  },
};