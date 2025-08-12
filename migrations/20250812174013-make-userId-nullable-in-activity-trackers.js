module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('activity_trackers', 'userId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('activity_trackers', 'userId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    });
  }
};
