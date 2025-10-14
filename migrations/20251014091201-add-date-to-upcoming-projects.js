'use strict';

const tableName = 'upcoming_projects';
const columnName = 'date';

module.exports = {
  /**
   * Adds the 'date' column to the 'upcoming_projects' table.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      tableName,
      columnName,
      {
        type: Sequelize.DATEONLY,
        allowNull: true, // Set to false if you require a date
      }
    );
  },

  /**
   * Removes the 'date' column from the 'upcoming_projects' table.
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(tableName, columnName);
  },
};