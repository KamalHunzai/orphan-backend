const Joi = require("joi");
const { Announcement, Notification, Admin } = require("../../../models");

// Joi Validation Schema
const announcementSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  priority: Joi.string().required(),
  superadminId: Joi.number().integer().allow(null, ""),
}).options({ allowUnknown: true });

const addAnnouncement = async (req, res) => {
  try {
    // Normalize superadminId if provided as string
    if (req.body.superadminId && typeof req.body.superadminId === "string") {
      req.body.superadminId = parseInt(req.body.superadminId, 10) || null;
    }

    // Validate request
    const { error } = announcementSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, content, priority, superadminId } = req.body;

    // Create announcement
    const announcement = await Announcement.create({
      title,
      content,
      priority,
      superadmin_id: superadminId, // ✅ snake_case
    });

    // Get all active admins (exclude soft-deleted)
    const admins = await Admin.findAll({ where: { is_deleted: false } });

    // Create notifications for each admin
    const notifications = admins.map((a) => ({
      title: `New Announcement: ${title}`,
      message: content,
      type: "announcement",
      admin_id: a.id, // ✅ snake_case
      is_read: false, // ✅ snake_case
    }));

    await Notification.bulkCreate(notifications);

    res.status(201).json({
      message: "Announcement created and notifications sent to admins",
      announcement,
    });
  } catch (error) {
    console.error("Error creating announcement or notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = addAnnouncement;
