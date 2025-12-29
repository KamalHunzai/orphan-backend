const { LearningMaterial } = require("../../../models");

const getLearningMaterialById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid learning material ID",
      });
    }

    // Find learning material by ID, respecting soft delete
    const material = await LearningMaterial.findOne({
      where: {
        id: Number(id),
        is_deleted: false, // ✅ soft delete
      },
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Learning material not found or has been deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Learning material retrieved successfully",
      data: material,
    });
  } catch (err) {
    console.error("Error fetching learning material:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = getLearningMaterialById;
