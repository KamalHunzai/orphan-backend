"use strict";
const { Task, Notification, sequelize } = require("../../../models");
const Joi = require("joi");

const createTask = async (req, res) => {
  try {
    // -------------------------------
    // Joi validation schema
    // -------------------------------
    const schema = Joi.object({
      taskTitle: Joi.string().required(),
      description: Joi.string().optional().allow("", null),
      childName: Joi.string().optional().allow("", null),
      childId: Joi.number().integer().required(),
      adminId: Joi.number().integer().required(),
      dueDate: Joi.date().required(),
      dueTime: Joi.string()
        .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
        .required()
        .messages({
          "string.pattern.base": "dueTime must be in HH:mm:ss format",
          "any.required": "dueTime is required",
        }),
      priority: Joi.string().valid("Low", "Medium", "High").required(),
      taskType: Joi.string()
        .valid("Visit", "Report", "Document", "Other")
        .required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // -------------------------------
    // Create task within a transaction
    // -------------------------------
    const task = await sequelize.transaction(async (t) => {
      // Map camelCase to snake_case for DB
      const taskData = {
        task_title: value.taskTitle,
        description: value.description,
        child_name: value.childName,
        child_id: value.childId,
        admin_id: value.adminId,
        due_date: value.dueDate,
        due_time: value.dueTime,
        priority: value.priority,
        task_type: value.taskType,
      };

      const createdTask = await Task.create(taskData, { transaction: t });

      const notificationData = {
        title: "New Task Created",
        message: `A new ${value.taskType} task has been created.`,
        type: "task",
        child_id: value.childId,
        admin_id: value.adminId,
        is_read: false,
      };

      await Notification.create(notificationData, { transaction: t });

      return createdTask;
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: task.get({ plain: true }),
    });
  } catch (err) {
    console.error("Error creating task:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = createTask;
