const express = require("express");
const router = express.Router();

const createVisitReport = require("../controllers/visitreport/createVisitReport");
const getAllVisitReports = require("../controllers/visitreport/getAllVisitRoports");
const getVisitReportById = require("../controllers/visitreport/getSingleVisitReport");
const getVisitReportByChildId = require("../controllers/visitreport/getVisitReportsByChild");
const getLatestVisitReportsByChild = require("../controllers/visitreport/VisitReport");
const getVisitReportsByAdminId = require("../controllers/visitreport/getVisitReportsByAdminId.js");
const getUrgentVisitReports = require("../controllers/visitreport/getUrgentVisitReports.js");
const getVisitReportsByChildId = require("../controllers/visitreport/getVisitReportByChildId.js");
const deleteVisitReport = require("../controllers/visitreport/deleteVisitReport.js");

router.post("/create", createVisitReport);
router.get("/getall", getAllVisitReports);
router.get("/single/:id", getVisitReportById);
router.get("/child/:childId", getVisitReportByChildId);
router.get("/getLatestVisit/:childId", getLatestVisitReportsByChild);
router.get("/getByAdminId/:adminId", getVisitReportsByAdminId);
router.get("/getUrgentVisitReports", getUrgentVisitReports);
router.get("/getVisitReportsByChildId/:childId", getVisitReportsByChildId);
router.delete("/delete/:id", deleteVisitReport);

module.exports = router;
