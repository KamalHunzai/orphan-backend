const { SuperAdmin } = require("../../../models");
const { Op } = require("sequelize");

const getAdminsAndManagers = async (req, res) => {
  try {
    const adminsAndManagers = await SuperAdmin.findAll({
      where: {
        role: {
          [Op.in]: ["Admin", "Manager"], // ✅ proper IN clause
        },
        is_deleted: false, // ✅ exclude soft-deleted records
      },
      attributes: { exclude: ["password"] }, // optional: exclude password
    });

    res.status(200).json({
      message: "Admins and Managers fetched successfully",
      data: adminsAndManagers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getAdminsAndManagers;
