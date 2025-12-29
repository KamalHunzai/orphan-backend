const { Op } = require("sequelize");
const { Child } = require("../../../models");

const getAgeGroupDistribution = async (req, res) => {
  try {
    const { country } = req.query;

    const ageGroups = {
      "1-5 years": 0,
      "5-10 years": 0,
      "10-15 years": 0,
      "15-20 years": 0,
    };

    const whereClause = { age: { [Op.not]: null } };
    if (country) whereClause.location = country;

    const children = await Child.findAll({
      attributes: ["age"],
      where: whereClause,
      raw: true,
    });

    children.forEach(({ age }) => {
      if (age >= 1 && age <= 5) ageGroups["1-5 years"]++;
      else if (age > 5 && age <= 10) ageGroups["5-10 years"]++;
      else if (age > 10 && age <= 15) ageGroups["10-15 years"]++;
      else if (age > 15 && age <= 20) ageGroups["15-20 years"]++;
    });

    const totalChildren = children.length;

    const chartData = Object.entries(ageGroups).map(([name, count]) => ({
      name,
      count,
      percentage: totalChildren
        ? `${((count / totalChildren) * 100).toFixed(2)}%`
        : "0.00%",
    }));

    return res.status(200).json({
      success: true,
      message: "Children age distribution fetched successfully",
      totalChildren,
      data: chartData,
    });
  } catch (error) {
    console.error("Error fetching age distribution:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = getAgeGroupDistribution;
