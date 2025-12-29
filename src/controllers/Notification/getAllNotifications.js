"use strict";
const { Notification, Child, Admin } = require("../../../models");

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { is_deleted: false },

      include: [
        {
          model: Child,
          as: "child",
          attributes: ["id", "first_name", "last_name", "location"], // ✅ safe snake_case DB fields
          required: false,
        },
        {
          model: Admin,
          as: "admin",
          attributes: ["id", "full_name", "email"],
          required: false,
        },
      ],

      order: [["created_at", "DESC"]],
    });

    // ✅ Null safety check
    if (!notifications || !Array.isArray(notifications)) {
      return res.status(200).json({
        success: true,
        message: "no_notifications_found",
        count: 0,
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "notifications_fetched_successfully",
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    // ✅ Handle unexpected undefined error object
    const errMsg = error?.message || "unknown_internal_error";

    return res.status(500).json({
      success: false,
      message: "internal_server_error",
      error: errMsg,
    });
  }
};

module.exports = getAllNotifications;
