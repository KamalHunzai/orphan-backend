const express = require("express");
const router = express.Router();

const { authenticate, requireAdmin, requireChild, requireAdminOrSuperAdmin } = require("../middlewares/auth");
const { authLimiter, otpLimiter } = require("../middlewares/rateLimiter");

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

// ------------------- ROUTES -------------------

// Public
router.post("/login", authLimiter, loginChild);
router.post("/sendOtp", otpLimiter, sendOtp);
router.post("/verifyOtp", authLimiter, verifyOtp);
router.post("/resetPassword", authLimiter, resetPassword);

// Admin only
router.post(
  "/addChild",
  authenticate, requireAdmin,
  upload.fields([{ name: "profilePicture", maxCount: 1 }, { name: "upload", maxCount: 1 }]),
  addChild
);
router.get("/allchildren", authenticate, requireAdmin, getAllChildren);
router.put(
  "/updateChild/:id",
  authenticate, requireAdmin,
  upload.fields([{ name: "profilePicture", maxCount: 1 }, { name: "upload", maxCount: 1 }]),
  updateChild
);
router.get("/getChildrenByAdminId/:adminId", authenticate, requireAdmin, getChildrenByAdminId);
router.delete("/deleteChild/:id", authenticate, requireAdmin, deleteChild);

// Admin or SuperAdmin
router.get("/age-distribution", authenticate, requireAdminOrSuperAdmin, getAgeDistribution);
router.get("/countChildrenByCountry", authenticate, requireAdminOrSuperAdmin, countChildrenByCountry);
router.get("/getDashboardCounts", authenticate, requireAdminOrSuperAdmin, getDashboardCounts);
router.get("/getChildrenByCountry", authenticate, requireAdminOrSuperAdmin, getChildrenByCountry);
router.get("/get-Age-Group", authenticate, requireAdminOrSuperAdmin, getAgeGroupDistribution);

// Admin or Child
router.get("/getbyid/:id", authenticate, getChildById);
router.get("/getAdminByChildId/:childId", authenticate, getAdminByChildId);
router.get("/getReportByChildId/:childId", authenticate, getReportByChildId);

// Child only
router.get("/getNotificationsByChild/:childId", authenticate, requireChild, getNotificationsByChild);
router.put("/markNotificationAsRead/:id", authenticate, requireChild, markNotificationAsRead);
router.put("/updatePassword/:id", authenticate, requireChild, updatePassword);

module.exports = router;
