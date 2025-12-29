"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    static associate(models) {
      // Associate Activity with Child
      Activity.belongsTo(models.Child, {
        foreignKey: "child_id",
        as: "child",
      });

      // Associate Activity with Admin
      Activity.belongsTo(models.Admin, {
        foreignKey: "admin_id",
        as: "admin",
      });
    }
  }

  Activity.init(
    {
      activity_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      child_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "children",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      attachments: {
        type: DataTypes.STRING,
      },
      admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
      uploaded_file: {
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
      modelName: "Activity",
      tableName: "activities",
      underscored: true,
    }
  );

  return Activity;
};
