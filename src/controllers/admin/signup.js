"use strict";
const { Admin } = require("../../../models");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/emailUtil");

// Generate random strong password
const generatePassword = () => crypto.randomBytes(8).toString("hex");

const FALLBACKS = {
  country: ["Pakistan", "Germany", "Turkey", "USA", "UK"],
  employment_type: ["full_time", "remote", "contract", "part_time"],
  professional_background: [
    "Experienced child support mentor specializing in crisis response and wellbeing.",
    "NGO field worker with hands-on youth development and trauma support expertise.",
    "Community care specialist focusing on education and protective supervision.",
  ],
  preferred_age_group: ["6–12", "13–17", "18+"],
  special_skills: [
    "Trauma care, counseling fundamentals, activity structuring.",
    "Communication coaching, mental wellbeing monitoring.",
    "Education mentoring and behavioral guidance.",
  ],
  maximum_case_load: [10, 15, 20, 25],
};

const signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      country,
      employmentType,
      yearsOfExperience,
      professionalBackground,
      maximumCaseLoad,
      preferredAgeGroup,
      specialSkills,
    } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Check if admin already exists
    const existingMentor = await Admin.findOne({
      where: { email },
    });

    if (existingMentor) {
      return res.status(409).json({
        message:
          "This email is already registered. Contact the admin to reactivate your ID.",
      });
    }

    // Generate & hash password
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Send email
    const emailSent = await sendEmail(email, fullName || email, password);
    if (!emailSent) {
      return res
        .status(500)
        .json({ message: "Email sending failed. Mentor not registered." });
    }

    // Normalize name
    const normalizedName = fullName
      ? fullName
          .toLowerCase()
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : ["Haroon Sher", "Amina Farooq", "Zainab Khan"][
          Math.floor(Math.random() * 3)
        ];

    // Create mentor entry
    const newMentor = await Admin.create({
      full_name: normalizedName,
      email,
      phone_number: phoneNumber || "N/A",
      country:
        country ||
        FALLBACKS.country[Math.floor(Math.random() * FALLBACKS.country.length)],
      employment_type:
        employmentType ||
        FALLBACKS.employment_type[
          Math.floor(Math.random() * FALLBACKS.employment_type.length)
        ],
      years_of_experience:
        yearsOfExperience ?? [3, 5, 7, 10][Math.floor(Math.random() * 4)],
      professional_background:
        professionalBackground ||
        FALLBACKS.professional_background[
          Math.floor(Math.random() * FALLBACKS.professional_background.length)
        ],
      maximum_case_load:
        maximumCaseLoad ??
        FALLBACKS.maximum_case_load[
          Math.floor(Math.random() * FALLBACKS.maximum_case_load.length)
        ],
      preferred_age_group:
        preferredAgeGroup ||
        FALLBACKS.preferred_age_group[
          Math.floor(Math.random() * FALLBACKS.preferred_age_group.length)
        ],
      special_skills:
        specialSkills ||
        FALLBACKS.special_skills[
          Math.floor(Math.random() * FALLBACKS.special_skills.length)
        ],
      password: hashedPassword,
      otp: null,
      otp_expiry: null,
      profile_picture: "mentor_default_avatar",
      superadmin_id: null,
      is_deleted: false,
    });

    // JWT token
    const token = jwt.sign(
      { id: newMentor.id, email: newMentor.email },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Mentor registered successfully. Credentials sent by email.",
      token,
      admin: {
        id: newMentor.id,
        fullName: newMentor.full_name,
        email: newMentor.email,
        country: newMentor.country,
        yearsOfExperience: newMentor.years_of_experience,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = signup;
