"use strict";

// Depends on: super_admins
// NOTE: role column is NOT included here — added by migration 20251128000015
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admins", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      employment_type: {
        type: Sequelize.STRING,
      },
      years_of_experience: {
        type: Sequelize.INTEGER,
      },
      professional_background: {
        type: Sequelize.TEXT,
      },
      maximum_case_load: {
        type: Sequelize.INTEGER,
      },
      preferred_age_group: {
        type: Sequelize.STRING,
      },
      special_skills: {
        type: Sequelize.TEXT,
      },
      superadmin_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "super_admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      profile_picture: {
        type: Sequelize.STRING,
      },
      otp: {
        type: Sequelize.INTEGER,
      },
      otp_expiry: {
        type: Sequelize.DATE,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("admins", { cascade: true });
  },
};
