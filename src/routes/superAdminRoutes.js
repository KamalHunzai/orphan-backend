const express = require("express");
const router = express.Router();

const createSuperAdmin = require("../controllers/superAdmin/createSuperAdmin");
const signinSuperAdmin = require("../controllers/superAdmin/signinSuperAdmin");
const getDashboardCountsByCountry = require("../controllers/superAdmin/getDashboardCounts");
const updateSuperAdmin = require("../controllers/superAdmin/updateSuperAdmin");
const getSuperAdminById = require("../controllers/superAdmin/getById");
const getAdminsAndManagers = require("../controllers/superAdmin/getAdminsAndManagers");
const deleteSuperAdmin = require("../controllers/superAdmin/deleteSuperAdmin");

router.post("/create", createSuperAdmin);
router.put("/update/:id", updateSuperAdmin);
router.post("/signin", signinSuperAdmin);
router.get("/getbyid/:id", getSuperAdminById);
router.get("/getDashboardCounts", getDashboardCountsByCountry);
router.get("/getAdminsAndManagers", getAdminsAndManagers);
router.delete("/delete/:id", deleteSuperAdmin);

module.exports = router;
