const { VisitReport, admin } = require("../../../models");

const getVisitReportsByChildId = async (req, res) => {
  const { childId } = req.params;

  if (!childId) {
    return res.status(400).json({
      success: false,
      message: "childId is required",
    });
  }

  try {
    const reports = await VisitReport.findAll({
      where: { child_id: childId, is_deleted: false }, // ✅ DB is snake_case
      include: [
        {
          model: admin,
          attributes: ["id", "full_name", "email", "profile_picture"], // ✅ snake_case DB fields
        },
      ],
      order: [
        ["visit_date", "DESC"], // ✅ snake_case DB column
        ["visit_time", "DESC"],
      ],
    });

    const now = new Date();

    const upcomingVisits = [];
    const pastVisits = [];

    reports.forEach((report) => {
      if (!report.visit_date || !report.visit_time) return;

      const [hours, minutes] = report.visit_time.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) return;

      const visitDateTime = new Date(report.visit_date);
      visitDateTime.setHours(hours, minutes, 0, 0);

      if (visitDateTime >= now) upcomingVisits.push(report);
      else pastVisits.push(report);
    });

    // Sort ascending for upcoming, descending for past
    upcomingVisits.sort(
      (a, b) =>
        new Date(`${a.visit_date}T${a.visit_time}`) -
        new Date(`${b.visit_date}T${b.visit_time}`)
    );

    pastVisits.sort(
      (a, b) =>
        new Date(`${b.visit_date}T${b.visit_time}`) -
        new Date(`${a.visit_date}T${a.visit_time}`)
    );

    return res.status(200).json({
      success: true,
      data: { upcomingVisits, pastVisits },
    });
  } catch (error) {
    console.error("Error fetching visit reports:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = getVisitReportsByChildId;
