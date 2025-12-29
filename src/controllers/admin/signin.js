"use strict";
const { Admin } = require("../../../models");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Validation schema
const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const signin = async (req, res) => {
  try {
    // Validate request body
    const { error } = signinSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    let { email, password } = req.body;
    email = email.toLowerCase(); // normalize email

    // ✅ Find admin and exclude soft-deleted
    const existingAdmin = await Admin.findOne({
      where: {
        email,
        is_deleted: false, // exclude soft-deleted admins
      },
    });

    if (!existingAdmin)
      return res.status(400).json({ message: "Invalid email or password" });

    // Validate password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password" });

    // Create JWT token
    const token = jwt.sign(
      { id: existingAdmin.id, email: existingAdmin.email },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Return response
    return res.status(200).json({
      message: "Signin successful",
      admin: {
        id: existingAdmin.id,
        email: existingAdmin.email,
        fullName: existingAdmin.full_name,
        country: existingAdmin.country,
        employmentType: existingAdmin.employment_type,
        yearsOfExperience: existingAdmin.years_of_experience,
        preferredAgeGroup: existingAdmin.preferred_age_group,
      },
      token,
    });
  } catch (err) {
    console.error("Signin Error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = signin;
