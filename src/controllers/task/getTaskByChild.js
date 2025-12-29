const { Task } = require("../../../models");

const getTasksByChildId = async (req, res) => {
  try {
    const { childId } = req.params;

    const tasks = await Task.findAll({
      where: {
        childId,
        is_deleted: false, // ✅ Exclude soft-deleted tasks
      },
      order: [
        ["dueDate", "ASC"],
        ["dueTime", "ASC"],
      ], // optional ordering
    });

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found for this child",
        tasks: [],
      });
    }

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks by childId:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
};

module.exports = getTasksByChildId;
