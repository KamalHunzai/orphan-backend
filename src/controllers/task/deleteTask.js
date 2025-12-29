"use strict";
const { Task } = require("../../../models");

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the task
    const task = await Task.findByPk(id);

    if (!task || task.is_deleted) {
      return res.status(404).json({
        success: false,
        message: "Task not found or already deleted",
      });
    }

    // Soft delete the task
    task.is_deleted = true;
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully (soft delete)",
    });
  } catch (error) {
    console.error("Error soft deleting task:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = deleteTask;
