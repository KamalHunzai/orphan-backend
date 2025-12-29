"use strict";
const { Report, Child } = require("../../../models");
const { Op, fn, col, literal } = require("sequelize");

const getTrendsByCountry = async (req, res) => {
  const { country } = req.query;

  if (!country) {
    return res.status(400).json({
      success: false,
      message: "Country is required in query",
    });
  }

  try {
    const reports = await Report.findAll({
      attributes: [
        [fn("DATE_TRUNC", "month", col("date")), "month"],
        [
          fn(
            "COUNT",
            literal(
              `CASE WHEN "academic_performance" IS NOT NULL AND "academic_performance" != '' THEN 1 END`
            )
          ),
          "academic_performance",
        ],
        [
          fn(
            "COUNT",
            literal(
              `CASE WHEN "social_integration" IS NOT NULL AND "social_integration" != '' THEN 1 END`
            )
          ),
          "social_integration",
        ],
        [
          fn(
            "COUNT",
            literal(
              `CASE WHEN "mental_state" IS NOT NULL AND "mental_state" != '' THEN 1 END`
            )
          ),
          "mental_state",
        ],
      ],
      include: [
        {
          model: Child,
          as: "child", // ✅ MUST MATCH MODEL ASSOCIATION
          attributes: [],
          where: {
            location: country,
            is_deleted: false, // optional but recommended
          },
          required: true,
        },
      ],
      where: {
        is_deleted: false,
      },
      group: [literal(`DATE_TRUNC('month', "date")`)],
      order: [[literal(`DATE_TRUNC('month', "date")`), "ASC"]],
      raw: true,
    });

    const formatted = reports.map((r) => {
      const date = new Date(r.month);
      return {
        month: date.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        }),
        academic_performance: Number(r.academic_performance),
        social_integration: Number(r.social_integration),
        mental_state: Number(r.mental_state),
      };
    });

    return res.status(200).json({
      success: true,
      message: "Monthly trends fetched successfully",
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("Error getting monthly trends:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = getTrendsByCountry;
