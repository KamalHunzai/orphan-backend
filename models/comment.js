"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // Associate Comment with Journal
      Comment.belongsTo(models.Journal, {
        foreignKey: "journal_id",
        as: "journal",
      });

      // Associate Comment with Admin
      Comment.belongsTo(models.Admin, {
        foreignKey: "admin_id",
        as: "admin",
      });
    }
  }

  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      journal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "journals",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "comments",
      underscored: true,
      timestamps: true,
    }
  );

  return Comment;
};
