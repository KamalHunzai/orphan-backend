const { Child } = require("../../../models");

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required.",
    });
  }

  try {
    // Find the child by email
    const child = await Child.findOne({ where: { email } });

    if (!child) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Validate OTP
    if (child.otp !== parseInt(otp, 10)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    // Check if OTP is expired
    if (!child.otpExpiry || new Date() > new Date(child.otpExpiry)) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. You can now update your password.",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP.",
      error: error.message,
    });
  }
};

module.exports = verifyOtp;
