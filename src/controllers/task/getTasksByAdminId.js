const { Task, Child } = require("../../../models");

const getTasksByAdminId = async (req, res) => {
  try {
    const { adminId } = req.params;

    // Validate adminId
    if (!adminId || isNaN(Number(adminId))) {
      return res.status(400).json({
        success: false,
        message: "Invalid adminId",
      });
    }

    // Fetch all non-deleted tasks for the admin
    const tasks = await Task.findAll({
      where: {
        admin_id: adminId, // snake_case DB
        is_deleted: false, // soft delete
      },
      order: [
        ["due_date", "ASC"],
        ["due_time", "ASC"],
      ],
      include: [
        {
          model: Child,
          as: "child", // must match Task.belongsTo alias
          attributes: ["first_name", "last_name"], // snake_case DB
        },
      ],
    });

    // Map tasks to camelCase for frontend
    const formattedTasks = tasks.map((task) => ({
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
      count: formattedTasks.length,
      tasks: formattedTasks,
    });
  } catch (error) {
    console.error("Error fetching tasks by adminId:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      details: error.message,
    });
  }
};

module.exports = getTasksByAdminId;
