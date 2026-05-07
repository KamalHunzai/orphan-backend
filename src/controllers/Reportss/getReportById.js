"use strict";
const { Report, Child, Admin } = require("../../../models");

const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "A valid report ID is required",
      });
    }

    const report = await Report.findOne({
      where: { id: Number(id), is_deleted: false },
      include: [
        {
          model: Child,
          as: "child", // must match Report.associate alias
          required: false,
          attributes: ["id", "first_name", "last_name", "profile_picture"],
        },
        {
          model: Admin,
          as: "admin", // must match Report.associate alias
          required: false,
          attributes: ["id", "full_name", "email"],
        },
      ],
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report fetched successfully",
      data: report,
    });
  } catch (error) {
    console.error("get_report_by_id_error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = getReportById;
