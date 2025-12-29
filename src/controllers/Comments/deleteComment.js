"use strict";
const { Comment } = require("../../../models");

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find comment that is NOT already soft deleted
    const comment = await Comment.findOne({
      where: { id: Number(id), deleted: false },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found or already deleted",
      });
    }

    // Soft delete
    await comment.update({ deleted: true });

    return res.status(200).json({
      success: true,
      message: "Comment soft-deleted successfully",
    });
  } catch (err) {
    console.error("deleteComment error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to soft delete comment",
    });
  }
};

module.exports = deleteComment;
