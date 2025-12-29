"use strict";
const { Comment, Journal, Admin } = require("../../../models");

const getCommentsByJournalforuser = async (req, res) => {
  try {
    const { journalId } = req.params;
    const journalPk = Number(journalId);

    // Validate journal ID
    if (!journalId || isNaN(journalPk)) {
      return res.status(400).json({
        success: false,
        message: "Valid journal ID is required",
      });
    }

    // Optional: Make sure journal itself isn't soft-deleted (since you said ALL models have soft delete)
    const journalExists = await Journal.findOne({
      where: { id: journalPk, deleted: false },
    });
    if (!journalExists) {
      return res.status(404).json({
        success: false,
        message: "Journal not found or already deleted",
      });
    }

    const comments = await Comment.findAll({
      where: {
        journalId: journalPk,
        visible: true,
        deleted: false, // ✅ enforce soft delete
      },
      include: [
        {
          model: Journal,
          as: "journal",
          attributes: ["id", "journalText", "moodRating"],
        },
        {
          model: Admin,
          as: "admin",
          attributes: ["id", "fullName", "profilePicture"],
        },
      ],
      order: [["createdAt", "DESC"]],
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
