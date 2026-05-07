const { Child } = require("../../../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login_child = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const child = await Child.findOne({ where: { email, is_deleted: false } });
    if (!child) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const is_match = await bcrypt.compare(password, child.password);
    if (!is_match) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: child.id, email: child.email, role: "child" },
      process.env.TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const { password: __, ...child_json } = child.toJSON();

    const child_response = {
      id: child_json.id,
      firstName: child_json.first_name,
      lastName: child_json.last_name,
      profilePicture: child_json.profile_picture,
      email: child_json.email,
      adminId: child_json.admin_id,
    };

    Object.keys(child_response).forEach(
      (k) => child_response[k] === undefined && delete child_response[k]
    );

    return res.status(200).json({
      success: true,
      message: "Signed in successfully",
      token,
      child: child_response,
    });
  } catch (error) {
    console.error("login_child_error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = login_child;
