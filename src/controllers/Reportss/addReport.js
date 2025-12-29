"use strict";
const { Report, Child, Notification } = require("../../../models");

const addReport = async (req, res) => {
  try {
    const {
      adminId,
      childId,
      reportType,
      urgencyLevel,
      generalCondition,
      recentDoctorVisits,
      nutritionStatus,
      physicalActivities,
      academicPerformance,
      attendanceParticipation,
      mentalState,
      socialIntegration,
      financialNeeds,
      existingSupport,
      notableEvents,
      date,
      time,
      additionalNotes,
    } = req.body;

    // Validate child existence and soft delete
    const child = await Child.findOne({
      where: { id: childId, is_deleted: false },
    });
    if (!child) {
      return res.status(404).json({
        success: false,
        message: "Child not found or has been deleted",
      });
    }

    // Create the report
    const report = await Report.create({
      child_id: childId,
      report_type: reportType,
      urgency_level: urgencyLevel,
      general_condition: generalCondition,
      recent_doctor_visits: recentDoctorVisits,
      nutrition_status: nutritionStatus,
      physical_activities: physicalActivities,
      academic_performance: academicPerformance,
      attendance_participation: attendanceParticipation,
      mental_state: mentalState,
      social_integration: socialIntegration,
      financial_needs: financialNeeds,
      existing_support: existingSupport,
      notable_events: notableEvents,
      date,
      time,
      additional_notes: additionalNotes,
      admin_id: adminId,
    });

    // Create a notification for the child
    await Notification.create({
      title: "New Report Added",
      message: `A new report has been submitted for child: ${child.first_name}.`,
      type: "report",
      child_id: childId,
      admin_id: adminId,
      is_read: false,
    });

    return res.status(201).json({
      success: true,
      message: "Report added successfully",
      data: report,
    });
  } catch (error) {
    console.error("Error adding report:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = addReport;
