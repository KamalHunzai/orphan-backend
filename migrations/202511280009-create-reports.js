"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      child_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "children",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      report_type: {
        type: Sequelize.STRING,
      },
      urgency_level: {
        type: Sequelize.STRING,
      },
      general_condition: {
        type: Sequelize.TEXT,
      },
      recent_doctor_visits: {
        type: Sequelize.TEXT,
      },
      nutrition_status: {
        type: Sequelize.TEXT,
      },
      physical_activities: {
        type: Sequelize.TEXT,
      },
      academic_performance: {
        type: Sequelize.TEXT,
      },
      attendance_participation: {
        type: Sequelize.TEXT,
      },
      mental_state: {
        type: Sequelize.TEXT,
      },
      social_integration: {
        type: Sequelize.TEXT,
      },
      financial_needs: {
        type: Sequelize.TEXT,
      },
      existing_support: {
        type: Sequelize.TEXT,
      },
      notable_events: {
        type: Sequelize.TEXT,
      },
      date: {
        type: Sequelize.DATE,
      },
      time: {
        type: Sequelize.TIME,
      },
      additional_notes: {
        type: Sequelize.TEXT,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
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
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reports");
  },
};
