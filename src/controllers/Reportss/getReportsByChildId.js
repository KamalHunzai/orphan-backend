"use strict";
const { Report, Child, Admin } = require("../../../models");

const getReportsByChildId = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!childId || isNaN(Number(childId))) {
      return res.status(400).json({
        success: false,
        message: "Valid child ID is required",
      });
    }

    // Check if the child exists
    const child = await Child.findOne({
      where: { id: Number(childId), is_deleted: false }, // ✅ soft delete
    });
    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found",
      });
    }

    // Fetch reports for the child
    const reports = await Report.findAll({
      where: { child_id: Number(childId), is_deleted: false }, // ✅ soft delete & snake_case
      order: [["created_at", "DESC"]], // ✅ snake_case
      include: [
        {
          model: Admin, // ✅ correct capitalization
          attributes: ["id", "full_name"], // snake_case
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: `Reports fetched successfully for child ID ${childId}`,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = getReportsByChildId;
