"use strict";
const { Report, Child } = require("../../../models");

const countReportsByTypeAndCountry = async (req, res) => {
  try {
    const data = await Report.findAll({
      attributes: [
        [Report.sequelize.col("child.location"), "location"],
        ["urgency_level", "urgency_level"],
        [
          Report.sequelize.fn("COUNT", Report.sequelize.col("Report.id")),
          "count",
        ],
      ],
      include: [
        {
          model: Child,
          as: "child", // ✅ MUST match your Report.belongsTo(Child, { as: "child" })
          attributes: [],
          where: { is_deleted: false },
          required: true,
        },
      ],
      where: { is_deleted: false },
      group: ["child.location", "Report.urgency_level"],
      raw: true,
    });

    return res.status(200).json({
      success: true,
      message: "Report counts retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Error getting report counts by type and country:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = countReportsByTypeAndCountry;
