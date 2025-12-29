const { admin } = require("../../../models");
const bcrypt = require("bcryptjs");

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters.",
        });
    }

    // Find the admin by email and ensure not soft-deleted
    const user = await admin.findOne({
      where: {
        email,
        is_deleted: false, // ✅ respect soft delete
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Failed to update password.",
        error: error.message,
      });
  }
};

module.exports = resetPassword;
