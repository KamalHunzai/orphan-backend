"use strict";
const { Task, Child } = require("../../../models");

const countTasksByTypeWithCountry = async (req, res) => {
  const { country } = req.query;

  if (!country) {
    return res.status(400).json({
      success: false,
      message: "Country is required in query params",
    });
  }

  try {
    const data = await Task.findAll({
      attributes: [
        "task_type",
        [Task.sequelize.fn("COUNT", Task.sequelize.col("Task.id")), "count"],
      ],
      include: [
        {
          model: Child,
          as: "child",
          attributes: [],
          where: {
            location: country, // ✅ correct column
            is_deleted: false, // ✅ respect soft delete
          },
          required: true,
        },
      ],
      where: { is_deleted: false }, // ✅ soft delete for tasks
      group: ["task_type"],
      raw: true,
    });

    return res.status(200).json({
      success: true,
      message: `Task counts grouped by type for country: ${country}`,
      data: data || [],
    });
  } catch (error) {
    console.error("Error counting tasks by type with country:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = countTasksByTypeWithCountry;
