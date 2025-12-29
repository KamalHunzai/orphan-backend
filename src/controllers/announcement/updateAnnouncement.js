const { Announcement } = require("../../../models");
const Joi = require("joi");

// Joi validation schema
const updateAnnouncementSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  content: Joi.string().min(5).max(500).optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
});

const updateAnnouncement = async (req, res) => {
  try {
    // Validate request body
    const { error } = updateAnnouncementSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { id } = req.params;
    const { title, content, priority } = req.body;

    // Find the announcement by ID, excluding soft-deleted
    const announcement = await Announcement.findOne({
      where: { id, is_deleted: false }, // ✅ soft delete check
    });

    if (!announcement) {
      return res
        .status(404)
        .json({ error: "Announcement not found or deleted" });
    }

    // Update announcement with snake_case
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (priority) updateData.priority = priority;

    await announcement.update(updateData);

    res.status(200).json({
      message: "Announcement updated successfully",
      announcement,
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = updateAnnouncement;
