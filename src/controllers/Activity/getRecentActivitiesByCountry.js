const { Activity, Child } = require("../../../models");

const getRecentActivitiesByCountry = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res
        .status(400)
        .json({ error: "Country query parameter is required." });
    }

    const activities = await Activity.findAll({
      where: {
        is_deleted: false, // ✅ exclude soft-deleted activities
      },
      include: [
        {
          model: Child,
          as: "child", // ✅ must match association alias
          where: {
            location: country,
            is_deleted: false, // ✅ exclude soft-deleted children
          },
          attributes: ["id", "first_name", "last_name"], // ✅ snake_case
          required: true, // inner join to only include matching country
        },
      ],
      order: [
        ["date", "DESC"],
        ["time", "DESC"],
      ], // Recent first
    });

    if (!activities || activities.length === 0) {
      return res
        .status(404)
        .json({
          message: `No recent activities found for country ${country}.`,
        });
    }

    // Convert attachments string → array for frontend
    const formattedActivities = activities.map((activity) => ({
      ...activity.toJSON(),
      attachments: activity.attachments ? activity.attachments.split(",") : [],
    }));

    res.status(200).json({ success: true, activities: formattedActivities });
  } catch (error) {
    console.error("Error fetching recent activities by country:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = getRecentActivitiesByCountry;
