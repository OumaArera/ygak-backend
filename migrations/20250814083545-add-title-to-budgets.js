'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('budgets', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Test Budget',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('budgets', 'title');
  }
};
