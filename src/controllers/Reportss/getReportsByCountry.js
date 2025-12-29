"use strict";
const { Report, Admin, Child } = require("../../../models");

const getReportsByCountry = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({
        success: false,
        message: "Country query parameter is required",
      });
    }

    // Fetch reports with soft delete respected
    const reports = await Report.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: Child,
          as: "child",
          where: { location: country, is_deleted: false },
          attributes: ["id", "first_name", "last_name", "location"],
        },
        {
          model: Admin,
          as: "admin",
          attributes: ["id", "full_name", "email"],
        },
      ],
      order: [
        ["date", "DESC"], // snake_case DB
        ["time", "DESC"], // snake_case DB
      ],
    });

    // Map to camelCase for frontend
    const formattedReports = reports.map((report) => ({
      id: report.id,
      reportType: report.report_type,
      urgencyLevel: report.urgency_level,
      generalCondition: report.general_condition,
      recentDoctorVisits: report.recent_doctor_visits,
      nutritionStatus: report.nutrition_status,
      physicalActivities: report.physical_activities,
      academicPerformance: report.academic_performance,
      attendanceParticipation: report.attendance_participation,
      mentalState: report.mental_state,
      socialIntegration: report.social_integration,
      financialNeeds: report.financial_needs,
      existingSupport: report.existing_support,
      notableEvents: report.notable_events,
      additionalNotes: report.additional_notes,
      date: report.date,
      time: report.time,
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
      message: `Reports fetched successfully for country: ${country}`,
      count: formattedReports.length,
      data: formattedReports,
    });
  } catch (error) {
    console.error("Error fetching reports by country:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = getReportsByCountry;
