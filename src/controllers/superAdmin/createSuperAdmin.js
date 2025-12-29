"use strict";
const { SuperAdmin } = require("../../../models");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const VERIFIED_SENDER = process.env.SENDGRID_FROM_EMAIL;

const createSuperAdmin = async (req, res) => {
  const schema = Joi.object({
    fullname: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    county: Joi.string().required(),
    number: Joi.string().allow("", null).default("0000000000"),
    role: Joi.string().allow("", null).default("superadmin"),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // Apply fallbacks with realistic placeholders
  const fullname = value.fullname || "John Doe";
  const email = value.email;
  const county = value.county || "N/A";
  const number = value.number || "000-000-0000";
  const role = value.role || "superadmin";

  try {
    // -------------------------------
    //  CHECK IF EMAIL EXISTS
    // -------------------------------
    const existingEmail = await SuperAdmin.findOne({ where: { email } });
    if (existingEmail)
      return res
        .status(409)
        .json({ message: "This email is already registered." });

    // -------------------------------
    //  ENSURE ONLY 1 SUPERADMIN ROLE
    // -------------------------------
    const existingRoleUser = await SuperAdmin.findOne({ where: { role } });
    if (existingRoleUser)
      return res.status(409).json({ message: `A '${role}' already exists.` });

    // -------------------------------
    //  GENERATE PASSWORD
    // -------------------------------
    const plainPassword = crypto.randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // -------------------------------
    //  SEND EMAIL
    // -------------------------------
    await sgMail.send({
      to: email,
      from: { email: VERIFIED_SENDER, name: "Hasene Int. Support" },
      subject: `Your ${role} Account`,
      html: `
        <p>Hello <strong>${fullname}</strong>,</p>
        <p>Your ${role} account has been created successfully.</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Temporary Password:</strong> ${plainPassword}</li>
        </ul>
        <p>Please log in and change your password immediately for security reasons.</p>
      `,
    });

    // -------------------------------
    //  CREATE SUPERADMIN RECORD
    // -------------------------------
    const superAdmin = await SuperAdmin.create({
      full_name: fullname,
      email,
      county,
      number,
      role,
      password: hashedPassword,
      profile_picture:
        "https://dummyimage.com/150x150/cccccc/000000.png&text=Profile",
      upload: "https://dummyfilestorage.com/default_upload.pdf",
      otp: 0,
      otp_expiry: new Date(),
      is_deleted: false,
      professional_background: "No professional background provided yet.",
      maximum_case_load: 0,
      preferred_age_group: "All ages",
      special_skills: "Not specified",
    });

    return res.status(201).json({
      message: "SuperAdmin created successfully, password sent via email.",
      data: superAdmin,
    });
  } catch (err) {
    console.error("Error creating SuperAdmin:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = createSuperAdmin;
