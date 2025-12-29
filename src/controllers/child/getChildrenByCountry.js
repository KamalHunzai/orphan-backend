const { Child } = require("../../../models");

const getChildrenByCountry = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({
        success: false,
        message: "Country is required.",
      });
    }

    const children = await Child.findAll({
      where: {
        location: country,
        is_deleted: false, // soft delete check
      },
      attributes: { exclude: ["password"] },
      order: [["created_at", "DESC"]], // underscore timestamp
      raw: true,
    });

    if (children.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No children found in this country.",
        data: [],
      });
    }

    // Map snake_case → camelCase for frontend
    const formattedChildren = children.map((child) => ({
      id: child.id,
      firstName: child.first_name,
      lastName: child.last_name,
      email: child.email,
      age: child.age,
      gender: child.gender,
      location: child.location,
      language: child.language,
      guardianName: child.guardian_name,
      relationship: child.relationship,
      contactNumber: child.contact_number,
      generalCondition: child.general_condition,
      currentEducationLevel: child.current_education_level,
      schoolPerformance: child.school_performance,
      psychologicalSupportNeeds: child.psychological_support_needs,
      financialSituation: child.financial_situation,
      additionalNotes: child.additional_notes,
      profilePicture: child.profile_picture,
    }));

    return res.status(200).json({
      success: true,
      message: "Children retrieved successfully",
      data: formattedChildren,
      count: formattedChildren.length,
    });
  } catch (err) {
    console.error("Error fetching children by country:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = getChildrenByCountry;
