"use strict";
const { Comment, Journal, Admin, Notification } = require("../../../models");

// Validation helpers
const isBlank = (val) =>
  val === undefined || val === null || String(val).trim() === "";

const createComment = async (req, res) => {
  try {
    const { adminId, journalId, text, visible } = req.body;

    // ---- Validate text ----
    if (isBlank(text)) {
      return res
        .status(400)
        .json({ success: false, error: "Text is required" });
    }

    // ---- Validate journal id ----
    const journalPk = Number(journalId);
    if (isBlank(journalId) || isNaN(journalPk)) {
      return res
        .status(400)
        .json({ success: false, error: "Valid journalId is required" });
    }

    // ---- Check journal exists & not deleted ----
    const journal = await Journal.findOne({
      where: { id: journalPk, deleted: false },
    });

    if (!journal) {
      return res
        .status(404)
        .json({
          success: false,
          error: "Journal not found or already deleted",
        });
    }

    // ---- Validate admin id ----
    const adminPk = Number(adminId);
    if (isBlank(adminId) || isNaN(adminPk)) {
      return res
        .status(400)
        .json({ success: false, error: "Valid adminId is required" });
    }

    // ---- Check admin exists & not deleted ----
    const admin = await Admin.findOne({
      where: { id: adminPk, deleted: false },
    });

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, error: "Admin not found or already deleted" });
    }

    // ---- Create Comment ----
    const comment = await Comment.create({
      admin_id: adminPk,
      journal_id: journalPk,
      text: text.trim(),
      visible: visible !== undefined ? Boolean(visible) : true,
      deleted: false,
    });

    // ---- Create Notification for Child Owner of Journal ----
    const childId = journal.child_id; // Journal must have child_id FK
    if (childId) {
      await Notification.create({
        child_id: childId,
        admin_id: adminPk,
        journal_id: journalPk,
        message: `New comment from Admin on your journal`,
        read: false,
        deleted: false,
      });

      console.log("🔔 Notification created for child_id:", childId);
    }

    // ---- Response ----
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
