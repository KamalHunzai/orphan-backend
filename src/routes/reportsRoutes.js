const express = require("express");
const router = express.Router();

const { authenticate, requireAdmin, requireAdminOrSuperAdmin } = require("../middlewares/auth");

const addReport = require("../controllers/Reportss/addReport");
const getReportById = require("../controllers/Reportss/getReportById");
const updateReport = require("../controllers/Reportss/updateReport");
const deleteReport = require("../controllers/Reportss/deleteReport");
const getReportsByAdmin = require("../controllers/Reportss/getReportsByAdmin");
const getReportsByCountry = require("../controllers/Reportss/getReportsByCountry");
const getUrgentReportsByCountry = require("../controllers/Reportss/getUrgentReportsByCountry");
const countReportsByTypeAndCountry = require("../controllers/Reportss/countReportsByTypeAndCountry");
const getCountryWiseTrends = require("../controllers/Reportss/getCountryWiseTrends");
const getReportsByChildId = require("../controllers/Reportss/getReportsByChildId");

router.post("/add", authenticate, requireAdminOrSuperAdmin, addReport);
router.get("/by-Id/:id", authenticate, requireAdmin, getReportById);
router.put("/update/:id", authenticate, requireAdmin, updateReport);
router.delete("/delete/:id", authenticate, requireAdmin, deleteReport);
router.get("/get-by-admin/:adminId", authenticate, requireAdmin, getReportsByAdmin);
router.get("/getReportsByChildId/:childId", authenticate, requireAdmin, getReportsByChildId);
router.get("/get-by-country", authenticate, requireAdminOrSuperAdmin, getReportsByCountry);
router.get("/getUrgentReports", authenticate, requireAdminOrSuperAdmin, getUrgentReportsByCountry);
router.get("/count-Reports-ByType", authenticate, requireAdminOrSuperAdmin, countReportsByTypeAndCountry);
router.get("/getCountryWiseTrends", authenticate, requireAdminOrSuperAdmin, getCountryWiseTrends);

module.exports = router;
