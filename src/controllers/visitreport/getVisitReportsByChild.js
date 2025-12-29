const { Op } = require("sequelize");
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
      where: { childId, is_deleted: false }, // soft-delete aware
      include: [
        {
          model: admin,
          attributes: ["id", "fullName", "email", "profilePicture"],
        },
      ],
      order: [
        ["visitDate", "DESC"],
        ["visitTime", "DESC"],
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
      if (!report.visitDate || !report.visitTime) return;

      const [hours, minutes] = report.visitTime.split(":").map(Number);
      if (isNaN(hours) || isNaN(minutes)) return;

      const visitDateTime = new Date(report.visitDate);
      if (isNaN(visitDateTime.getTime())) return;

      visitDateTime.setHours(hours, minutes, 0, 0);

      if (visitDateTime >= now) {
        upcomingVisits.push(report);
      } else {
        pastVisits.push(report);
      }
    });

    // Sort upcoming ascending and past descending
    upcomingVisits.sort((a, b) => {
      const dateA = new Date(a.visitDate);
      const dateB = new Date(b.visitDate);
      const [ha, ma] = a.visitTime.split(":").map(Number);
      const [hb, mb] = b.visitTime.split(":").map(Number);
      dateA.setHours(ha, ma, 0, 0);
      dateB.setHours(hb, mb, 0, 0);
      return dateA - dateB;
    });

    pastVisits.sort((a, b) => {
      const dateA = new Date(a.visitDate);
      const dateB = new Date(b.visitDate);
      const [ha, ma] = a.visitTime.split(":").map(Number);
      const [hb, mb] = b.visitTime.split(":").map(Number);
      dateA.setHours(ha, ma, 0, 0);
      dateB.setHours(hb, mb, 0, 0);
      return dateB - dateA;
    });

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
