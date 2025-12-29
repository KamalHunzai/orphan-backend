const { Admin, Child, Sequelize } = require("../../../models");

const getMentorsByCountry = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({ message: "Country is required." });
    }

    const mentors = await Admin.findAll({
      where: {
        country,
        is_deleted: false,
      },
      include: [
        {
          model: Child,
          as: "assigned_children",
          attributes: [],
          where: { is_deleted: false },
          required: false,
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("assigned_children.id")),
            "child_count",
          ],
        ],
      },
      group: ["Admin.id"],
      order: [["full_name", "ASC"]],
    });

    const formattedMentors = mentors.map((mentor) => ({
      id: mentor.id,
      fullName: mentor.full_name,
      email: mentor.email,
      phoneNumber: mentor.phone_number,
      country: mentor.country,
      employmentType: mentor.employment_type,
      professionalBackground: mentor.professional_background,
      childCount: parseInt(mentor.get("child_count") || 0),
    }));

    const totalChildren = formattedMentors.reduce(
      (sum, mentor) => sum + mentor.childCount,
      0
    );

    res.status(200).json({
      totalMentors: mentors.length,
      totalChildren,
      mentors: formattedMentors,
    });
  } catch (error) {
    console.error("Error fetching mentors by country:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = getMentorsByCountry;
