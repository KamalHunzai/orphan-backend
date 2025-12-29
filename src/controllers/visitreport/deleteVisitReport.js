const { VisitReport } = require("../../../models");

const deleteVisitReport = async (req, res) => {
  try {
    const { id } = req.params;

    const visitReport = await VisitReport.findByPk(id);

    if (!visitReport) {
      return res
        .status(404)
        .json({ success: false, message: "visit_report_not_found" });
    }

    await visitReport.update({ is_deleted: true });

    return res
      .status(200)
      .json({ success: true, message: "visit_report_deleted_successfully" });
  } catch (err) {
    console.error("delete_visit_report_error:", err);
    return res.status(500).json({
      success: false,
      message: "internal_server_error",
      error: err.message,
    });
  }
};

module.exports = deleteVisitReport;
