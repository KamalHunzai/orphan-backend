const { Child, VisitReport, VisitPlanning } = require("../../../models");
const { Op } = require("sequelize");

const getDashboardCounts = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({
        success: false,
        message: "Country is required.",
      });
    }

    // Total children in the given country
    const totalChildren = await Child.count({
      where: { location: country }, // Use 'location' if that stores country
    });

    // Total visit reports for children in the country
    const totalReports = await VisitReport.count({
      include: [
        {
          model: Child,
          as: "child", // Make sure alias matches your Sequelize association
          where: { location: country },
        },
      ],
    });

    // Upcoming visit schedules (future dates)
    const upcomingSchedules = await VisitPlanning.count({
      where: {
        visitDate: { [Op.gt]: new Date() }, // Future visits
      },
    });

    // Urgent cases (VisitReports with status "urgent") filtered by country
    const urgentCases = await VisitReport.count({
      where: { status: "urgent" },
      include: [
        {
          model: Child,
          as: "child",
          where: { location: country },
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Dashboard counts fetched successfully",
      data: {
        totalChildren,
        totalReports,
        upcomingSchedules,
        urgentCases,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = getDashboardCounts;
