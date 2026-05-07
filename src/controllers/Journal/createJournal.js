"use strict";
const Joi = require("joi");
const { Journal } = require("../../../models");

const journalSchema = Joi.object({
  title: Joi.string().min(1).required(),
  journalText: Joi.string().min(1).required(),
  childId: Joi.number().integer().required(),
  moodRating: Joi.number().integer().min(1).max(10).allow(null, ""),
  emotionTags: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ""),
  socialInteraction: Joi.string().allow(null, ""),
  assessmentType: Joi.string().allow(null, ""),
  notes: Joi.string().allow(null, ""),
  activities: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null, ""),
}).options({ allowUnknown: true });

const createJournal = async (req, res) => {
  try {
    const bodyToValidate = {
      title: req.body.title || req.body.tittle,
      journalText: req.body.journalText || req.body.journal_text,
      childId: req.body.childId || req.body.child_id,
      moodRating: req.body.moodRating || req.body.mood_rating,
      emotionTags: req.body.emotionTags || req.body.emotion_tags,
      socialInteraction: req.body.socialInteraction || req.body.social_interaction,
      assessmentType: req.body.assessmentType || req.body.assessment_type,
      notes: req.body.notes,
      activities: req.body.activities,
    };

    const { error } = journalSchema.validate(bodyToValidate);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

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
