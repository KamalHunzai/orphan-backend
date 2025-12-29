"use strict";
const { Report, Child, Admin } = require("../../../models");

const getReportsByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId || isNaN(Number(adminId))) {
      return res.status(400).json({
        success: false,
        message: "valid_admin_id_is_required",
      });
    }

    const reports = await Report.findAll({
      where: { admin_id: Number(adminId), is_deleted: false },
      include: [
        {
          model: Child,
          as: "child", // use your model association alias
          required: false,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "profile_picture",
            "location",
          ],
        },
        {
          model: Admin,
          as: "admin", // use your model association alias
          required: false,
          attributes: ["id", "full_name", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: `reports_fetched_successfully_for_admin_id_${adminId}`,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("get_reports_by_admin_error:", error);
    return res.status(500).json({
      success: false,
      message: "internal_server_error",
      error: error.message,
    });
  }
};

module.exports = getReportsByAdmin;
