const { VisitReport } = require("../../../models");

// Get All Visit Reports (excluding soft-deleted)
const getAllVisitReports = async (req, res) => {
  try {
    const visitReports = await VisitReport.findAll({
      where: { is_deleted: false },
    });

    return res.status(200).json({
      success: true,
      message: "Visit reports fetched successfully",
      data: visitReports,
    });
  } catch (err) {
    console.error("Error fetching visit reports:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = getAllVisitReports;
