const { LearningMaterial } = require("../../../models");
const Joi = require("joi");

// Joi Validation Schema (DB field names / snake_case)
const learningMaterialSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  related_tag: Joi.string().allow(null, ""),
  due_date: Joi.date().required(),
  due_time: Joi.string().allow(null, ""),
  priority: Joi.string().required(),
  task_type: Joi.string().required(),
  admin_id: Joi.number().integer().required(),
  file: Joi.string().allow(null, ""),
  file_type: Joi.string()
    .valid("image", "video", "document", "audio", "other")
    .allow(null, ""),
});

const addLearningMaterial = async (req, res) => {
  try {
    // Detect file type from MIME
    const getFileType = (mime) => {
      if (!mime) return null;
      if (mime.startsWith("image/")) return "image";
      if (mime.startsWith("video/")) return "video";
      if (mime.startsWith("audio/")) return "audio";
      if (
        mime === "application/pdf" ||
        mime.includes("msword") ||
        mime.includes("officedocument")
      ) {
        return "document";
      }
      return "other";
    };

    const fileUrl = req.file?.location || null;
    const fileType = req.file ? getFileType(req.file.mimetype) : null;

    // Convert due_date to ISO string if provided
    let isoDueDate = null;
    if (req.body.dueDate) {
      const dateObj = new Date(req.body.dueDate);
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid due_date format",
        });
      }
      isoDueDate = dateObj.toISOString().split("T")[0]; // keep YYYY-MM-DD
    }

    // Ensure due_time is string or null
    const dueTime = req.body.dueTime ? String(req.body.dueTime) : null;

    const requestBody = {
      title: req.body.title,
      description: req.body.description,
      related_tag: req.body.relatedTag || null,
      due_date: isoDueDate,
      due_time: dueTime,
      priority: req.body.priority,
      task_type: req.body.taskType,
      admin_id: parseInt(req.body.adminId),
      file: fileUrl,
      file_type: fileType,
    };

    // Validate
    const { error } = learningMaterialSchema.validate(requestBody);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const newMaterial = await LearningMaterial.create(requestBody);

    return res.status(201).json({
      success: true,
      message: "Learning Material added successfully",
      data: newMaterial,
    });
  } catch (err) {
    console.error("Error adding Learning Material:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = addLearningMaterial;
