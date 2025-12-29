// controllers/managementController.js
const { Management } = require("../../../models");

const addManagementBySuperadmin = async (req, res) => {
  try {
    const { full_name, email, phone_number, country, role, superadmin_id } =
      req.body;

    // Validate required fields
    if (
      !full_name ||
      !email ||
      !phone_number ||
      !country ||
      !role ||
      !superadmin_id
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const existing = await Management.findOne({
      where: { email, is_deleted: false }, // ✅ soft delete check
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Create management
    const management = await Management.create({
      full_name,
      email,
      phone_number,
      country,
      role,
      superadmin_id,
    });

    return res.status(201).json({
      success: true,
      message: "Management created successfully",
      data: management,
    });
  } catch (error) {
    console.error("Add Management Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = addManagementBySuperadmin;
