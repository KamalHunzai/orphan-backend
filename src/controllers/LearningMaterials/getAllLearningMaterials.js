const { LearningMaterial } = require("../../../models");

// Get all Learning Materials (excluding soft-deleted)
const getAllLearningMaterials = async (req, res) => {
  try {
    const materials = await LearningMaterial.findAll({
      where: { is_deleted: false }, // ✅ exclude soft-deleted
      order: [["created_at", "DESC"]], // ✅ newest first, underscored
    });

    return res.status(200).json({
      success: true,
      message: "Learning materials retrieved successfully",
      count: materials.length,
      data: materials,
    });
  } catch (err) {
    console.error("Error fetching learning materials:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = getAllLearningMaterials;
