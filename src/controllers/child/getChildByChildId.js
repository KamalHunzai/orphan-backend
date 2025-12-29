"use strict";
const {
  Child,
  Report,
  Admin,
  VisitReport,
  Activity,
} = require("../../../models");

// Convert snake_case → camelCase for response
const toCamel = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  if (obj instanceof Date) return obj.toISOString(); // ← convert Date to ISO string
  if (Array.isArray(obj)) return obj.map((o) => toCamel(o));

  const newObj = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    newObj[camelKey] = toCamel(obj[key]);
  }
  return newObj;
};

const getChildById = async (req, res) => {
  try {
    const { id } = req.params;

    const child = await Child.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Report,
          as: "reports",
          required: false,
          where: { is_deleted: false },
        },
        {
          model: Admin,
          as: "assigned_admin",
          attributes: ["id", "full_name", "email", "country", "phone_number"],
          required: false,
          where: { is_deleted: false },
        },
        {
          model: VisitReport,
          as: "visit_reports",
          required: false,
          where: { is_deleted: false },
        },
        {
          model: Activity,
          as: "activities",
          required: false,
          separate: true,
          limit: 5,
          order: [["created_at", "DESC"]],
          where: { is_deleted: false },
          attributes: [
            "id",
            "activity_type",
            "title",
            "description",
            "date",
            "time",
            "attachments",
            "admin_id",
            "status",
            "uploaded_file",
            "created_at",
            "updated_at",
          ],
        },
      ],
    });

    if (!child) {
      return res
        .status(404)
        .json({ success: false, message: "child_not_found" });
    }

    // Convert Sequelize instance → plain JS + camelCase
    const childData = toCamel(child.get({ plain: true }));

    return res.status(200).json({
      success: true,
      child: childData,
    });
  } catch (error) {
    console.error("get_child_by_id_error:", error);
    return res.status(500).json({
      success: false,
      message: "internal_server_error",
    });
  }
};

module.exports = getChildById;
