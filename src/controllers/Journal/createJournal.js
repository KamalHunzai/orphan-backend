"use strict";
const { Journal } = require("../../../models");

const createJournal = async (req, res) => {
  try {
    const data = {
      ...req.body,
      mood_rating: req.body.moodRating ? parseInt(req.body.moodRating) : null,
    };

    let {
      journal_text,
      child_id,
      mood_rating,
      emotion_tags,
      social_interaction,
      assessment_type,
      notes,
      activities,
      title,
    } = data;

    // Accept both camelCase (from client) and snake_case
    journal_text = journal_text || req.body.journalText;
    child_id = child_id || req.body.childId;
    emotion_tags = emotion_tags || req.body.emotionTags;
    social_interaction = social_interaction || req.body.socialInteraction;
    assessment_type = assessment_type || req.body.assessmentType;
    title = title || req.body.tittle; // handle legacy typo from old clients

    if (Array.isArray(emotion_tags) === false && emotion_tags) {
      try {
        emotion_tags = JSON.parse(emotion_tags);
      } catch {
        emotion_tags = [String(emotion_tags).trim()];
      }
    }

    if (Array.isArray(activities) === false && activities) {
      try {
        activities = JSON.parse(activities);
      } catch {
        activities = String(activities)
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      }
    }

    const uploaded_file = req.file ? req.file.location : null;

    const newJournal = await Journal.create({
      title,
      journal_text,
      child_id,
      mood_rating,
      emotion_tags,
      social_interaction,
      assessment_type,
      notes,
      uploaded_file,
      activities,
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
