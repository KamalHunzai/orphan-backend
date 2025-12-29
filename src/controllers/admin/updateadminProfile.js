const { Admin } = require("../../../models");
const bcrypt = require("bcryptjs");

const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, currentPassword, newPassword } = req.body;

  try {
    // ✅ Exclude soft-deleted admins
    const adminInstance = await Admin.findOne({
      where: { id, is_deleted: false },
    });
    if (!adminInstance) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let updatedPassword = adminInstance.password;

    // ----- PASSWORD UPDATE -----
    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password is required" });
      }

      const isMatch = await bcrypt.compare(
        currentPassword,
        adminInstance.password
      );
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      updatedPassword = await bcrypt.hash(newPassword, 10);
    }

    // ----- UPDATE FIELDS -----
    const updateData = {};
    if (fullName) updateData.full_name = fullName;
    if (email) updateData.email = email.toLowerCase();
    if (newPassword) updateData.password = updatedPassword;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields provided for update" });
    }

    // Apply update
    await adminInstance.update(updateData);

    // Return updated admin (snake_case mapping)
    const updatedAdmin = await Admin.findByPk(id, {
      attributes: ["id", "full_name", "email"],
    });

    return res.status(200).json({
      message: "Admin updated successfully",
      data: {
        id: updatedAdmin.id,
        fullName: updatedAdmin.full_name,
        email: updatedAdmin.email,
      },
    });
  } catch (err) {
    console.error("UpdateAdmin Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateAdmin;
