const { Child } = require("../../../models");

const countChildrenByCountry = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({ message: "Country is required." });
    }

    const count = await Child.count({
      where: { location: country }, // ✅ match model column name
    });

    res.status(200).json({ country, count });
  } catch (error) {
    console.error("Error fetching children count:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = countChildrenByCountry;
