const { Child, Admin } = require("../../../models");
const Joi = require("joi");

// Joi Validation Schema
const childIdSchema = Joi.object({
  childId: Joi.number().integer().required(),
});

const getAdminByChildId = async (req, res) => {
  try {
    const { childId } = req.params;

    // Validate childId
    const { error } = childIdSchema.validate({ childId: Number(childId) });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Fetch child with associated admin
    const child = await Child.findByPk(childId, {
      include: [
        {
          model: Admin,
          as: "Admin", // Make sure this matches the alias defined in Child.belongsTo(Admin)
          attributes: { exclude: ["password", "otp", "otpExpiry"] }, // exclude sensitive fields
        },
      ],
    });

    if (!child || !child.adminId) {
      return res
        .status(404)
        .json({ message: "Admin not found for this child" });
    }

    res.status(200).json({ admin: child.Admin });
  } catch (error) {
    console.error("Error fetching admin by childId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getAdminByChildId;
