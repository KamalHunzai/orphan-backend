const { VisitPlanning, Admin } = require("../../../models");
const { Op } = require("sequelize");

const getUpcomingVisitsByChild = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!childId) {
      return res.status(400).json({ message: "Child ID is required." });
    }

    const upcomingVisits = await VisitPlanning.findAll({
      where: {
        child_id: childId,
        visit_date: { [Op.gt]: new Date() },
        is_deleted: false,
      },
      order: [
        ["visit_date", "ASC"],
        ["visit_time", "ASC"],
      ],
      include: [
        {
          model: Admin,
          attributes: ["id", "full_name", "email"],
        },
      ],
    });

    return res.status(200).json({
      message: "Upcoming visits retrieved successfully",
      data: upcomingVisits,
    });
  } catch (err) {
    console.error("Error fetching upcoming visits:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = getUpcomingVisitsByChild;
