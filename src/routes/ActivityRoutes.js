const express = require("express");
const router = express.Router();

const { authenticate, requireAdmin, requireAdminOrSuperAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/Upload");

const addActivity = require("../controllers/Activity/addActivity");
const getActivitiesByAdminId = require("../controllers/Activity/getActivitiesByAdminId");
const getActivitiesByChildId = require("../controllers/Activity/getActivitiesByChildId");
const getRecentActivitiesByChild = require("../controllers/Activity/getRecentActivities");
const getRecentActivities = require("../controllers/Activity/getRecentActivitiesadmin");
const getRecentActivitiesByCountry = require("../controllers/Activity/getRecentActivitiesByCountry");
const deleteActivity = require("../controllers/Activity/deleteActivity");

router.post("/add", authenticate, requireAdminOrSuperAdmin, upload.array("attachments", 5), addActivity);
router.get("/getadminId/:adminId", authenticate, requireAdmin, getActivitiesByAdminId);
router.get("/child/:childId", authenticate, requireAdmin, getActivitiesByChildId);
router.get("/recent/:childId", authenticate, requireAdmin, getRecentActivitiesByChild);
router.get("/getRecentActivities-admin/:adminId", authenticate, requireAdmin, getRecentActivities);
router.get("/get-by-country", authenticate, requireAdminOrSuperAdmin, getRecentActivitiesByCountry);
router.delete("/delete/:id", authenticate, requireAdmin, deleteActivity);

module.exports = router;
