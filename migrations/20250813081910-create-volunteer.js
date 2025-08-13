'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('volunteers', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      otherNames: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sex: {
        type: Sequelize.ENUM('Male', 'Female'),
        allowNull: false
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      nextOfKinName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nextOfKinPhoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nextOfKinEmail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isStudent: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      institutionId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'institutions',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      schoolRegNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      identificationNumber: {
        type: Sequelize.STRING,
        allowNull: true
      },
      regNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      countyOfResidence: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subCountyOfResidence: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nationality: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isApproved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isExpelled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isSuspended: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('volunteers');
  }
};
