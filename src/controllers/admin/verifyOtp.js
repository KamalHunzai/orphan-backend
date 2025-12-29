const { Admin } = require("../../../models");

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required." });
  }

  try {
    // ✅ Find admin by email and exclude soft-deleted accounts
    const user = await Admin.findOne({
      where: {
        email: email.toLowerCase(),
        is_deleted: false, // ✅ only active admins
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // ✅ Check OTP
    if (user.otp !== parseInt(otp, 10)) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    // ✅ Check OTP expiry
    if (!user.otp_expiry || new Date() > new Date(user.otp_expiry)) {
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired." });
    }

    // OTP is valid
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now update your password.",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to verify OTP.",
    });
  }
};

module.exports = verifyOtp;
