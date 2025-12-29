const {
  Child,
  Task,
  VisitPlanning,
  VisitReport,
  Activity,
  Report,
} = require("../../../models");

const deleteChild = async (req, res) => {
  try {
    const { id } = req.params;

    const child = await Child.findByPk(id);

    if (!child || child.is_deleted) {
      return res.status(404).json({ message: "Child not found." });
    }

    // Soft delete associated records
    await Task.update({ is_deleted: true }, { where: { child_id: id } });
    await VisitPlanning.update(
      { is_deleted: true },
      { where: { child_id: id } }
    );
    await VisitReport.update({ is_deleted: true }, { where: { child_id: id } });
    await Activity.update({ is_deleted: true }, { where: { child_id: id } });
    await Report.update({ is_deleted: true }, { where: { child_id: id } });

    // Soft delete child
    await child.update({ is_deleted: true });

    res.status(200).json({
      message: "Child and all associated data marked as deleted (soft delete).",
    });
  } catch (error) {
    console.error("Error soft deleting child:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = deleteChild;
