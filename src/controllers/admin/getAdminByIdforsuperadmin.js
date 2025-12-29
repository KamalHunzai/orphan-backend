const { Admin, Child, Report, VisitReport } = require("../../../models");

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find admin by ID and exclude soft-deleted
    const adminData = await Admin.findOne({
      where: { id, is_deleted: false },
    });

    if (!adminData) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Count of assigned children (exclude soft-deleted)
    const childrenCount = await Child.count({
      where: { admin_id: id, is_deleted: false },
    });

    // Get latest assigned children (limit 5)
    const assignedChildren = await Child.findAll({
      where: { admin_id: id, is_deleted: false },
      attributes: ["id", "first_name", "last_name", "age"],
      order: [["created_at", "DESC"]],
      limit: 5,
    });

    // Get recent reports (limit 5) with associated children
    const recentReports = await Report.findAll({
      where: { admin_id: id, is_deleted: false },
      attributes: ["id", "report_type", "date"],
      order: [["date", "DESC"]],
      limit: 5,
      include: [
        {
          model: Child,
          as: "child", // ✅ match alias in Report.belongsTo(Child)
          attributes: ["id", "first_name", "last_name"],
          where: { is_deleted: false },
          required: false,
        },
      ],
    });

    // Get recent visit schedules (limit 5)
    const recentSchedules = await VisitReport.findAll({
      where: { admin_id: id, is_deleted: false },
      attributes: ["id", "visit_date", "visit_time"],
      order: [["visit_date", "DESC"]],
      limit: 5,
    });

    // Combine all data
    const result = {
      ...adminData.toJSON(),
      assignedChildren,
      childrenCount,
      recentReports,
      recentSchedules,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Get Admin By ID Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = getAdminById;
