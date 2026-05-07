const express = require("express");
const router = express.Router();

const { authenticate, requireAdmin, requireAdminOrSuperAdmin } = require("../middlewares/auth");

const getAllVisitPlanning = require("../controllers/VisitPlanning/getAllVisitPlanning");
const createVisitPlanning = require("../controllers/VisitPlanning/createVisitPlanning");
const getVisitPlanningById = require("../controllers/VisitPlanning/getVisitById");
const getVisitPlanningByChildId = require("../controllers/VisitPlanning/getVisitPlanningByChild");
const getUpcomingVisits = require("../controllers/VisitPlanning/getUpcommingVisits");
const getVisitStatistics = require("../controllers/VisitPlanning/visitStatistics");
const getVisitPlanningByAdmin = require("../controllers/VisitPlanning/getVisitPlanningByAdmin");
const getUpcomingVisitsByChild = require("../controllers/VisitPlanning/getUpcomingVisitsByChild");

router.post("/create", authenticate, requireAdminOrSuperAdmin, createVisitPlanning);
router.get("/all", authenticate, requireAdmin, getAllVisitPlanning);
router.get("/single/:id", authenticate, requireAdmin, getVisitPlanningById);
router.get("/child/:childId", authenticate, requireAdmin, getVisitPlanningByChildId);
router.get("/upcoming", authenticate, requireAdmin, getUpcomingVisits);
router.get("/visit-statistics", authenticate, requireAdminOrSuperAdmin, getVisitStatistics);
router.get("/admin/:adminId", authenticate, requireAdmin, getVisitPlanningByAdmin);
router.get("/getUpcomingVisitsByChild/:childId", authenticate, requireAdmin, getUpcomingVisitsByChild);

module.exports = router;
