'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('institutions', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      county: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subCounty: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('university', 'college', 'TVET', 'polytechnic'),
        allowNull: false
      },
      ownership: {
        type: Sequelize.ENUM('public', 'private'),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('institutions');
  }
};
