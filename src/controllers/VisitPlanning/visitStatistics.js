const { Sequelize } = require("sequelize");
const { VisitPlanning } = require("../../../models");

const getVisitStatistics = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const visitStats = await VisitPlanning.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("visitDate")), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      where: Sequelize.where(
        Sequelize.fn("YEAR", Sequelize.col("visitDate")),
        currentYear
      ),
      group: [Sequelize.fn("MONTH", Sequelize.col("visitDate"))],
      order: [[Sequelize.fn("MONTH", Sequelize.col("visitDate")), "ASC"]],
      raw: true,
    });

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const formattedStats = monthNames.map((month, index) => {
      const monthData = visitStats.find((stat) => stat.month === index + 1);
      return {
        month,
        count: monthData ? parseInt(monthData.count, 10) : 0,
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedStats,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = getVisitStatistics;
