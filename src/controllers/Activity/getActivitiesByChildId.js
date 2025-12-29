const { Activity, Child } = require("../../../models");

const getActivitiesByChildId = async (req, res) => {
  try {
    const { childId } = req.params;

    const activities = await Activity.findAll({
      where: { child_id: childId, is_deleted: false },
      order: [
        ["date", "DESC"],
        ["time", "DESC"],
      ],
      include: [
        {
          model: Child,
          as: "child",
          attributes: ["first_name", "last_name"],
          where: { is_deleted: false },
          required: false,
        },
      ],
    });

    if (!activities.length) return res.status(404).json({ success: false });

    return res.status(200).json({
      success: true,
      activities: activities.map((a) => ({
        ...a.toJSON(),
        attachments: a.attachments ? a.attachments.split(",") : [],
      })),
    });
  } catch {
    return res.status(500).json({ success: false });
  }
};

module.exports = getActivitiesByChildId;
