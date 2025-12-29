"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Journal extends Model {
    static associate(models) {
      // A Journal has many Comments
      Journal.hasMany(models.Comment, {
        foreignKey: "journal_id",
        as: "comments",
      });

      // Journal belongs to Child
      Journal.belongsTo(models.Child, {
        foreignKey: "child_id",
        as: "child",
      });
    }
  }

  Journal.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      journal_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      emotion_tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      social_interaction: {
        type: DataTypes.STRING,
      },
      assessment_type: {
        type: DataTypes.STRING,
      },
      notes: {
        type: DataTypes.TEXT,
      },
      uploaded_file: {
        type: DataTypes.STRING,
      },
      mood_rating: {
        type: DataTypes.INTEGER,
      },
      activities: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      child_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "children",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Journal",
      tableName: "journals",
      underscored: true,
      timestamps: true,
    }
  );

  return Journal;
};
