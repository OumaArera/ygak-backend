'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('tasks', 'start_date', {
      type: Sequelize.DATEONLY,
      allowNull: false
    });

    await queryInterface.changeColumn('tasks', 'end_date', {
      type: Sequelize.DATEONLY,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('tasks', 'start_date', {
      type: Sequelize.DATE,
      allowNull: false
    });

    await queryInterface.changeColumn('tasks', 'end_date', {
      type: Sequelize.DATE,
      allowNull: false
    });
  }
};
