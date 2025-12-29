const { VisitReport, Child, admin } = require("../../../models");

const getVisitReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const visitReport = await VisitReport.findOne({
      where: { id, is_deleted: false }, // Only fetch non-deleted reports
      include: [
        {
          model: Child,
          as: "child",
          attributes: ["id", "firstName", "profilePicture"],
        },
        {
          model: admin,
          attributes: ["id", "fullName", "profilePicture"],
        },
      ],
    });

    if (!visitReport) {
      return res.status(404).json({
        success: false,
        message: "Visit Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Visit Report fetched successfully",
      data: visitReport,
    });
  } catch (err) {
    console.error("Error fetching visit report by ID:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = getVisitReportById;
