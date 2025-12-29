const { Activity, Child } = require("../../../models");

const getRecentActivitiesByChild = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!childId) {
      return res.status(400).json({ error: "child_id is required." });
    }

    // Fetch recent activities for the given childId, excluding soft-deleted
    const activities = await Activity.findAll({
      where: {
        child_id: childId, // snake_case
        is_deleted: false, // exclude soft-deleted activities
      },
      order: [
        ["date", "DESC"], // most recent first
        ["time", "DESC"],
      ],
      include: [
        {
          model: Child,
          as: "child", // match association alias
          attributes: ["first_name", "last_name"],
          where: { is_deleted: false }, // exclude soft-deleted child
          required: false, // still fetch activities even if child is soft-deleted
        },
      ],
    });

    if (!activities.length) {
      return res
        .status(404)
        .json({ message: "No recent activities found for this child." });
    }

    // Convert attachments string → array for frontend
    const formatted = activities.map((activity) => ({
      ...activity.toJSON(),
      attachments: activity.attachments ? activity.attachments.split(",") : [],
    }));

    res.status(200).json({ success: true, activities: formatted });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

module.exports = getRecentActivitiesByChild;
