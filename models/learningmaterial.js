"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LearningMaterial extends Model {
    static associate(models) {
      // Associate LearningMaterial with Admin
      LearningMaterial.belongsTo(models.Admin, {
        foreignKey: "admin_id",
        as: "admin",
      });
    }
  }

  LearningMaterial.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      related_tag: {
        type: DataTypes.STRING,
      },
      due_date: {
        type: DataTypes.DATE,
      },
      due_time: {
        type: DataTypes.TIME,
      },
      priority: {
        type: DataTypes.STRING,
        defaultValue: "normal",
      },
      task_type: {
        type: DataTypes.STRING,
      },
      file: {
        type: DataTypes.STRING,
      },
      admin_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      file_type: {
        type: DataTypes.STRING,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "LearningMaterial",
      tableName: "learning_materials",
      underscored: true,
      timestamps: true,
    }
  );

  return LearningMaterial;
};
