"use strict";
const { Op, fn, col, literal } = require("sequelize");
const moment = require("moment");
const { Activity, Admin } = require("../../../models");

const getMentorActivityByCountry = async (req, res) => {
  try {
    const { country } = req.params;

    if (!country) {
      return res.status(400).json({
        success: false,
        message: "Country is required",
      });
    }

    const startOfYear = moment().startOf("year").toDate();
    const endOfYear = moment().endOf("year").toDate();

    const activityCounts = await Activity.findAll({
      attributes: [
        [literal(`EXTRACT(MONTH FROM "Activity"."created_at")`), "month"],
        [fn("COUNT", col("Activity.id")), "activity_count"],
      ],
      include: [
        {
          model: Admin,
          as: "admin",
          attributes: [],
          where: {
            country,
            is_deleted: false,
          },
          required: true,
        },
      ],
      where: {
        is_deleted: false,
        created_at: {
          [Op.between]: [startOfYear, endOfYear],
        },
      },
      group: [literal(`EXTRACT(MONTH FROM "Activity"."created_at")`)],
      order: [[literal(`EXTRACT(MONTH FROM "Activity"."created_at")`), "ASC"]],
      raw: true,
    });

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const formattedData = activityCounts.map((item) => ({
      month: monthNames[item.month - 1] || "Unknown",
      activity_count: Number(item.activity_count),
    }));

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (err) {
    console.error("Mentor Activity Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = getMentorActivityByCountry;
