const { Journal } = require("../../../models");

// Get All Journals by Child ID (soft delete respected)
const getAllJournalsByChild = async (req, res) => {
  try {
    const { childId } = req.params;

    // Validate childId
    if (!childId || isNaN(Number(childId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid childId",
      });
    }

    // Fetch journals by childId, excluding soft-deleted ones
    const journals = await Journal.findAll({
      where: {
        child_id: Number(childId),
        is_deleted: false, // ✅ respect soft delete
      },
      order: [["created_at", "DESC"]], // ✅ underscore style
    });

    return res.status(200).json({
      success: true,
      message: "Journals retrieved successfully",
      count: journals.length,
      data: journals,
    });
  } catch (err) {
    console.error("Error fetching journals:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = getAllJournalsByChild;
