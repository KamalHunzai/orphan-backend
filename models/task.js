"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      // Task belongs to a Child
      Task.belongsTo(models.Child, {
        foreignKey: "child_id",
        as: "child",
      });

      // Optional: Task belongs to Admin
      Task.belongsTo(models.Admin, {
        foreignKey: "admin_id",
        as: "admin",
      });
    }
  }

  Task.init(
    {
      task_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      child_name: {
        type: DataTypes.STRING,
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
      admin_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      due_date: {
        type: DataTypes.DATE,
      },
      due_time: {
        type: DataTypes.TIME,
      },
      priority: {
        type: DataTypes.STRING,
      },
      task_type: {
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
      modelName: "Task",
      tableName: "tasks",
      underscored: true,
      timestamps: true,
    }
  );

  return Task;
};
