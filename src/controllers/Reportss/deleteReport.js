"use strict";
const { Report } = require("../../../models");

const deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    if (!reportId || isNaN(Number(reportId))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid report ID" });
    }

    // Fetch report respecting soft delete
    const report = await Report.findOne({
      where: { id: Number(reportId), is_deleted: false },
    });

    if (!report) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Report not found or already deleted",
        });
    }

    // Soft delete: mark as deleted
    await report.update({ is_deleted: true });

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
      report,
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = deleteReport;
