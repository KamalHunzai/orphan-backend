const { Admin } = require("../../../models");

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find admin by ID and exclude soft-deleted
    const adminData = await Admin.findOne({
      where: {
        id,
        is_deleted: false, // ✅ exclude soft-deleted admins
      },
      attributes: { exclude: ["password", "otp", "otp_expiry"] }, // optional sensitive info exclusion
    });

    if (!adminData) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json(adminData);
  } catch (error) {
    console.error("Get Admin By ID Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = getAdminById;
