const express = require("express");
const router = express.Router();

const { authenticate, requireAdmin, requireAdminOrSuperAdmin } = require("../middlewares/auth");

const createVisitReport = require("../controllers/visitreport/createVisitReport");
const getAllVisitReports = require("../controllers/visitreport/getAllVisitRoports");
const getVisitReportById = require("../controllers/visitreport/getSingleVisitReport");
const getVisitReportByChildId = require("../controllers/visitreport/getVisitReportsByChild");
const getLatestVisitReportsByChild = require("../controllers/visitreport/VisitReport");
const getVisitReportsByAdminId = require("../controllers/visitreport/getVisitReportsByAdminId.js");
const getUrgentVisitReports = require("../controllers/visitreport/getUrgentVisitReports.js");
const getVisitReportsByChildId = require("../controllers/visitreport/getVisitReportByChildId.js");
const deleteVisitReport = require("../controllers/visitreport/deleteVisitReport.js");

router.post("/create", authenticate, requireAdmin, createVisitReport);
router.get("/getall", authenticate, requireAdmin, getAllVisitReports);
router.get("/single/:id", authenticate, requireAdmin, getVisitReportById);
router.get("/child/:childId", authenticate, requireAdmin, getVisitReportByChildId);
router.get("/getLatestVisit/:childId", authenticate, requireAdmin, getLatestVisitReportsByChild);
router.get("/getByAdminId/:adminId", authenticate, requireAdmin, getVisitReportsByAdminId);
router.get("/getUrgentVisitReports", authenticate, requireAdminOrSuperAdmin, getUrgentVisitReports);
router.get("/getVisitReportsByChildId/:childId", authenticate, requireAdmin, getVisitReportsByChildId);
router.delete("/delete/:id", authenticate, requireAdmin, deleteVisitReport);

module.exports = router;
