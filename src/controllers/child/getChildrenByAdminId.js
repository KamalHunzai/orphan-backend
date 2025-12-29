const { Child } = require("../../../models");
const { Op } = require("sequelize");

const getChildrenByAdminId = async (req, res) => {
  const { adminId } = req.params;

  if (!adminId) return res.status(400).json({ success: false });

  try {
    const children = await Child.findAll({
      where: { admin_id: adminId, is_deleted: false },
      attributes: { exclude: ["password"] },
      order: [["created_at", "DESC"]],
      raw: true,
    });

    return res.status(200).json({
      success: true,
      data: children,
      count: children.length,
    });
  } catch {
    return res.status(500).json({ success: false });
  }
};

module.exports = getChildrenByAdminId;
