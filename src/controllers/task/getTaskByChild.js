const { Task } = require("../../../models");

const getTasksByChildId = async (req, res) => {
  try {
    const { childId } = req.params;

    const tasks = await Task.findAll({
      where: {
        child_id: childId,
        is_deleted: false,
      },
      order: [
        ["due_date", "ASC"],
        ["due_time", "ASC"],
      ],
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
      message: "Tasks fetched successfully",
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("get_tasks_by_child_error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = getTasksByChildId;
