const { SuperAdmin } = require("../../../models");
const Joi = require("joi");

const getSuperAdminById = async (req, res) => {
  // Joi validation
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  });

  const { error } = schema.validate(req.params);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    const { id } = req.params;

    const superAdmin = await SuperAdmin.findOne({
      where: { id, is_deleted: false }, // ✅ respect soft delete
      attributes: { exclude: ["password"] }, // ✅ hide sensitive data
    });

    if (!superAdmin)
      return res
        .status(404)
        .json({ success: false, message: "SuperAdmin not found" });

    res.status(200).json({ success: true, data: superAdmin });
  } catch (err) {
    console.error("getSuperAdminById error:", err);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        error: err.message,
      });
  }
};

module.exports = getSuperAdminById;
