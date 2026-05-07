const { VisitReport, Admin } = require("../../../models");

const getVisitReportsByChildId = async (req, res) => {
  const { childId } = req.params;

  if (!childId) {
    return res.status(400).json({
      success: false,
      message: "Child ID is required",
    });
  }

  try {
    const reports = await VisitReport.findAll({
      where: { child_id: childId, is_deleted: false },
      include: [
        {
          model: Admin,
          attributes: ["id", "full_name", "email", "profile_picture"],
        },
      ],
      order: [
        ["visit_date", "DESC"],
        ["visit_time", "DESC"],
      ],
    });

    if (!reports.length) {
      return res.status(404).json({
        success: false,
        message: "No visit reports found for this child",
      });
    }

    const now = new Date();
    const upcomingVisits = [];
    const pastVisits = [];

    reports.forEach((report) => {
      if (!report.visit_date || !report.visit_time) return;

      const [hours, minutes] = report.visit_time.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) return;

      const visitDateTime = new Date(report.visit_date);
      if (isNaN(visitDateTime.getTime())) return;

      visitDateTime.setHours(hours, minutes, 0, 0);

      if (visitDateTime >= now) {
        upcomingVisits.push(report);
      } else {
        pastVisits.push(report);
      }
    });

    upcomingVisits.sort((a, b) => {
      const dateA = new Date(a.visit_date);
      const dateB = new Date(b.visit_date);
      const [ha, ma] = a.visit_time.split(":").map(Number);
      const [hb, mb] = b.visit_time.split(":").map(Number);
      dateA.setHours(ha, ma, 0, 0);
      dateB.setHours(hb, mb, 0, 0);
      return dateA - dateB;
    });

    pastVisits.sort((a, b) => {
      const dateA = new Date(a.visit_date);
      const dateB = new Date(b.visit_date);
      const [ha, ma] = a.visit_time.split(":").map(Number);
      const [hb, mb] = b.visit_time.split(":").map(Number);
      dateA.setHours(ha, ma, 0, 0);
      dateB.setHours(hb, mb, 0, 0);
      return dateB - dateA;
    });

    return res.status(200).json({
      success: true,
      data: { upcomingVisits, pastVisits },
    });
  } catch (error) {
    console.error("get_visit_reports_by_child_error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = getVisitReportsByChildId;
