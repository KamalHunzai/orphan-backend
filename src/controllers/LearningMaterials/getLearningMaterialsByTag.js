const { LearningMaterial } = require("../../../models");

const getLearningMaterialsByTag = async (req, res) => {
  try {
    const { relatedTag } = req.query;

    const whereCondition = {
      is_deleted: false, // ✅ respect soft delete
      ...(relatedTag ? { related_tag: relatedTag } : {}),
    };

    const materials = await LearningMaterial.findAll({
      where: whereCondition,
      order: [["created_at", "DESC"]], // ✅ snake_case
    });

    return res.status(200).json({
      success: true,
      message: relatedTag
        ? `Learning materials with tag "${relatedTag}" retrieved successfully`
        : "All learning materials retrieved successfully",
      count: materials.length,
      data: materials,
    });
  } catch (err) {
    console.error("Error fetching Learning Materials by tag:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = getLearningMaterialsByTag;
