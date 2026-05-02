const { VisitPlanning, Child, Admin } = require("../../../models");

const getAllVisitPlanning = async (req, res) => {
  try {
    const visitPlannings = await VisitPlanning.findAll({
      where: { is_deleted: false },
      order: [
        ["visit_date", "ASC"],
        ["visit_time", "ASC"],
      ],
      include: [
        {
          model: Child,
          attributes: ["id", "first_name", "last_name", "location"],
        },
        {
          model: Admin,
          attributes: ["id", "full_name", "email"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Visit Planning records fetched successfully",
      data: visitPlannings,
    });
  } catch (err) {
    console.error("Error fetching visit planning records:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = getAllVisitPlanning;
