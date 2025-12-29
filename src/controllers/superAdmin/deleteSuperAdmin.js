const { SuperAdmin, Management, Child } = require("../../../models");

const deleteSuperAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    // Find SuperAdmin
    const superAdmin = await SuperAdmin.findOne({
      where: { id, is_deleted: false },
    });

    if (!superAdmin) {
      return res.status(404).json({
        message: "SuperAdmin not found or already deleted",
      });
    }

    // Check for associated Managements
    const managementCount = await Management.count({
      where: { superadminId: id, is_deleted: false },
    });

    if (managementCount > 0) {
      return res.status(400).json({
        message: `Cannot delete SuperAdmin. There are ${managementCount} associated Management(s).`,
      });
    }

    // Optionally, check for children under Managements
    const childCount = await Child.count({
      include: [
        {
          model: Management,
          as: "management",
          where: { superadminId: id, is_deleted: false },
        },
      ],
      where: { is_deleted: false },
    });

    if (childCount > 0) {
      return res.status(400).json({
        message: `Cannot delete SuperAdmin. There are ${childCount} associated Child(ren).`,
      });
    }

    // Soft delete SuperAdmin
    await SuperAdmin.update({ is_deleted: true }, { where: { id } });

    return res.status(200).json({
      message: "SuperAdmin deleted successfully (soft delete applied)",
    });
  } catch (err) {
    console.error("Error deleting SuperAdmin:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = deleteSuperAdmin;
