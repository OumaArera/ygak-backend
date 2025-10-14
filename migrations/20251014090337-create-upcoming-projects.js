'use strict';

module.exports = {
  /**
   * Defines the 'up' function to create the 'upcoming_projects' table.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('upcoming_projects', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        // Uses PostgreSQL's function to generate UUIDs
        defaultValue: Sequelize.literal('gen_random_uuid()'), 
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      theme: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING, // Store the URL or path to the image
        allowNull: true,
      },
      // Timestamps based on your model configuration (underscored: true)
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
   * Defines the 'down' function to drop the 'upcoming_projects' table.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('upcoming_projects');
  },
};