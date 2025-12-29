"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("journals", {
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
      journal_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      emotion_tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      social_interaction: {
        type: Sequelize.STRING,
      },
      assessment_type: {
        type: Sequelize.STRING,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      uploaded_file: {
        type: Sequelize.STRING,
      },
      mood_rating: {
        type: Sequelize.INTEGER,
      },
      activities: {
        type: Sequelize.ARRAY(Sequelize.STRING),
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
    await queryInterface.dropTable("journals");
  },
};
