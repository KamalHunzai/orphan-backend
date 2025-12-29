"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Announcement extends Model {
    static associate(models) {
      // If in future you want associations, define them here
      // Example:
      // Announcement.belongsTo(models.Admin, { foreignKey: 'superadmin_id', as: 'superadmin' });
    }
  }

  Announcement.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      priority: {
        type: DataTypes.STRING,
        defaultValue: "normal",
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
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Announcement",
      tableName: "announcements",
      underscored: true,
    }
  );

  return Announcement;
};
