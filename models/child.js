"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Child extends Model {
    static associate(models) {
      Child.hasMany(models.Task, { foreignKey: "child_id", as: "tasks" });
      Child.hasMany(models.VisitPlanning, {
        foreignKey: "child_id",
        as: "visit_plannings",
      });
      Child.hasMany(models.VisitReport, {
        foreignKey: "child_id",
        as: "visit_reports",
      });
      Child.hasMany(models.Activity, {
        foreignKey: "child_id",
        as: "activities",
      });
      Child.hasMany(models.Report, { foreignKey: "child_id", as: "reports" });
      Child.hasMany(models.Notification, {
        foreignKey: "child_id",
        as: "notifications",
      });

      Child.belongsTo(models.Admin, {
        foreignKey: "admin_id",
        as: "assigned_admin",
      });
    }
  }

  Child.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
      },
      gender: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      language: {
        type: DataTypes.STRING,
      },
      guardian_name: {
        type: DataTypes.STRING,
      },
      relationship: {
        type: DataTypes.STRING,
      },
      contact_number: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      general_condition: {
        type: DataTypes.TEXT,
      },
      current_education_level: {
        type: DataTypes.STRING,
      },
      school_performance: {
        type: DataTypes.TEXT,
      },
      psychological_support_needs: {
        type: DataTypes.TEXT,
      },
      financial_situation: {
        type: DataTypes.TEXT,
      },
      additional_notes: {
        type: DataTypes.TEXT,
      },
      profile_picture: {
        type: DataTypes.STRING,
      },
      password: {
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
      upload: {
        type: DataTypes.STRING,
      },
      otp: {
        type: DataTypes.INTEGER,
      },
      otp_expiry: {
        type: DataTypes.DATE,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Child",
      tableName: "children",
      underscored: true,
    }
  );

  return Child;
};
