const { VisitPlanning, Admin } = require("../../../models");
const { Op } = require("sequelize");

const getUpcomingVisitsByChild = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!childId) {
      return res.status(400).json({ message: "Child ID is required." });
    }

    // Fetch upcoming visit planning records
    const upcomingVisits = await VisitPlanning.findAll({
      where: {
        childId,
        visitDate: { [Op.gt]: new Date() }, // Only future visits
        is_deleted: false, // Exclude soft-deleted visits
      },
      order: [
        ["visitDate", "ASC"],
        ["visitTime", "ASC"],
      ],
      include: [
        {
          model: Admin,
          attributes: ["id", "fullName", "email"], // Admin info
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
