const { Admin } = require("../../../models");

const deleteAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Admin ID is required." });
    }

    // Find the admin by ID, exclude already soft-deleted
    const adminData = await Admin.findOne({
      where: {
        id,
        is_deleted: false, // ✅ skip already deleted
      },
    });

    if (!adminData) {
      return res
        .status(404)
        .json({ message: "Admin not found or already deleted." });
    }

    // Soft delete by setting is_deleted = true
    adminData.is_deleted = true;
    await adminData.save();

    res
      .status(200)
      .json({ message: "Admin deleted successfully (soft delete)." });
  } catch (error) {
    console.error("Delete Admin By ID Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = deleteAdminById;
