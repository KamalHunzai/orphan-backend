const express = require("express");
const router = express.Router();

const upload = require("../middlewares/Upload");

// Controllers
const addActivity = require("../controllers/Activity/addActivity");
const getActivitiesByAdminId = require("../controllers/Activity/getActivitiesByAdminId");
const getActivitiesByChildId = require("../controllers/Activity/getActivitiesByChildId");
const getRecentActivitiesByChild = require("../controllers/Activity/getRecentActivities");
const getRecentActivities = require("../controllers/Activity/getRecentActivitiesadmin");
const getRecentActivitiesByCountry = require("../controllers/Activity/getRecentActivitiesByCountry");
const deleteActivity = require("../controllers/Activity/deleteActivity");

// ---------------- ROUTES ----------------

// Add Activity (supports up to 5 file uploads → attachments[])
router.post("/add", upload.array("attachments", 5), addActivity);

// Get activities by admin
router.get("/getadminId/:adminId", getActivitiesByAdminId);

// Get activities by child
router.get("/child/:childId", getActivitiesByChildId);

// Get recent activities for a child
router.get("/recent/:childId", getRecentActivitiesByChild);

// Get recent activities for admin
router.get("/getRecentActivities-admin/:adminId", getRecentActivities);

// Get recent activities by country
router.get("/get-by-country", getRecentActivitiesByCountry);

// Delete activity
router.delete("/delete/:id", deleteActivity);

module.exports = router;
