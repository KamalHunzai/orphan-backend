// controllers/journalController.js
const { Journal } = require("../../../models");

const deleteJournal = async (req, res) => {
  try {
    const { id: journalId } = req.params;

    const journal = await Journal.findByPk(journalId);
    if (!journal) {
      return res
        .status(404)
        .json({ success: false, message: "Journal not found" });
    }

    // Soft delete by updating the is_deleted flag
    await journal.update({ is_deleted: true });

    return res.status(200).json({
      success: true,
      message: "Journal deleted successfully (soft delete)",
    });
  } catch (err) {
    console.error("Error deleting journal:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete journal",
      error: err.message,
    });
  }
};

// ✅ Export as a function directly
module.exports = deleteJournal;
