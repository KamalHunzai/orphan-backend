"use strict";
const { Report, Child, Admin } = require("../../../models");
const Joi = require("joi");

// Validation schema (camelCase input from frontend)
const report_update_schema = Joi.object({
  childId: Joi.number().integer().optional(),
  urgencyLevel: Joi.string().optional(),
  reportType: Joi.string().optional(),
  generalCondition: Joi.string().optional(),
  recentDoctorVisits: Joi.string().optional(),
  nutritionStatus: Joi.string().optional(),
  physicalActivities: Joi.string().optional(),
  academicPerformance: Joi.string().optional(),
  attendanceParticipation: Joi.string().optional(),
  mentalState: Joi.string().optional(),
  socialIntegration: Joi.string().optional(),
  financialNeeds: Joi.string().optional(),
  existingSupport: Joi.string().optional(),
  notableEvents: Joi.string().optional(),
  date: Joi.date().iso().optional(),
  time: Joi.string().optional(),
  additionalNotes: Joi.string().optional(),
  adminId: Joi.number().integer().optional(),
});

const update_report = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate input
    const { error, value } = report_update_schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "validation_error",
        errors: error.details.map((e) => e.message),
      });
    }

    // Find the report
    const report = await Report.findOne({
      where: { id: Number(id), is_deleted: false },
      include: [
        {
          model: Child,
          as: "child",
          required: false,
          attributes: ["id", "first_name", "last_name", "profile_picture"],
        },
        {
          model: Admin,
          as: "admin",
          required: false,
          attributes: ["id", "full_name", "email"],
        },
      ],
    });

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "report_not_found_or_deleted" });
    }

    // Map camelCase → snake_case for DB
    const payload = {
      child_id: value.childId,
      urgency_level: value.urgencyLevel,
      report_type: value.reportType,
      general_condition: value.generalCondition,
      recent_doctor_visits: value.recentDoctorVisits,
      nutrition_status: value.nutritionStatus,
      physical_activities: value.physicalActivities,
      academic_performance: value.academicPerformance,
      attendance_participation: value.attendanceParticipation,
      mental_state: value.mentalState,
      social_integration: value.socialIntegration,
      financial_needs: value.financialNeeds,
      existing_support: value.existingSupport,
      notable_events: value.notableEvents,
      date: value.date,
      time: value.time,
      additional_notes: value.additionalNotes,
      admin_id: value.adminId,
    };

    // Remove undefined fields to avoid overwriting
    Object.keys(payload).forEach(
      (key) => payload[key] === undefined && delete payload[key]
    );

    await report.update(payload);

    return res.status(200).json({
      success: true,
      message: "report_updated_successfully",
      data: report,
    });
  } catch (error) {
    console.error("update_report_error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "internal_server_error",
        error: error.message,
      });
  }
};

module.exports = update_report;
