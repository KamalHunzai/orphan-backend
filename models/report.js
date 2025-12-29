"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      // Report belongs to a Child
      Report.belongsTo(models.Child, {
        foreignKey: "child_id",
        as: "child",
      });
      // Report belongs to an Admin
      Report.belongsTo(models.Admin, {
        foreignKey: "admin_id",
        as: "admin",
      });
    }
  }

  Report.init(
    {
      admin_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
      report_type: {
        type: DataTypes.STRING,
      },
      urgency_level: {
        type: DataTypes.STRING,
      },
      general_condition: {
        type: DataTypes.TEXT,
      },
      recent_doctor_visits: {
        type: DataTypes.TEXT,
      },
      nutrition_status: {
        type: DataTypes.TEXT,
      },
      physical_activities: {
        type: DataTypes.TEXT,
      },
      academic_performance: {
        type: DataTypes.TEXT,
      },
      attendance_participation: {
        type: DataTypes.TEXT,
      },
      mental_state: {
        type: DataTypes.TEXT,
      },
      social_integration: {
        type: DataTypes.TEXT,
      },
      financial_needs: {
        type: DataTypes.TEXT,
      },
      existing_support: {
        type: DataTypes.TEXT,
      },
      notable_events: {
        type: DataTypes.TEXT,
      },
      date: {
        type: DataTypes.DATE,
      },
      time: {
        type: DataTypes.TIME,
      },
      additional_notes: {
        type: DataTypes.TEXT,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Report",
      tableName: "reports",
      underscored: true,
      timestamps: true,
    }
  );

  return Report;
};
