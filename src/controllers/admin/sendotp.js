const { admin } = require("../../../models");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
require("dotenv").config();

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Verified sender
const VERIFIED_SENDER = process.env.SENDGRID_FROM_EMAIL; // e.g., mentoring@hasene.org

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    // ✅ Find user and exclude soft-deleted
    const user = await admin.findOne({
      where: {
        email,
        is_deleted: false, // ✅ soft delete check
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No user found with email: ${email}`,
        });
    }

    // Generate OTP & expiry
    const otp = crypto.randomInt(1000, 9999);
    const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update OTP in DB
    await user.update({ otp, otp_expiry });

    // Prepare email
    const msg = {
      to: email,
      from: {
        email: VERIFIED_SENDER,
        name: "Hasene Int. Support",
      },
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
    };

    // Send email
    await sgMail.send(msg);

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully." });
  } catch (error) {
    console.error(
      "Error sending OTP:",
      error.response?.body?.errors || error.message
    );
    return res
      .status(500)
      .json({ success: false, error: "Failed to send OTP." });
  }
};

module.exports = sendOtp;
