const { Announcement } = require("../../../models");

const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch announcement only if not soft-deleted
    const announcement = await Announcement.findOne({
      where: { id, is_deleted: false },
    });

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.status(200).json({
      message: "Announcement fetched successfully",
      announcement,
    });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAnnouncementById;
