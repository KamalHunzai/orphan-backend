const { Child } = require("../../../models");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// ✅ Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ✅ Verified sender
const VERIFIED_SENDER =
  process.env.SENDGRID_FROM_EMAIL || "mentoring@hasene.org";

const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });
  }

  try {
    // Find child by email
    const child = await Child.findOne({ where: { email } });
    if (!child) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No user found with email: ${email}`,
        });
    }

    // Generate 4-digit OTP and expiry (10 minutes)
    const otp = crypto.randomInt(1000, 9999);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update OTP in database
    await child.update({ otp, otpExpiry });

    // Prepare and send email via SendGrid
    const msg = {
      to: email,
      from: VERIFIED_SENDER,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
    };

    await sgMail.send(msg);

    res.status(200).json({ success: true, message: "OTP sent successfully." });
  } catch (error) {
    console.error(
      "Error sending OTP:",
      error.response?.body || error.message || error
    );
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
};

module.exports = sendOtp;
