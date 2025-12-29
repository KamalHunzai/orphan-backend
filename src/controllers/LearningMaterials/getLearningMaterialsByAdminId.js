const { LearningMaterial } = require("../../../models");

// Get Learning Materials by Admin ID (excluding soft-deleted)
const getLearningMaterialsByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId || isNaN(Number(adminId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID",
      });
    }

    const materials = await LearningMaterial.findAll({
      where: {
        admin_id: Number(adminId), // ✅ underscored column
        is_deleted: false, // ✅ respect soft delete
      },
      order: [["created_at", "DESC"]], // ✅ newest first
    });

    return res.status(200).json({
      success: true,
      message: "Learning materials retrieved successfully",
      count: materials.length,
      data: materials,
    });
  } catch (err) {
    console.error("Error fetching learning materials by admin:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = getLearningMaterialsByAdminId;
