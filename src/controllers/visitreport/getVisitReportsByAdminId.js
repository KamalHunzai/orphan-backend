const { VisitReport, Child } = require("../../../models");

const getVisitReportsByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;
    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "adminId is required",
      });
    }

    const admin_id = parseInt(adminId);

    const visitReports = await VisitReport.findAll({
      where: {
        admin_id,
        is_deleted: false, // Exclude deleted VisitReport
      },
      include: [
        {
          model: Child,
          as: "child",
          required: true, // ensures only children that exist and meet condition
          attributes: ["id", "first_name", "last_name", "profile_picture"],
          where: { is_deleted: false }, // Exclude deleted Child
        },
      ],
      order: [
        ["visit_date", "DESC"],
        ["visit_time", "DESC"],
      ],
    });

    return res.status(200).json({ success: true, data: visitReports });
  } catch (err) {
    console.error("getVisitReports error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = getVisitReportsByAdminId;
