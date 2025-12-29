"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      Admin.hasMany(models.Child, {
        foreignKey: "admin_id",
        as: "assigned_children",
      });

      Admin.hasMany(models.VisitReport, {
        foreignKey: "admin_id",
        as: "recent_schedules",
      });

      Admin.hasMany(models.Report, {
        foreignKey: "admin_id",
        as: "recent_reports",
      });

      Admin.hasMany(models.Activity, { foreignKey: "admin_id" });
      Admin.hasMany(models.LearningMaterial, { foreignKey: "admin_id" });
      Admin.hasMany(models.Notification, { foreignKey: "admin_id" });

      Admin.hasMany(models.Comment, {
        foreignKey: "admin_id",
        as: "comments",
      });
    }
  }

  Admin.init(
    {
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone_number: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      employment_type: {
        type: DataTypes.STRING,
      },
      years_of_experience: {
        type: DataTypes.INTEGER,
      },
      professional_background: {
        type: DataTypes.TEXT,
      },
      maximum_case_load: {
        type: DataTypes.INTEGER,
      },
      preferred_age_group: {
        type: DataTypes.STRING,
      },
      special_skills: {
        type: DataTypes.TEXT,
      },
      superadmin_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profile_picture: {
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
      modelName: "Admin",
      tableName: "admins",
      underscored: true,
    }
  );

  return Admin;
};
