const { Child } = require("../../../models");

const updateChild = async (req, res) => {
  try {
    const { id } = req.params;

    const child = await Child.findByPk(id);
    if (!child) {
      return res.status(404).json({
        success: false,
        message: "child_not_found",
      });
    }

    console.log("Request body:", JSON.stringify(req.body, null, 2));

    // S3 URLs (same as addChild)
    const profile_picture =
      req.files?.profilePicture?.[0]?.location || child.profile_picture;

    const uploaded_file =
      req.files?.upload?.[0]?.location || child.uploaded_file;

    // Update payload
    const payload = {
      first_name: req.body.firstName ?? child.first_name,
      last_name: req.body.lastName ?? child.last_name,
      email: req.body.email ?? child.email,
      age: req.body.age ?? child.age,
      gender: req.body.gender ?? child.gender,
      location: req.body.location ?? child.location,
      language: req.body.language ?? child.language,
      guardian_name: req.body.guardianName ?? child.guardian_name,
      relationship: req.body.relationship ?? child.relationship,
      contact_number: req.body.contactNumber ?? child.contact_number,
      general_condition: req.body.generalCondition ?? child.general_condition,
      current_education_level:
        req.body.currentEducationLevel ?? child.current_education_level,
      school_performance:
        req.body.schoolPerformance ?? child.school_performance,
      psychological_support_needs:
        req.body.psychologicalSupportNeeds ?? child.psychological_support_needs,
      financial_situation:
        req.body.financialSituation ?? child.financial_situation,
      additional_notes: req.body.additionalNotes ?? child.additional_notes,
      assigned_admin_id: req.body.adminId ?? child.assigned_admin_id,
      profile_picture,
      uploaded_file,
    };

    await child.update(payload);
    await child.reload(); // ensures updated S3 URLs return

    // Convert to camelCase response
    const cleanChild = {
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
      assignedAdminId: child.assigned_admin_id,
      profilePicture: child.profile_picture, // S3 URL
      upload: child.uploaded_file, // S3 URL
      createdAt: child.created_at,
      updatedAt: child.updated_at,
    };

    console.log("Response body:", JSON.stringify(cleanChild, null, 2));

    return res.status(200).json({
      success: true,
      message: "child_updated_successfully",
      child: cleanChild,
    });
  } catch (error) {
    console.error("update_child_error:", error);
    return res.status(500).json({
      success: false,
      message: "internal_server_error",
    });
  }
};

module.exports = updateChild;
