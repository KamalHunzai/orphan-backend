const Joi = require("joi");
const { VisitReport, Notification } = require("../../../models");

const visit_report_schema = Joi.object({
  childId: Joi.number().integer().required(),
  donorId: Joi.number().integer().optional().allow(null),
  visitDate: Joi.date().iso().required(),
  visitTime: Joi.string().required(),
  visitType: Joi.string().required(),
  notes: Joi.string().optional().allow(null),
  status: Joi.string().default("").optional(),
  adminId: Joi.number().integer().required(),
});

const create_visit_report = async (req, res) => {
  try {
    const { error, value } = visit_report_schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({
          success: false,
          message: "validation_error",
          errors: error.details.map((e) => e.message),
        });
    }

    const visit_report = await VisitReport.create({
      child_id: value.childId,
      donor_id: value.donorId ?? null,
      visit_date: value.visitDate,
      visit_time: value.visitTime,
      visit_type: value.visitType,
      notes: value.notes ?? null,
      status: value.status ?? "",
      admin_id: value.adminId,
      is_deleted: false,
    });

    await Notification.create({
      title: "new_visit_report",
      message: `a_new_${value.visitType}_visit_report_has_been_created`,
      type: "visit_report",
      child_id: visit_report.child_id,
      admin_id: visit_report.admin_id,
      is_read: false,
    });

    return res
      .status(201)
      .json({
        success: true,
        message: "visit_report_added_successfully",
        data: visit_report,
      });
  } catch (err) {
    console.error("create_visit_report_error:", err);
    return res
      .status(500)
      .json({
        success: false,
        message: "internal_server_error",
        error: err.message,
      });
  }
};

module.exports = create_visit_report;
