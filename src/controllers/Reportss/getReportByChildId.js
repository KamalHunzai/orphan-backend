"use strict";
const { Report, Admin } = require("../../../models");

const get_reports_by_child_id = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!childId || isNaN(Number(childId))) {
      return res.status(400).json({
        success: false,
        message: "invalid_child_id_is_required",
      });
    }

    const reports = await Report.findAll({
      where: { child_id: Number(childId), is_deleted: false },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Admin,
          as: "admin",
          required: false,
          attributes: ["id", "full_name", "email"],
        },
      ],
    });

    // Map snake_case → camelCase for response
    const response = reports.map((r) => {
      const json = r.toJSON();
      return {
        id: json.id,
        childId: json.child_id,
        donorId: json.donor_id ?? null,
        visitDate: json.visit_date,
        visitTime: json.visit_time,
        visitType: json.visit_type,
        urgencyLevel: json.urgency_level,
        generalCondition: json.general_condition,
        recentDoctorVisits: json.recent_doctor_visits,
        nutritionStatus: json.nutrition_status,
        physicalActivities: json.physical_activities,
        academicPerformance: json.academic_performance,
        attendanceParticipation: json.attendance_participation,
        mentalState: json.mental_state,
        socialIntegration: json.social_integration,
        financialNeeds: json.financial_needs,
        existingSupport: json.existing_support,
        notableEvents: json.notable_events,
        additionalNotes: json.additional_notes,
        status: json.status,
        adminId: json.admin_id,
        createdAt: json.created_at,
        updatedAt: json.updated_at,
        admin: json.admin
          ? {
              id: json.admin.id,
              fullName: json.admin.full_name,
              email: json.admin.email,
            }
          : null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "reports_fetched_successfully",
      count: response.length,
      data: response,
    });
  } catch (error) {
    console.error("get_reports_by_child_id_error:", error);
    return res.status(500).json({
      success: false,
      message: "internal_server_error",
      error: error.message,
    });
  }
};

module.exports = get_reports_by_child_id;
