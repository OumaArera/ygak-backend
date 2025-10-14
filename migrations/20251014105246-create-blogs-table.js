'use strict';

module.exports = {
  /**
   * Defines the 'up' function to create the 'blogs' table.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blogs', {
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
      excerpt: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cover_image: { // Note the use of underscored: true
        type: Sequelize.STRING,
        allowNull: true,
      },
      paragraphs: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      sources: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      published_at: { // Note the use of underscored: true
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_published: { // Note the use of underscored: true
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
   * Defines the 'down' function to drop the 'blogs' table.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('blogs');
  },
};