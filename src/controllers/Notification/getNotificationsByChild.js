"use strict";
const { Notification, Child, Admin } = require("../../../models");

const get_notifications_by_child = async (req, res) => {
  try {
    const { childId } = req.params;

    if (!childId || isNaN(Number(childId))) {
      return res.status(400).json({
        success: false,
        message: "valid_child_id_is_required",
      });
    }

    const notifications = await Notification.findAll({
      where: {
        child_id: Number(childId),
        is_deleted: false,
      },
      include: [
        {
          model: Child,
          as: "child",
          attributes: [
            "id",
            "first_name",
            "last_name",
            "location",
            "profile_picture",
          ],
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

    // Map snake_case → camelCase for API response
    const response = notifications.map((n) => {
      const json = n.toJSON();
      return {
        id: json.id,
        title: json.title,
        message: json.message,
        type: json.type,
        isRead: json.is_read,
        isDeleted: json.is_deleted,
        childId: json.child_id,
        donorId: json.donor_id ?? null,
        visitReportId: json.visit_report_id ?? null,
        adminId: json.admin_id,
        createdAt: json.created_at,
        updatedAt: json.updated_at,
        child: json.child
          ? {
              id: json.child.id,
              firstName: json.child.first_name,
              lastName: json.child.last_name,
              location: json.child.location,
              profilePicture: json.child.profile_picture,
            }
          : null,
        admin: json.admin
          ? {
              id: json.admin.id,
              fullName: json.admin.full_name,
              email: json.admin.email,
            }
          : null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "notifications_retrieved_successfully",
      count: response.length,
      data: response,
    });
  } catch (error) {
    console.error("get_notifications_by_child_error:", error);
    return res.status(500).json({
      success: false,
      message: "internal_server_error",
      error: error.message,
    });
  }
};

module.exports = get_notifications_by_child;
