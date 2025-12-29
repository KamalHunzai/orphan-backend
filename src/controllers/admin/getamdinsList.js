const { Admin, Child } = require("../../../models");
const { Op } = require("sequelize");

const getMentorsList = async (req, res) => {
  try {
    const { country } = req.query; // Get country from query params

    // Define filtering condition
    const whereClause = {
      is_deleted: false, // ✅ exclude soft-deleted admins
      ...(country ? { country: { [Op.iLike]: `%${country}%` } } : {}),
    };

    // Fetch mentors with their assigned children count (exclude deleted children)
    const mentors = await Admin.findAll({
      where: whereClause,
      attributes: [
        "id",
        "full_name",
        "email",
        "phone_number",
        "country",
        "employment_type",
      ],
      include: [
        {
          model: Child,
          as: "assigned_children", // ✅ must match Admin.hasMany alias
          attributes: ["id"],
          where: { is_deleted: false }, // ✅ exclude soft-deleted children
          required: false, // include mentors even if they have no children
        },
      ],
    });

    // Format the response
    const formattedMentors = mentors.map((mentor) => ({
      id: mentor.id,
      name: mentor.full_name,
      email: mentor.email,
      phone: mentor.phone_number,
      location: mentor.country,
      type: mentor.employment_type === "Paid" ? "Paid" : "Volunteer",
      assignedChildren: mentor.assigned_children.length,
      status: "Active",
    }));

    return res.status(200).json({
      success: true,
      message: "Mentors retrieved successfully",
      data: formattedMentors,
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = getMentorsList;
