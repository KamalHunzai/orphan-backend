const { VisitReport } = require("../../../models");

const deleteVisitReport = async (req, res) => {
  try {
    const { id } = req.params;

    const visitReport = await VisitReport.findByPk(id);

    if (!visitReport) {
      return res
        .status(404)
        .json({ success: false, message: "Visit report not found" });
    }

    await visitReport.update({ is_deleted: true });

    return res
      .status(200)
      .json({ success: true, message: "Visit report deleted successfully" });
  } catch (err) {
    console.error("delete_visit_report_error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = deleteVisitReport;
