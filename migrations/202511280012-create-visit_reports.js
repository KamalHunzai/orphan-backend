"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("visit_reports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      donor_id: {
        type: Sequelize.INTEGER,
      },
      visit_date: {
        type: Sequelize.DATE,
      },
      visit_time: {
        type: Sequelize.STRING,
      },
      visit_type: {
        type: Sequelize.STRING,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      status: {
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
    await queryInterface.dropTable("visit_reports");
  },
};
