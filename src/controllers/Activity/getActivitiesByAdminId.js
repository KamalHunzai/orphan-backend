const { Activity, Child } = require("../../../models");

const getActivitiesByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId) {
      return res.status(400).json({ message: "admin_id is required." });
    }

    // Fetch activities for the admin, excluding soft-deleted ones
    const activities = await Activity.findAll({
      where: {
        admin_id: adminId, // snake_case column
        is_deleted: false, // exclude soft-deleted
      },
      order: [
        ["date", "DESC"], // most recent first
        ["time", "DESC"],
      ],
      include: [
        {
          model: Child,
          as: "child", // match Activity.belongsTo(Child, {as: "child"})
          attributes: ["first_name", "last_name"],
          where: { is_deleted: false }, // exclude soft-deleted children
          required: false, // still include activity even if child is soft-deleted
        },
      ],
    });

    if (!activities.length) {
      return res
        .status(404)
        .json({ message: "No activities found for this admin." });
    }

    // Convert attachments string → array
    const formatted = activities.map((activity) => ({
      ...activity.toJSON(),
      attachments: activity.attachments ? activity.attachments.split(",") : [],
    }));

    res.status(200).json({ success: true, activities: formatted });
  } catch (error) {
    console.error("Get Activities Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = getActivitiesByAdminId;
