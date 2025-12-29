"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class VisitPlanning extends Model {
    static associate(models) {
      // VisitPlanning belongs to a Child
      VisitPlanning.belongsTo(models.Child, {
        foreignKey: "child_id",
        as: "child",
      });

      // Optional: VisitPlanning belongs to Admin
      VisitPlanning.belongsTo(models.Admin, {
        foreignKey: "admin_id",
        as: "admin",
      });
    }
  }

  VisitPlanning.init(
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
      admin_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "admins",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      visit_date: {
        type: DataTypes.DATE,
      },
      visit_time: {
        type: DataTypes.TIME,
      },
      visit_type: {
        type: DataTypes.STRING,
      },
      notes: {
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
      modelName: "VisitPlanning",
      tableName: "visit_plannings",
      underscored: true,
      timestamps: true,
    }
  );

  return VisitPlanning;
};
