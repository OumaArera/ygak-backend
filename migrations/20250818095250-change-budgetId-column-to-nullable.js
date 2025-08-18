'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('asset_requests', 'budget_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('asset_requests', 'budget_id', {
      type: Sequelize.UUID,
      allowNull: false, 
    });
  },
};
