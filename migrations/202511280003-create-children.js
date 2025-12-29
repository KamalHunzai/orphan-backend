"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("children", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      age: {
        type: Sequelize.INTEGER,
      },
      gender: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      language: {
        type: Sequelize.STRING,
      },
      guardian_name: {
        type: Sequelize.STRING,
      },
      relationship: {
        type: Sequelize.STRING,
      },
      contact_number: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      general_condition: {
        type: Sequelize.TEXT,
      },
      current_education_level: {
        type: Sequelize.STRING,
      },
      school_performance: {
        type: Sequelize.TEXT,
      },
      psychological_support_needs: {
        type: Sequelize.TEXT,
      },
      financial_situation: {
        type: Sequelize.TEXT,
      },
      additional_notes: {
        type: Sequelize.TEXT,
      },
      profile_picture: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      admin_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      upload: {
        type: Sequelize.STRING,
      },
      otp: {
        type: Sequelize.INTEGER,
      },
      otp_expiry: {
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("children");
  },
};
