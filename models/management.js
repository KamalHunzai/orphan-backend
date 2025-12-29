"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Management extends Model {
    static associate(models) {
      // Define associations here in future if needed
      // Example:
      // Management.belongsTo(models.Admin, { foreignKey: 'superadmin_id', as: 'superadmin' });
    }
  }

  Management.init(
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
      role: {
        type: DataTypes.STRING,
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
      modelName: "Management",
      tableName: "managements",
      underscored: true,
      timestamps: true,
    }
  );

  return Management;
};
