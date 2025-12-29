"use strict";
const { Notification } = require("../../../models");

const markNotificationAsRead = async (req, res) => {
  try {
    const { id: notificationId } = req.params;

    if (!notificationId || isNaN(Number(notificationId))) {
      return res.status(400).json({
        success: false,
        message: "Valid notification ID is required",
      });
    }

    // Fetch notification, respecting soft delete
    const notification = await Notification.findOne({
      where: {
        id: Number(notificationId),
        is_deleted: false, // ✅ respect soft delete
      },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or already deleted",
      });
    }

    // Mark as read
    notification.is_read = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read successfully",
      data: notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = markNotificationAsRead;
