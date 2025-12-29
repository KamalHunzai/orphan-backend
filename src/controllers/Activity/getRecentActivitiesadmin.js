const { Activity, Admin, Child } = require("../../../models");

const getRecentActivities = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId) {
      return res
        .status(400)
        .json({ success: false, message: "admin_id is required." });
    }

    // Fetch recent activities for the given adminId, excluding soft-deleted
    const activities = await Activity.findAll({
      where: {
        admin_id: adminId, // snake_case
        is_deleted: false, // exclude soft-deleted activities
      },
      order: [
        ["date", "DESC"],
        ["time", "DESC"],
      ],
      include: [
        {
          model: Admin,
          as: "admin", // must match Activity.belongsTo(Admin, { as: "admin" })
          attributes: ["id", "full_name", "email", "country"],
        },
        {
          model: Child,
          as: "child", // must match Activity.belongsTo(Child, { as: "child" })
          attributes: ["id", "first_name", "last_name"],
          where: { is_deleted: false }, // exclude soft-deleted child
          required: false, // still fetch activity even if child is soft-deleted
        },
      ],
    });

    if (!activities.length) {
      return res.status(404).json({
        success: false,
        message: "No recent activities found for this admin.",
      });
    }

    // Convert attachments string → array
    const formattedActivities = activities.map((activity) => ({
      ...activity.toJSON(),
      attachments: activity.attachments ? activity.attachments.split(",") : [],
    }));

    res.status(200).json({ success: true, activities: formattedActivities });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = getRecentActivities;
