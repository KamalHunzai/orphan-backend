const { VisitPlanning, Child } = require("../../../models");

const getVisitPlanningById = async (req, res) => {
  try {
    const { id } = req.params;

    const visitPlanning = await VisitPlanning.findOne({
      where: { id, is_deleted: false }, // Exclude soft-deleted records
      include: [
        {
          model: Child,
          as: "Child", // Ensure this matches your association alias
          attributes: ["fullName"], // Only fetch child's fullName
        },
      ],
    });

    if (!visitPlanning) {
      return res.status(404).json({
        success: false,
        message: "Visit Planning not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: visitPlanning,
    });
  } catch (err) {
    console.error("Error fetching visit planning record:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = getVisitPlanningById;
