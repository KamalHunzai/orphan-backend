"use strict";
const { SuperAdmin } = require("../../../models");
const bcrypt = require("bcrypt");

const updateSuperAdmin = async (req, res) => {
  const { id } = req.params;
  const { fullname, email, currentPassword, newPassword } = req.body;

  try {
    // ✅ Find SuperAdmin by ID (only non-deleted)
    const superAdmin = await SuperAdmin.findOne({
      where: { id, is_deleted: false },
    });
    if (!superAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "SuperAdmin not found" });
    }

    // ✅ Update password if newPassword is provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to set a new password",
        });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        superAdmin.password
      );
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      superAdmin.password = await bcrypt.hash(newPassword, 10);
    }

    // ✅ Update other fields if provided
    if (fullname) superAdmin.full_name = fullname;
    if (email) superAdmin.email = email;

    // ✅ Save changes
    await superAdmin.save();

    res.status(200).json({
      success: true,
      message: "SuperAdmin updated successfully",
      data: {
        id: superAdmin.id,
        full_name: superAdmin.full_name,
        email: superAdmin.email,
        county: superAdmin.county,
        number: superAdmin.number,
        role: superAdmin.role,
      },
    });
  } catch (err) {
    console.error("Error updating SuperAdmin:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = updateSuperAdmin;
