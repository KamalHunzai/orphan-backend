"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("activities", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      activity_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      child_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "children",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      time: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      attachments: {
        type: Sequelize.STRING,
      },
      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "pending",
      },
      uploaded_file: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("activities");
  },
};
