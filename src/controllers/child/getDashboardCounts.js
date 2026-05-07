const { Child, VisitReport, VisitPlanning } = require("../../../models");
const { Op } = require("sequelize");

const getDashboardCounts = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({
        success: false,
        message: "Country is required",
      });
    }

    const totalChildren = await Child.count({
      where: { location: country, is_deleted: false },
    });

    const totalReports = await VisitReport.count({
      where: { is_deleted: false },
      include: [
        {
          model: Child,
          as: "child",
          where: { location: country, is_deleted: false },
        },
      ],
    });

    const upcomingSchedules = await VisitPlanning.count({
      where: {
        visit_date: { [Op.gt]: new Date() },
        is_deleted: false,
      },
    });

    const urgentCases = await VisitReport.count({
      where: { status: "urgent", is_deleted: false },
      include: [
        {
          model: Child,
          as: "child",
          where: { location: country, is_deleted: false },
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
    console.error("get_dashboard_counts_error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = getDashboardCounts;
