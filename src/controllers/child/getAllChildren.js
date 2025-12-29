const { Op } = require("sequelize");
const { Child, admin } = require("../../../models");

const getAllChildren = async (req, res) => {
  try {
    // Pagination params
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    // Filters
    const { country, minAge, maxAge } = req.query;

    const whereClause = {};

    // Age filter
    if (minAge || maxAge) {
      whereClause.age = {};
      if (minAge) whereClause.age[Op.gte] = parseInt(minAge, 10);
      if (maxAge) whereClause.age[Op.lte] = parseInt(maxAge, 10);
    }

    // Include admin for country filter if needed
    const includeClause = [];
    if (country) {
      includeClause.push({
        model: admin,
        as: "Admin",
        attributes: [],
        where: { country },
        required: true, // INNER JOIN
      });
    }

    // Fetch paginated and filtered children
    const { rows: children, count: total } = await Child.findAndCountAll({
      attributes: { exclude: ["password"] },
      where: whereClause,
      include: includeClause,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      distinct: true, // ensures correct count when using include
      raw: true,
    });

    if (!children.length) {
      return res.status(404).json({ message: "No children found" });
    }

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      message: "Children retrieved successfully",
      page,
      limit,
      total,
      totalPages,
      children,
    });
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getAllChildren;
