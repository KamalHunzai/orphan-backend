const { Management, Child, LearningMaterial } = require("../../../models");

const deleteManagementById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: "Invalid management ID",
      });
    }

    const management = await Management.findOne({
      where: { id: Number(id), is_deleted: false }, // ✅ soft delete
    });

    if (!management) {
      return res.status(404).json({
        success: false,
        message: "Management not found or already deleted",
      });
    }

    // ✅ Check for relational integrity
    const childrenCount = await Child.count({
      where: { admin_id: id, is_deleted: false },
    });

    const tasksCount = await LearningMaterial.count({
      where: { admin_id: id, is_deleted: false },
    });

    if (childrenCount > 0 || tasksCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete management. Remove or reassign associated children or tasks first.",
        details: {
          childrenCount,
          tasksCount,
        },
      });
    }

    // ✅ Soft delete by updating is_deleted flag
    await management.update({ is_deleted: true });

    return res.status(200).json({
      success: true,
      message: "Management deleted successfully (soft delete)",
    });
  } catch (error) {
    console.error("Delete Management Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = deleteManagementById;
