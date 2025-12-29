"use strict";
const { Admin } = require("../../../models");
const bcrypt = require("bcryptjs");

// Fallbacks for optional fields
const REALISTIC_BACKGROUNDS = [
  "Senior mentor experienced in child welfare and psychosocial support.",
  "NGO professional specializing in at-risk children assistance.",
  "Field support mentor focused on wellbeing, education, and safety.",
];

const DEFAULT_AVATARS = [
  "default_avatar_mentor_1",
  "default_avatar_mentor_2",
  "default_avatar_mentor_3",
];

// Normalize names or text
const normalizeText = (text) =>
  text
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const updateAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const {
      fullName,
      email,
      currentPassword,
      newPassword,
      phoneNumber,
      country,
      professionalBackground,
    } = req.body;

    // Find admin and exclude soft-deleted
    const adminInstance = await Admin.findOne({
      where: { id: adminId, is_deleted: false },
    });
    if (!adminInstance)
      return res.status(404).json({ message: "Admin not found" });

    // ----- PASSWORD UPDATE -----
    let hashedPassword = adminInstance.password;
    if (newPassword) {
      if (!currentPassword)
        return res.status(400).json({
          message: "Current password is required to update password",
        });

      const isMatch = await bcrypt.compare(
        currentPassword,
        adminInstance.password
      );
      if (!isMatch)
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });

      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // ----- PREPARE UPDATE DATA -----
    const updateData = {};

    if (fullName) updateData.full_name = normalizeText(fullName);
    if (email) updateData.email = email.toLowerCase();
    if (phoneNumber) updateData.phone_number = phoneNumber;
    if (country) updateData.country = country;
    if (professionalBackground)
      updateData.professional_background = normalizeText(
        professionalBackground
      );
    else if (!adminInstance.professional_background)
      updateData.professional_background =
        REALISTIC_BACKGROUNDS[
          Math.floor(Math.random() * REALISTIC_BACKGROUNDS.length)
        ];

    if (newPassword) updateData.password = hashedPassword;

    // Profile picture handling
    if (req.file?.location) {
      updateData.profile_picture = req.file.location;
    } else if (!adminInstance.profile_picture) {
      updateData.profile_picture =
        DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
    }

    if (Object.keys(updateData).length === 0)
      return res
        .status(400)
        .json({ message: "No valid fields or file provided to update" });

    // Apply update
    const [updatedCount] = await Admin.update(updateData, {
      where: { id: adminId },
    });
    if (!updatedCount)
      return res
        .status(400)
        .json({ message: "Update failed or no changes applied" });

    // Fetch updated admin (exclude sensitive fields)
    const updatedAdmin = await Admin.findByPk(adminId, {
      attributes: { exclude: ["password", "otp", "otp_expiry"] },
    });

    return res.status(200).json({
      message: "Admin updated successfully",
      admin: updatedAdmin,
    });
  } catch (err) {
    console.error("Update Admin Error:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

module.exports = updateAdmin;
