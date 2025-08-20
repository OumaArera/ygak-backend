'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Make description NOT NULL
    await queryInterface.changeColumn('events', 'description', {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    // Make sub_county NOT NULL
    await queryInterface.changeColumn('events', 'sub_county', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Make latitude NULLABLE
    await queryInterface.changeColumn('events', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
    });

    // Make longitude NULLABLE
    await queryInterface.changeColumn('events', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert description back to nullable
    await queryInterface.changeColumn('events', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Revert sub_county back to nullable
    await queryInterface.changeColumn('events', 'sub_county', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Revert latitude back to NOT NULL
    await queryInterface.changeColumn('events', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: false,
    });

    // Revert longitude back to NOT NULL
    await queryInterface.changeColumn('events', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: false,
    });
  },
};
