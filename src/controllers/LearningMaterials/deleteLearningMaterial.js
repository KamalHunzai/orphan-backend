const { LearningMaterial } = require("../../../models");

// Soft Delete Learning Material
const deleteLearningMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Learning Material ID",
      });
    }

    // Fetch material
    const material = await LearningMaterial.findOne({
      where: { id: Number(id), is_deleted: false }, // ✅ respect soft delete
    });

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Learning Material not found or already deleted",
      });
    }

    // Soft delete by setting is_deleted flag
    await material.update({ is_deleted: true });

    return res.status(200).json({
      success: true,
      message: "Learning Material deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting Learning Material:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = deleteLearningMaterial;
