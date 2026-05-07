const express = require("express");
const router = express.Router();

const { authenticate, requireSuperAdmin } = require("../middlewares/auth");
const { authLimiter } = require("../middlewares/rateLimiter");

const createSuperAdmin = require("../controllers/superAdmin/createSuperAdmin");
const signinSuperAdmin = require("../controllers/superAdmin/signinSuperAdmin");
const getDashboardCountsByCountry = require("../controllers/superAdmin/getDashboardCounts");
const updateSuperAdmin = require("../controllers/superAdmin/updateSuperAdmin");
const getSuperAdminById = require("../controllers/superAdmin/getById");
const getAdminsAndManagers = require("../controllers/superAdmin/getAdminsAndManagers");
const deleteSuperAdmin = require("../controllers/superAdmin/deleteSuperAdmin");

// Public
router.post("/create", createSuperAdmin);
router.post("/signin", authLimiter, signinSuperAdmin);

// SuperAdmin protected
router.put("/update/:id", authenticate, requireSuperAdmin, updateSuperAdmin);
router.get("/getbyid/:id", authenticate, requireSuperAdmin, getSuperAdminById);
router.get("/getDashboardCounts", authenticate, requireSuperAdmin, getDashboardCountsByCountry);
router.get("/getAdminsAndManagers", authenticate, requireSuperAdmin, getAdminsAndManagers);
router.delete("/delete/:id", authenticate, requireSuperAdmin, deleteSuperAdmin);

module.exports = router;
