const { Child } = require("../../../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login_child = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email_and_password_are_required",
      });
    }

    // Find child by email (DB column is snake_case)
    const child = await Child.findOne({ where: { email } });
    if (!child) {
      return res.status(404).json({
        success: false,
        message: "user_not_found",
      });
    }

    // Verify password
    const is_match = await bcrypt.compare(password, child.password);
    if (!is_match) {
      return res.status(401).json({
        success: false,
        message: "invalid_credentials",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: child.id, email: child.email },
      process.env.TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password
    const { password: __, ...child_json } = child.toJSON();

    // Map snake_case → camelCase for response
    const child_response = {
      id: child_json.id,
      firstName: child_json.first_name,
      lastName: child_json.last_name,
      profilePicture: child_json.profile_picture,
      email: child_json.email,
      phoneNumber: child_json.phone_number,
      country: child_json.country,
      city: child_json.city,
      dateOfBirth: child_json.date_of_birth,
      admissionDate: child_json.admission_date,
      isActive: child_json.is_active,
      isDeleted: child_json.is_deleted,
      createdAt: child_json.created_at,
      updatedAt: child_json.updated_at,
    };

    // Remove undefined fields (in case some don't exist)
    Object.keys(child_response).forEach(
      (k) => child_response[k] === undefined && delete child_response[k]
    );

    return res.status(200).json({
      success: true,
      message: "sign_in_successful",
      token,
      child: child_response,
    });
  } catch (error) {
    console.error("login_child_error:", error);
    return res.status(500).json({
      success: false,
      message: "internal_server_error",
      error: error.message,
    });
  }
};

module.exports = login_child;
