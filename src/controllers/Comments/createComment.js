"use strict";
const { Comment, Journal, Admin, Notification } = require("../../../models");

const isBlank = (val) =>
  val === undefined || val === null || String(val).trim() === "";

const createComment = async (req, res) => {
  try {
    const { adminId, journalId, text, visible } = req.body;

    if (isBlank(text)) {
      return res
        .status(400)
        .json({ success: false, error: "Text is required" });
    }

    const journalPk = Number(journalId);
    if (isBlank(journalId) || isNaN(journalPk)) {
      return res
        .status(400)
        .json({ success: false, error: "Valid journalId is required" });
    }

    const journal = await Journal.findOne({
      where: { id: journalPk, is_deleted: false },
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        error: "Journal not found or already deleted",
      });
    }

    const adminPk = Number(adminId);
    if (isBlank(adminId) || isNaN(adminPk)) {
      return res
        .status(400)
        .json({ success: false, error: "Valid adminId is required" });
    }

    const admin = await Admin.findOne({
      where: { id: adminPk, is_deleted: false },
    });

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, error: "Admin not found or already deleted" });
    }

    const comment = await Comment.create({
      admin_id: adminPk,
      journal_id: journalPk,
      text: text.trim(),
      visible: visible !== undefined ? Boolean(visible) : true,
      is_deleted: false,
    });

    const childId = journal.child_id;
    if (childId) {
      await Notification.create({
        title: "New comment on your journal",
        child_id: childId,
        admin_id: adminPk,
        message: `New comment from Admin on your journal`,
        is_read: false,
        is_deleted: false,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      data: comment,
    });
  } catch (err) {
    console.error("createComment error:", err);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create comment" });
  }
};

module.exports = createComment;
