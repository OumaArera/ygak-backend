'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create the custom ENUM type first, as PostgreSQL requires this
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_contact_submissions_preferred_contact" AS ENUM('Email', 'Phone', 'WhatsApp');
    `);

    // 2. Create the table
    await queryInterface.createTable('contact_submissions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: { isEmail: true },
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      company: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      preferred_contact: { // Note the 'underscored' naming convention
        type: 'enum_contact_submissions_preferred_contact', // Use the custom type
        allowNull: false,
        defaultValue: 'Email',
      },
      heard_from: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      best_time: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // 1. Drop the table
    await queryInterface.dropTable('contact_submissions');

    // 2. Drop the custom ENUM type to clean up the schema
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_contact_submissions_preferred_contact";');
  },
};