const express = require("express");
const router = express.Router();

const { authenticate, requireAdmin, requireSuperAdmin } = require("../middlewares/auth");
const { authLimiter, otpLimiter } = require("../middlewares/rateLimiter");
const upload = require("../middlewares/Upload");

// Controllers
const signup = require("../controllers/admin/signup");
const signin = require("../controllers/admin/signin");
const updateAdmin = require("../controllers/admin/update");
const updateAdminProfile = require("../controllers/admin/updateadminProfile");

const getAdminById = require("../controllers/admin/getAdminProfile");
const getDashboardStatsByAdmin = require("../controllers/admin/getDashboardStats");
const getMentorsByCountry = require("../controllers/admin/getadminsByCountry");
const getMentorsList = require("../controllers/admin/getamdinsList");
const getAdminsById = require("../controllers/admin/getAdminByIdforsuperadmin");
const getMentorActivityByCountry = require("../controllers/admin/getadminActivityByCountry");

const deleteAdminById = require("../controllers/admin/deleteAdminById");

const getAllNotifications = require("../controllers/Notification/getAllNotifications");

const sendOtp = require("../controllers/admin/sendotp");
const verifyOtp = require("../controllers/admin/verifyOtp");
const resetPassword = require("../controllers/admin/resetPassword");

// ---------------- ROUTES ----------------

// Public
router.post("/add", signup);
router.post("/signin", authLimiter, signin);
router.post("/sendOtp", otpLimiter, sendOtp);
router.post("/verifyOtp", authLimiter, verifyOtp);
router.post("/resetPassword", authLimiter, resetPassword);

// Admin protected
router.put("/update/:id", authenticate, requireAdmin, upload.single("profilePicture"), updateAdmin);
router.put("/updateAdmin/:id", authenticate, requireAdmin, updateAdminProfile);
router.get("/getbyid/:id", authenticate, requireAdmin, getAdminById);
router.get("/getDashboardStats/:adminId", authenticate, requireAdmin, getDashboardStatsByAdmin);
router.get("/getAllNotifications", authenticate, requireAdmin, getAllNotifications);

// SuperAdmin protected
router.get("/get-MentorsBy-Country", authenticate, requireSuperAdmin, getMentorsByCountry);
router.get("/get-by-country", authenticate, requireSuperAdmin, getMentorsList);
router.get("/get-by-id/:id", authenticate, requireSuperAdmin, getAdminsById);
router.get("/get-Mentor-Activity-count/:country", authenticate, requireSuperAdmin, getMentorActivityByCountry);
router.delete("/deleteAdminById/:id", authenticate, requireSuperAdmin, deleteAdminById);

module.exports = router;
