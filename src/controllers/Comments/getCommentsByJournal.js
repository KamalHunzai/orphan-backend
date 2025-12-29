"use strict";
const { Comment, Journal, Admin } = require("../../../models");
const { Op } = require("sequelize");

const getCommentsByJournal = async (req, res) => {
  try {
    const { id: journalId } = req.params;
    const journalPk = Number(journalId);

    // Validate journal ID
    if (!journalId || isNaN(journalPk)) {
      return res.status(400).json({
        success: false,
        error: "Valid journalId is required",
      });
    }

    // Optional: ensure journal itself is not soft-deleted (if it supports soft delete)
    const journalExists = await Journal.findOne({
      where: { id: journalPk, deleted: false },
    });
    if (!journalExists) {
      return res.status(404).json({
        success: false,
        error: "Journal not found or already deleted",
      });
    }

    // Fetch comments
    const comments = await Comment.findAll({
      where: {
        journalId: journalPk,
        visible: true, // ✅ only visible comments
        deleted: false, // ✅ enforce soft delete
      },
      include: [
        {
          model: Journal,
          as: "journal",
          attributes: ["id", "journalText", "moodRating"],
          required: false,
        },
        {
          model: Admin,
          as: "admin",
          attributes: ["id", "fullName", "profilePicture"],
          required: false,
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

module.exports = getCommentsByJournal;
