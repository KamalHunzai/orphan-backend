const { Task } = require("../../../models");

const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findOne({
      where: {
        id: taskId,
        is_deleted: false, // ✅ Exclude soft-deleted tasks
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        task: null,
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
};

module.exports = getTaskById;
