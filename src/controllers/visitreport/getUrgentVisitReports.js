const { VisitReport, Child } = require("../../../models");

const getUrgentVisitReports = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({ message: "Country is required." });
    }

    const urgentReports = await VisitReport.findAll({
      where: { status: "urgent", is_deleted: false }, // ignore soft-deleted reports
      include: [
        {
          model: Child,
          as: "child", // alias must match your association
          where: { location: country }, // corrected property name
          attributes: ["id", "firstName", "lastName", "location"],
        },
      ],
      order: [
        ["visitDate", "DESC"],
        ["visitTime", "DESC"],
      ], // sort by latest
    });

    return res.status(200).json({
      success: true,
      message: "Urgent Visit Reports retrieved successfully",
      data: urgentReports,
    });
  } catch (err) {
    console.error("Error fetching urgent Visit Reports:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = getUrgentVisitReports;
