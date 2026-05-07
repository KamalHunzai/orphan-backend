"use strict";

// Depends on: admins
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("learning_materials", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      related_tag: {
        type: Sequelize.STRING,
      },
      due_date: {
        type: Sequelize.DATE,
      },
      due_time: {
        type: Sequelize.TIME,
      },
      priority: {
        type: Sequelize.STRING,
        defaultValue: "normal",
      },
      task_type: {
        type: Sequelize.STRING,
      },
      file: {
        type: Sequelize.STRING,
      },
      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      file_type: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("learning_materials", { cascade: true });
  },
};
