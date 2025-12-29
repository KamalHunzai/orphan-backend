const { Op } = require("sequelize");
const {
  Child,
  VisitReport,
  Report,
  LearningMaterial,
} = require("../../../models");

const getDashboardStatsByAdmin = async (req, res) => {
  try {
    const adminId = parseInt(req.params.adminId);
    if (isNaN(adminId)) {
      return res.status(400).json({ error: "Invalid adminId" });
    }

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [
      activeChildren,
      reportsThisMonth,
      upcomingVisits,
      learningMaterials,
    ] = await Promise.all([
      // Count distinct active children excluding soft-deleted
      Child.count({
        where: {
          admin_id: adminId,
          is_deleted: false, // ✅ exclude soft-deleted children
        },
      }),

      // Count reports created this month excluding soft-deleted
      Report.count({
        where: {
          admin_id: adminId,
          is_deleted: false,
          created_at: { [Op.between]: [startOfMonth, endOfMonth] }, // ✅ snake_case
        },
      }),

      // Count visit reports from today onwards excluding soft-deleted
      VisitReport.count({
        where: {
          admin_id: adminId,
          is_deleted: false,
          visit_date: { [Op.gte]: startOfToday }, // ✅ snake_case
        },
      }),

      // Count learning materials excluding soft-deleted
      LearningMaterial.count({
        where: {
          admin_id: adminId,
          is_deleted: false,
        },
      }),
    ]);

    return res.status(200).json({
      activeChildren,
      reportsThisMonth,
      upcomingVisits,
      learningMaterials,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      error: "Failed to fetch dashboard statistics",
      details: error.message,
    });
  }
};

module.exports = getDashboardStatsByAdmin;
