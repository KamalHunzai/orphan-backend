const { Sequelize } = require("sequelize");
const { Child, Admin } = require("../../../models");

const getAgeDistribution = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res
        .status(400)
        .json({ error: "Country query parameter is required" });
    }

    // Define age groups
    const ageGroups = [
      { min: 4, max: 6, label: "4-6 years" },
      { min: 7, max: 9, label: "7-9 years" },
      { min: 10, max: 12, label: "10-12 years" },
      { min: 13, max: 15, label: "13-15 years" },
    ];

    // Get total children for the country
    const totalChildren = await Child.count({
      include: [
        {
          model: Admin,
          as: "admin", // ✅ match the alias used in Child.belongsTo(Admin)
          where: { country },
          attributes: [],
        },
      ],
    });

    if (totalChildren === 0) {
      return res.status(200).json({ message: "No children found", data: [] });
    }

    // Fetch all children ages for the country in a single query
    const children = await Child.findAll({
      attributes: ["age"],
      include: [
        {
          model: Admin,
          as: "admin",
          where: { country },
          attributes: [],
        },
      ],
      raw: true,
    });

    // Count children in each age group
    const ageCounts = ageGroups.map(({ min, max, label }) => {
      const count = children.filter((c) => c.age >= min && c.age <= max).length;
      return {
        label,
        count,
        percentage: ((count / totalChildren) * 100).toFixed(2),
      };
    });

    res.status(200).json(ageCounts);
  } catch (err) {
    console.error("Error fetching age distribution:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getAgeDistribution;
