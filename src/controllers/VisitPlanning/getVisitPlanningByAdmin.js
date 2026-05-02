const { VisitPlanning, Child, Admin } = require("../../../models");

const getVisitPlanningByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Admin ID is required",
      });
    }

    const visitPlannings = await VisitPlanning.findAll({
      where: { admin_id: adminId, is_deleted: false },
      include: [
        {
          model: Child,
          as: "child",
          attributes: ["id", "first_name", "last_name", "location"],
        },
        {
          model: Admin,
          as: "admin",
          attributes: ["id", "full_name", "email"],
        },
      ],
      order: [
        ["visit_date", "ASC"],
        ["visit_time", "ASC"],
      ],
    });

    if (!visitPlannings || visitPlannings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Visit Planning found for this admin",
      });
    }

    return res.status(200).json({
      success: true,
      data: visitPlannings,
    });
  } catch (err) {
    console.error("Error fetching visit planning records:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = getVisitPlanningByAdmin;
