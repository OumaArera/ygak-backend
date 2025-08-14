'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reports', 'task_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'tasks',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('reports', 'task_id');
  }
};
