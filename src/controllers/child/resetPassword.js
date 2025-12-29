const { Child } = require("../../../models");
const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 6 characters.",
        });
    }

    // Find child by email
    const child = await Child.findOne({ where: { email } });
    if (!child) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Hash and update password
    child.password = await bcrypt.hash(newPassword, 10);
    await child.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("ResetPassword Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update password." });
  }
};

module.exports = resetPassword;
