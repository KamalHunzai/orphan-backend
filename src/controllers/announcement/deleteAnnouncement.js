const { Announcement } = require("../../../models");

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the announcement by ID (exclude already soft-deleted)
    const announcement = await Announcement.findOne({
      where: { id, is_deleted: false },
    });

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    // Soft delete by setting is_deleted = true
    await announcement.update({ is_deleted: true });

    res
      .status(200)
      .json({ message: "Announcement deleted successfully (soft delete)" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = deleteAnnouncement;
