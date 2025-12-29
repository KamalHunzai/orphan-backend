"use strict";
const { SuperAdmin } = require("../../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
require("dotenv").config();

const signinSuperAdmin = async (req, res) => {
  // ✅ Validate request body
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    const { email, password } = req.body;

    // ✅ Find SuperAdmin (case-insensitive) and not soft-deleted
    const superAdmin = await SuperAdmin.findOne({
      where: { email: email.toLowerCase(), is_deleted: false },
    });

    if (!superAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "SuperAdmin not found" });
    }

    // ✅ Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: superAdmin.id, email: superAdmin.email, role: superAdmin.role },
      process.env.TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Return safe SuperAdmin data
    const {
      id,
      full_name,
      email: userEmail,
      role,
      county,
      number,
    } = superAdmin;

    res.status(200).json({
      success: true,
      message: "Signin successful",
      token,
      superAdmin: { id, full_name, email: userEmail, role, county, number },
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = signinSuperAdmin;
