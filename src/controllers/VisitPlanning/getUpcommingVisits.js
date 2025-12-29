const { Op } = require("sequelize");
const { VisitPlanning, Admin } = require("../../../models");

// Get Upcoming Visit Planning Records
const getUpcomingVisits = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentTime = currentDate.toTimeString().split(" ")[0]; // HH:MM:SS

    const visitPlannings = await VisitPlanning.findAll({
      where: {
        is_deleted: false, // Exclude soft-deleted visits
        [Op.or]: [
          {
            visitDate: { [Op.gt]: currentDate }, // Future dates
          },
          {
            visitDate: { [Op.eq]: currentDate }, // Same day
            visitTime: { [Op.gt]: currentTime }, // Future times
          },
        ],
      },
      order: [
        ["visitDate", "ASC"],
        ["visitTime", "ASC"],
      ],
      include: [
        {
          model: Admin,
          attributes: ["id", "fullName", "email"], // Include admin info
        },
      ],
    });

    return res.status(200).json({
      visitPlannings,
      count: visitPlannings.length,
    });
  } catch (err) {
    console.error("Error fetching upcoming visit planning records:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getUpcomingVisits;
