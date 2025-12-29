const { Announcement } = require("../../../models");

const getAnnouncements = async (req, res) => {
  try {
    // Fetch only announcements that are not soft-deleted
    const announcements = await Announcement.findAll({
      where: { is_deleted: false },
      order: [["created_at", "DESC"]], // optional: newest first
    });

    res.status(200).json({
      message: "Announcements fetched successfully",
      announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAnnouncements;
