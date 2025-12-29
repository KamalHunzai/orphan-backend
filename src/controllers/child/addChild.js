const { Child, Notification } = require("../../../models");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../../utils/emailUtilchild");
const Joi = require("joi");

// Generate strong password
const generatePassword = () => crypto.randomBytes(8).toString("hex");

// Joi validation
const childSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(1).required(),
  gender: Joi.string().required(),
  location: Joi.string().required(),
  language: Joi.string().required(),
  guardianName: Joi.string().required(),
  relationship: Joi.string().required(),
  contactNumber: Joi.string().required(),
  generalCondition: Joi.string().allow(null, ""),
  currentEducationLevel: Joi.string().allow(null, ""),
  schoolPerformance: Joi.string().allow(null, ""),
  psychologicalSupportNeeds: Joi.string().allow(null, ""),
  financialSituation: Joi.string().allow(null, ""),
  additionalNotes: Joi.string().allow(null, ""),
  adminId: Joi.number().integer().required(),
});

const addChild = async (req, res) => {
  try {
    // Validate input
    const { error } = childSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.details,
      });
    }

    const {
      firstName,
      lastName,
      email,
      age,
      gender,
      location,
      language,
      guardianName,
      relationship,
      contactNumber,
      generalCondition,
      currentEducationLevel,
      schoolPerformance,
      psychologicalSupportNeeds,
      financialSituation,
      additionalNotes,
      adminId,
    } = req.body;

    // S3 URLs
    const profilePicture = req.files?.profilePicture?.[0]?.location || null;
    const upload = req.files?.upload?.[0]?.location || null;

    // Check existing child (include soft-deleted too)
    const existingChild = await Child.findOne({
      where: { email },
    });

    if (existingChild) {
      return res.status(409).json({
        message:
          "This email is already registered. Contact the admin to reactivate the child account.",
      });
    }

    // Generate / hash password
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Send credentials email
    const emailSent = await sendEmail(
      email,
      `${firstName} ${lastName}`,
      password
    );

    if (!emailSent) {
      return res.status(500).json({
        message: "Email sending failed. Child not registered.",
      });
    }

    // Create Child
    const newChild = await Child.create({
      first_name: firstName,
      last_name: lastName,
      email,
      age,
      gender,
      location,
      language,
      guardian_name: guardianName,
      relationship,
      contact_number: contactNumber,
      general_condition: generalCondition,
      current_education_level: currentEducationLevel,
      school_performance: schoolPerformance,
      psychological_support_needs: psychologicalSupportNeeds,
      financial_situation: financialSituation,
      additional_notes: additionalNotes,
      password: hashedPassword,
      profile_picture: profilePicture,
      uploaded_file: upload,
      admin_id: adminId,
    });

    // Create notification
    await Notification.create({
      title: "New Child Registered",
      message: `Child ${firstName} ${lastName} has been registered successfully.`,
      type: "child_registration",
      child_id: newChild.id,
      admin_id: adminId,
      is_read: false,
    });

    return res.status(201).json({
      message:
        "Child registered successfully. Check email for login credentials.",
      child: newChild,
    });
  } catch (error) {
    console.error("AddChild Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = addChild;
