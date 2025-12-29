"use strict";
const { Comment, Admin, Journal } = require("../../../models");

const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const commentId = Number(id);

    const comment = await Comment.findOne({
      where: { id: commentId, is_deleted: false }, // ✅ soft delete check
      include: [
        {
          model: Admin,
          as: "admin",
          attributes: ["id", "full_name", "profile_picture", "email"], // underscored
          required: false,
        },
        {
          model: Journal,
          as: "journal",
          attributes: ["id", "title"],
          required: false,
        },
      ],
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or already deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment fetched successfully",
      data: comment,
    });
  } catch (err) {
    console.error("getCommentById error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comment",
      error: err.message,
    });
  }
};

module.exports = getCommentById;
