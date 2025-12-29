const { Child, Report, VisitReport } = require("../../../models");
const { Op } = require("sequelize");

const getDashboardCountsByCountry = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({
        success: false,
        message: "Country query parameter is required",
      });
    }

    // Fetch children in the country
    const children = await Child.findAll({
      where: { location: country, is_deleted: false }, // ✅ respect soft delete
      attributes: ["id"],
    });

    const childIds = children.map((c) => c.id);

    if (childIds.length === 0) {
      return res.status(200).json({
        success: true,
        totalOrphans: 0,
        pendingReports: 0,
        upcomingSchedule: 0,
        urgentCases: 0,
      });
    }

    // Fetch visit reports for children
    const visitReports = await VisitReport.findAll({
      where: { child_id: { [Op.in]: childIds } }, // ✅ snake_case
      attributes: ["visit_date", "visit_time"], // ✅ snake_case
    });

    const now = new Date();

    const upcomingSchedule = visitReports.filter((report) => {
      if (!report.visit_date || !report.visit_time) return false;

      const [hours, minutes] = report.visit_time.split(":").map(Number);
      const visitDateTime = new Date(report.visit_date);
      visitDateTime.setHours(hours || 0);
      visitDateTime.setMinutes(minutes || 0);

      return visitDateTime >= now;
    }).length;

    // Count total orphans, pending reports, and urgent cases
    const [totalOrphans, pendingReports, urgentCases] = await Promise.all([
      Child.count({
        where: { id: { [Op.in]: childIds }, is_deleted: false },
      }),

      Report.count({
        where: { child_id: { [Op.in]: childIds }, is_deleted: false }, // ✅ snake_case
      }),

      Report.count({
        where: {
          child_id: { [Op.in]: childIds }, // ✅ snake_case
          urgency_level: "Urgent", // ✅ snake_case
          is_deleted: false,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      totalOrphans,
      pendingReports,
      upcomingSchedule,
      urgentCases,
    });
  } catch (error) {
    console.error("Error in getDashboardCountsByCountry:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = getDashboardCountsByCountry;
