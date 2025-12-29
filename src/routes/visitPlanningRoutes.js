const express = require("express");
const router = express.Router();

const getAllVisitPlanning = require("../controllers/VisitPlanning/getAllVisitPlanning");
const createVisitPlanning = require("../controllers/VisitPlanning/createVisitPlanning");
const getVisitPlanningById = require("../controllers/VisitPlanning/getVisitById");
const getVisitPlanningByChildId = require("../controllers/VisitPlanning/getVisitPlanningByChild");
const getUpcomingVisits = require("../controllers/VisitPlanning/getUpcommingVisits");
const getVisitStatistics = require("../controllers/VisitPlanning/visitStatistics");
const getVisitPlanningByAdmin = require("../controllers/VisitPlanning/getVisitPlanningByAdmin");
const getUpcomingVisitsByChild = require("../controllers/VisitPlanning/getUpcomingVisitsByChild");

router.post("/create", createVisitPlanning);
router.get("/all", getAllVisitPlanning);

router.get("/single/:id", getVisitPlanningById);
router.get("/child/:childId", getVisitPlanningByChildId);
router.get("/upcoming", getUpcomingVisits);
router.get("/visit-statistics", getVisitStatistics);
router.get("/admin/:adminId", getVisitPlanningByAdmin);
router.get("/getUpcomingVisitsByChild/:childId", getUpcomingVisitsByChild);

module.exports = router;
