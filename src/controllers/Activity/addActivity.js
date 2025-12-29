const Joi = require("joi");
const { Activity } = require("../../../models");

// Validation schema with snake_case fields
const activitySchema = Joi.object({
  activity_type: Joi.string().required(),
  child_id: Joi.number().integer().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(null, ""),
  date: Joi.date().required(),
  time: Joi.string().required(),
  attachments: Joi.string().allow(null, ""),
  admin_id: Joi.number().integer().required(),
  status: Joi.string().required(),
  uploaded_file: Joi.string().allow(null, ""), // optional if used
}).options({ stripUnknown: true });

const addActivity = async (req, res) => {
  try {
    let attachmentURLs = [];

    // Save only file.location from multer-s3
    if (req.files && req.files.length > 0) {
      attachmentURLs = req.files.map((file) => file.location);
    }

    // Always overwrite attachments with uploaded files
    req.body.attachments =
      attachmentURLs.length > 0 ? attachmentURLs.join(",") : null;

    // Map camelCase keys to snake_case for DB
    const payload = {
      activity_type: req.body.activityType || req.body.activity_type,
      child_id: req.body.ChildId || req.body.child_id,
      title: req.body.title,
      description: req.body.description || null,
      date: req.body.date,
      time: req.body.time,
      attachments: req.body.attachments,
      admin_id: req.body.adminId || req.body.admin_id,
      status: req.body.status,
      uploaded_file: req.body.uploadedFile || null,
    };

    // Validate payload
    const { error, value } = activitySchema.validate(payload);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Save activity
    const activity = await Activity.create(value);

    return res.status(201).json({ success: true, activity });
  } catch (err) {
    console.error("Add Activity Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = addActivity;
