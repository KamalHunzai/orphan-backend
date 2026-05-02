const { Op } = require("sequelize");
const { VisitPlanning, Admin } = require("../../../models");

const getUpcomingVisits = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentTime = currentDate.toTimeString().split(" ")[0]; // HH:MM:SS

    const visitPlannings = await VisitPlanning.findAll({
      where: {
        is_deleted: false,
        [Op.or]: [
          {
            visit_date: { [Op.gt]: currentDate },
          },
          {
            visit_date: { [Op.eq]: currentDate },
            visit_time: { [Op.gt]: currentTime },
          },
        ],
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
      visitPlannings,
      count: visitPlannings.length,
    });
  } catch (err) {
    console.error("Error fetching upcoming visit planning records:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getUpcomingVisits;
