"use strict";
const { Report, Child, Admin } = require("../../../models");

const getUrgentReportsByCountry = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({
        success: false,
        message: "Country query parameter is required",
      });
    }

    // Fetch urgent reports, respecting soft deletes
    const urgentReports = await Report.findAll({
      where: {
        urgency_level: "Urgent", // snake_case in DB
        is_deleted: false, // soft delete
      },
      include: [
        {
          model: Child,
          as: "child", // match alias in Report model
          where: {
            location: country,
            is_deleted: false,
          },
          attributes: ["id", "first_name", "last_name", "location"],
        },
        {
          model: Admin,
          as: "admin", // match alias in Report model
          attributes: ["id", "full_name", "email"],
        },
      ],
      order: [
        ["date", "DESC"],
        ["time", "DESC"],
      ],
    });

    // Map to camelCase for frontend
    const formattedReports = urgentReports.map((report) => ({
      id: report.id,
      reportType: report.report_type,
      urgencyLevel: report.urgency_level,
      date: report.date,
      time: report.time,
      additionalNotes: report.additional_notes,
      child: report.child
        ? {
            id: report.child.id,
            firstName: report.child.first_name,
            lastName: report.child.last_name,
            location: report.child.location,
          }
        : null,
      admin: report.admin
        ? {
            id: report.admin.id,
            fullName: report.admin.full_name,
            email: report.admin.email,
          }
        : null,
    }));

    return res.status(200).json({
      success: true,
      message: `Urgent reports fetched successfully for country: ${country}`,
      count: formattedReports.length,
      data: formattedReports,
    });
  } catch (error) {
    console.error("Error fetching urgent reports:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = getUrgentReportsByCountry;
