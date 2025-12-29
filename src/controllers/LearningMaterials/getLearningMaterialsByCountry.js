const { LearningMaterial, Admin } = require("../../../models");

const getLearningMaterialsByCountry = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({
        success: false,
        message: "Country is required in query",
      });
    }

    const materials = await LearningMaterial.findAll({
      where: {
        is_deleted: false, // Soft-delete check
      },
      include: [
        {
          model: Admin,
          as: "admin", // must match the alias in the model
          where: { country },
          attributes: ["id", "full_name", "country"],
          required: true, // ensures INNER JOIN
        },
      ],
      order: [["created_at", "DESC"]], // latest first
    });

    return res.status(200).json({
      success: true,
      message: `Learning materials for country "${country}" retrieved successfully`,
      count: materials.length,
      data: materials,
    });
  } catch (err) {
    console.error("Error fetching Learning Materials by country:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = getLearningMaterialsByCountry;
