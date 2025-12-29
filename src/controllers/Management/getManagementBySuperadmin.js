// controllers/managementController.js
const { Management } = require("../../../models");

const getManagementBySuperadmin = async (req, res) => {
  try {
    const { superadminId } = req.params;

    if (!superadminId || isNaN(Number(superadminId))) {
      return res.status(400).json({
        success: false,
        message: "Valid superadminId is required",
      });
    }

    // Fetch only non-deleted managements
    const managements = await Management.findAll({
      where: {
        superadminId: Number(superadminId),
        is_deleted: false, // ✅ respect soft delete
      },
      order: [["created_at", "DESC"]], // ✅ underscore style consistent with DB
    });

    return res.status(200).json({
      success: true,
      message: "Managements fetched successfully",
      count: managements.length,
      data: managements,
    });
  } catch (error) {
    console.error("Get Management by SuperAdmin Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = getManagementBySuperadmin;
