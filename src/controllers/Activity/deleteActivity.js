const { Activity } = require("../../../models");

const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate activity ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "Valid activity ID is required" });
    }

    const activity = await Activity.findByPk(Number(id));

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // Soft delete: set is_deleted to true
    activity.is_deleted = true;
    await activity.save();

    return res
      .status(200)
      .json({ message: "Activity soft-deleted successfully" });
  } catch (error) {
    console.error("Error soft-deleting activity:", error);
    return res.status(500).json({
      error: "Something went wrong while deleting the activity",
      details: error.message,
    });
  }
};

module.exports = deleteActivity;
