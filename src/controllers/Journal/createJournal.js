"use strict";
const { Journal } = require("../../../models");

const createJournal = async (req, res) => {
  try {
    const data = {
      ...req.body,
      moodRating: req.body.moodRating ? parseInt(req.body.moodRating) : null,
    };

    let {
      journalText,
      childId,
      moodRating,
      emotionTags,
      socialInteraction,
      assessmentType,
      notes,
      activities,
      tittle,
    } = data;

    // Normalize arrays
    if (emotionTags && !Array.isArray(emotionTags)) {
      try {
        emotionTags = JSON.parse(emotionTags);
      } catch {
        emotionTags = [String(emotionTags).trim()];
      }
    }

    if (activities && !Array.isArray(activities)) {
      try {
        activities = JSON.parse(activities);
      } catch {
        activities = String(activities)
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      }
    }

    console.log("REQ FILE:", req.file);

    // ✅ Save full file URL if uploaded
    const uploadedFileUrl = req.file ? req.file.location : null;

    const newJournal = await Journal.create({
      journalText,
      childId,
      moodRating,
      emotionTags,
      socialInteraction,
      assessmentType,
      notes,
      uploadedFile: uploadedFileUrl, // ✅ stores full URL
      activities,
      tittle,
    });

    return res.status(201).json({
      success: true,
      message: "Journal created successfully",
      journal: newJournal,
    });
  } catch (err) {
    console.error("Error creating journal:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = createJournal;
