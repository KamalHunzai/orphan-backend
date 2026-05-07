"use strict";

// Depends on: admins (migration 02)
// Adds role column that was not included in the initial admins table
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("admins", "role", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "admin",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("admins", "role");
  },
};
