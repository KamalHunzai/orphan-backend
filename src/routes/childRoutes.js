const express = require("express");
const router = express.Router();

// Controllers
const addChild = require("../controllers/child/addChild");
const loginChild = require("../controllers/child/loginChild");
const getAllChildren = require("../controllers/child/getAllChildren");
const getChildById = require("../controllers/child/getChildByChildId");
const updateChild = require("../controllers/child/updateChild");
const updatePassword = require("../controllers/child/updatePassword");

const getAdminByChildId = require("../controllers/child/getAdminByChildId");
const getChildrenByAdminId = require("../controllers/child/getChildrenByAdminId");
const getAgeDistribution = require("../controllers/child/childStatisticsController");
const countChildrenByCountry = require("../controllers/child/countChildrenByCountry");
const getDashboardCounts = require("../controllers/child/getDashboardCounts");
const getChildrenByCountry = require("../controllers/child/getChildrenByCountry");
const deleteChild = require("../controllers/child/deleteChild");
const getAgeGroupDistribution = require("../controllers/child/getAgeGroupDistribution");

const getReportByChildId = require("../controllers/Reportss/getReportByChildId");

const getNotificationsByChild = require("../controllers/Notification/getNotificationsByChild");
const markNotificationAsRead = require("../controllers/Notification/markNotificationAsRead");

const verifyOtp = require("../controllers/child/verifyOtp");
const sendOtp = require("../controllers/child/sendOtp");
const resetPassword = require("../controllers/child/resetPassword");

// Upload middleware (multer-S3 instance)
const upload = require("../middlewares/Upload");
const { route } = require("./adminRoutes");

// ------------------- ROUTES -------------------

// Add Child (with S3 file upload)
router.post(
  "/addChild",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "upload", maxCount: 1 },
  ]),
  addChild
);

// Login
router.post("/login", loginChild);

// Get children
router.get("/allchildren", getAllChildren);
router.get("/getbyid/:id", getChildById);

// Update Child (also supports S3 upload)
router.put(
  "/updateChild/:id",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "upload", maxCount: 1 },
  ]),
  updateChild
);

// Admin-related
router.get("/getAdminByChildId/:childId", getAdminByChildId);
router.get("/getChildrenByAdminId/:adminId", getChildrenByAdminId);

// Statistics
router.get("/age-distribution", getAgeDistribution);
router.get("/countChildrenByCountry", countChildrenByCountry);
router.get("/getDashboardCounts", getDashboardCounts);
router.get("/getChildrenByCountry", getChildrenByCountry);
router.get("/get-Age-Group", getAgeGroupDistribution);

// Delete
router.delete("/deleteChild/:id", deleteChild);

// Reports
router.get("/getReportByChildId/:childId", getReportByChildId);

// Notifications
router.get("/getNotificationsByChild/:childId", getNotificationsByChild);
router.put("/markNotificationAsRead/:id", markNotificationAsRead);

// OTP / Password
router.post("/verifyOtp", verifyOtp);
router.post("/sendOtp", sendOtp);
router.put("/updatePassword/:id", updatePassword);
router.post("/resetPassword", resetPassword);

module.exports = router;
