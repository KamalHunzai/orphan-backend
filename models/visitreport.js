"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VisitReport extends Model {
    static associate(models) {
      // VisitReport belongs to a Child
      VisitReport.belongsTo(models.Child, {
        foreignKey: "child_id",
        as: "child",
      });

      // VisitReport belongs to an Admin
      VisitReport.belongsTo(models.Admin, {
        foreignKey: "admin_id",
        as: "admin",
      });
    }
  }

  VisitReport.init(
    {
      child_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "children",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      donor_id: {
        type: DataTypes.INTEGER,
      },
      visit_date: {
        type: DataTypes.DATE,
      },
      visit_time: {
        type: DataTypes.STRING,
      },
      visit_type: {
        type: DataTypes.STRING,
      },
      notes: {
        type: DataTypes.TEXT,
      },
      status: {
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
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "VisitReport",
      tableName: "visit_reports",
      underscored: true,
      timestamps: true,
    }
  );

  return VisitReport;
};
