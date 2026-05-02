"use strict";
const { Comment, Journal, Admin } = require("../../../models");

const getCommentsByJournalforuser = async (req, res) => {
  try {
    const { journalId } = req.params;
    const journalPk = Number(journalId);

    if (!journalId || isNaN(journalPk)) {
      return res.status(400).json({
        success: false,
        message: "Valid journal ID is required",
      });
    }

    const journalExists = await Journal.findOne({
      where: { id: journalPk, is_deleted: false },
    });
    if (!journalExists) {
      return res.status(404).json({
        success: false,
        message: "Journal not found or already deleted",
      });
    }

    const comments = await Comment.findAll({
      where: {
        journal_id: journalPk,
        visible: true,
        is_deleted: false,
      },
      include: [
        {
          model: Journal,
          as: "journal",
          attributes: ["id", "journal_text", "mood_rating"],
        },
        {
          model: Admin,
          as: "admin",
          attributes: ["id", "full_name", "profile_picture"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "Comments retrieved successfully",
      data: comments,
    });
  } catch (error) {
    console.error("getCommentsByJournal error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = getCommentsByJournalforuser;
