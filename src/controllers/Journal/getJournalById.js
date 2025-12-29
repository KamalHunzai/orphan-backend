const { Journal } = require("../../../models");

// Get Journal by ID (soft delete respected)
const getJournalById = async (req, res) => {
  try {
    const { id } = req.params;
    const journalId = Number(id);

    if (!journalId || isNaN(journalId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid journal ID",
      });
    }

    // Fetch journal excluding soft-deleted ones
    const journal = await Journal.findOne({
      where: {
        id: journalId,
        is_deleted: false, // ✅ respect soft delete
      },
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Journal not found or has been deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Journal fetched successfully",
      data: journal,
    });
  } catch (err) {
    console.error("Error fetching journal:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = getJournalById;
