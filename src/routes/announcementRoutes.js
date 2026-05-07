const express = require("express");
const router = express.Router();

const { authenticate, requireAdmin, requireAdminOrSuperAdmin } = require("../middlewares/auth");

const addAnnouncement = require("../controllers/announcement/addannouncement");
const getAnnouncements = require("../controllers/announcement/getAnnouncements");
const getAnnouncementById = require("../controllers/announcement/getAnnouncementById");
const updateAnnouncement = require("../controllers/announcement/updateAnnouncement");
const deleteAnnouncement = require("../controllers/announcement/deleteAnnouncement");
const getAnnouncementsByAdminId = require("../controllers/announcement/getAnnouncementsByAdminId");

router.post("/add", authenticate, requireAdminOrSuperAdmin, addAnnouncement);
router.get("/all", authenticate, requireAdminOrSuperAdmin, getAnnouncements);
router.get("/getbyId/:id", authenticate, requireAdminOrSuperAdmin, getAnnouncementById);
router.put("/update/:id", authenticate, requireAdmin, updateAnnouncement);
router.delete("/delete/:id", authenticate, requireAdmin, deleteAnnouncement);
router.get("/getbyadminId/:superadminId", authenticate, requireAdminOrSuperAdmin, getAnnouncementsByAdminId);

module.exports = router;
