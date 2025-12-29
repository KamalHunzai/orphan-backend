const { VisitReport } = require("../../../models");

const getLatestVisitReportsByChild = async (req, res) => {
  const { childId } = req.params;

  if (!childId) {
    return res.status(400).json({
      success: false,
      message: "childId is required",
    });
  }

  try {
    const latestReports = await VisitReport.findAll({
      where: { childId, is_deleted: false }, // Soft-delete aware
      order: [
        ["visitDate", "DESC"],
        ["visitTime", "DESC"],
      ], // Latest first
    });

    if (!latestReports.length) {
      return res.status(404).json({
        success: false,
        message: "No visit reports found for this child",
      });
    }

    return res.status(200).json({
      success: true,
      data: latestReports,
    });
  } catch (err) {
    console.error("Error fetching latest visit reports:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = getLatestVisitReportsByChild;
