const { Task, Child } = require("../../../models");

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { is_deleted: false }, // exclude soft-deleted tasks
      include: [
        {
          model: Child,
          as: "child", // must match Task.belongsTo alias
          attributes: ["first_name", "last_name"], // DB snake_case
        },
      ],
      order: [
        ["due_date", "ASC"], // DB snake_case
        ["due_time", "ASC"], // DB snake_case
      ],
    });

    // Map to camelCase for frontend
    const tasksWithNames = tasks.map((task) => ({
      id: task.id,
      taskTitle: task.task_title,
      description: task.description,
      childName: task.child_name,
      dueDate: task.due_date,
      dueTime: task.due_time,
      priority: task.priority,
      taskType: task.task_type,
      adminId: task.admin_id,
      child: task.child
        ? {
            firstName: task.child.first_name,
            lastName: task.child.last_name,
          }
        : null,
    }));

    return res.status(200).json({
      success: true,
      count: tasksWithNames.length,
      tasks: tasksWithNames,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
};

module.exports = getAllTasks;
