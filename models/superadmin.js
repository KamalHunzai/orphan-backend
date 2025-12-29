"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SuperAdmin extends Model {
    static associate(models) {
      // Define associations here in future if needed
      // Example:
      // SuperAdmin.hasMany(models.Admin, { foreignKey: 'superadmin_id', as: 'admins' });
    }
  }

  SuperAdmin.init(
    {
      full_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      county: {
        type: DataTypes.STRING,
      },
      role: {
        type: DataTypes.STRING,
      },
      number: {
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
      modelName: "SuperAdmin",
      tableName: "super_admins",
      underscored: true,
      timestamps: true,
    }
  );

  return SuperAdmin;
};
