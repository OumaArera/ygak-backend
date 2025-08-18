'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
      },

      current_user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      tag: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      serial_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },

      acquisition_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      value: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM('available', 'in_use', 'under_repair', 'retired'),
        allowNull: false,
        defaultValue: 'available',
      },

      last_maintenance_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },

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

  async down(queryInterface, Sequelize) {
    // Drop ENUM type separately in Postgres
    await queryInterface.dropTable('inventory');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_inventory_status;');
  },
};
