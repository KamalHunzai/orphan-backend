const Joi = require("joi");
const { VisitPlanning } = require("../../../models");

// Joi Validation Schema
const visitPlanningSchema = Joi.object({
  childId: Joi.number().integer().required(),
  adminId: Joi.number().integer().required(),
  visitDate: Joi.date().required(),
  visitTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // HH:MM format
    .required(),
  visitType: Joi.string().required(),
  notes: Joi.string().allow(""), // Optional
});

// Create Visit Planning API
const createVisitPlanning = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = visitPlanningSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    // Add soft-delete flag (default false)
    const visitPlanning = await VisitPlanning.create({
      ...value,
      is_deleted: false,
    });

    return res.status(201).json({
      success: true,
      message: "Visit Planning created successfully",
      data: visitPlanning,
    });
  } catch (err) {
    console.error("Error creating visit planning:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = createVisitPlanning;
