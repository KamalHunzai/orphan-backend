const { Child } = require("../../../models");
const bcrypt = require("bcrypt");
const Joi = require("joi");

// Joi validation schema for updating password
const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

const updatePassword = async (req, res) => {
  try {
    const childId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    // Validate input using Joi
    const { error } = updatePasswordSchema.validate({
      oldPassword,
      newPassword,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    // Find child
    const child = await Child.findByPk(childId);
    if (!child) {
      return res
        .status(404)
        .json({ success: false, message: "Child not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, child.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect old password" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await child.update({ password: hashedPassword });

    // Exclude password from returned object
    const childData = child.toJSON();
    delete childData.password;

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      child: childData,
    });
  } catch (error) {
    console.error("Password update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = updatePassword;
