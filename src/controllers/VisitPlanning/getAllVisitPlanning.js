const { VisitPlanning, Child, Admin } = require("../../../models");

// Get All Visit Planning Records with Child & Admin Info
const getAllVisitPlanning = async (req, res) => {
  try {
    const visitPlannings = await VisitPlanning.findAll({
      where: { is_deleted: false }, // Exclude soft-deleted records
      order: [
        ["visitDate", "ASC"],
        ["visitTime", "ASC"],
      ],
      include: [
        {
          model: Child,
          attributes: ["id", "firstName", "lastName", "location"],
        },
        {
          model: Admin,
          attributes: ["id", "fullName", "email"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Visit Planning records fetched successfully",
      data: visitPlannings,
    });
  } catch (err) {
    console.error("Error fetching visit planning records:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = getAllVisitPlanning;
