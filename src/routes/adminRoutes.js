const express = require("express");
const router = express.Router();

// Upload (multer-S3 instance)
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

// Signup & Login
router.post("/add", signup);
router.post("/signin", signin);

// Update Admin (with S3 upload)
router.put("/update/:id", upload.single("profilePicture"), updateAdmin);

// Basic Getters
router.get("/getbyid/:id", getAdminById);
router.get("/getDashboardStats/:adminId", getDashboardStatsByAdmin);

// Lists & Filtering
router.get("/get-MentorsBy-Country", getMentorsByCountry);
router.get("/get-by-country", getMentorsList);
router.get("/get-by-id/:id", getAdminsById);
router.get("/get-Mentor-Activity-count/:country", getMentorActivityByCountry);

// Delete Admin
router.delete("/deleteAdminById/:id", deleteAdminById);

// Update without file upload
router.put("/updateAdmin/:id", updateAdminProfile);

// Notifications
router.get("/getAllNotifications", getAllNotifications);

// OTP / Password Reset
router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/resetPassword", resetPassword);

module.exports = router;
