'use strict';

module.exports = {
  /**
   * Defines the 'up' function to create the 'event_registrations' table.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('event_registrations', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      // Foreign Key Definition
      event_id: {
        type: Sequelize.UUID,
        allowNull: false,
        // Define the foreign key constraint
        references: {
          model: 'events', // The table name the key references
          key: 'id',       // The column name in the events table
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Ensures registration is deleted if event is deleted
      },
      full_name: { // underscored: true
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone_number: { // underscored: true
        type: Sequelize.STRING(20),
        allowNull: false,
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
   * Defines the 'down' function to drop the 'event_registrations' table.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('event_registrations');
  },
};
