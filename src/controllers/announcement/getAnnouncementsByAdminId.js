const { Announcement } = require("../../../models");

const getAnnouncementsByAdminId = async (req, res) => {
  try {
    const { superadminId } = req.params;

    if (!superadminId) {
      return res
        .status(400)
        .json({ error: "superadminId parameter is required." });
    }

    // Fetch announcements that are not soft-deleted
    const announcements = await Announcement.findAll({
      where: {
        superadmin_id: superadminId, // ✅ match DB column
        is_deleted: false, // ✅ exclude soft-deleted
      },
      order: [["created_at", "DESC"]], // newest first
    });

    if (!announcements.length) {
      return res
        .status(404)
        .json({ message: "No announcements found for this admin." });
    }

    res.status(200).json({ announcements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAnnouncementsByAdminId;
