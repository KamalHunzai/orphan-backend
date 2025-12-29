const { VisitPlanning } = require("../../../models");

const getVisitPlanningByChildId = async (req, res) => {
  try {
    const { childId } = req.params;

    const visitPlannings = await VisitPlanning.findAll({
      where: { childId, is_deleted: false },
      order: [
        ["visitDate", "ASC"],
        ["visitTime", "ASC"],
      ],
    });

    if (!visitPlannings.length) {
      return res
        .status(404)
        .json({ success: false, message: "No visit planning records found" });
    }

    return res.status(200).json({ success: true, data: visitPlannings });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: err.message,
      });
  }
};

module.exports = getVisitPlanningByChildId;
