const express = require("express");
const addAnnouncement = require("../controllers/announcement/addannouncement");
const getAnnouncements = require("../controllers/announcement/getAnnouncements");
const getAnnouncementById = require("../controllers/announcement/getAnnouncementById");
const updateAnnouncement = require("../controllers/announcement/updateAnnouncement");
const deleteAnnouncement = require("../controllers/announcement/deleteAnnouncement");
const getAnnouncementsByAdminId = require("../controllers/announcement/getAnnouncementsByAdminId");
const router = express.Router();

router.post("/add", addAnnouncement);
router.get("/all", getAnnouncements);
router.get("/getbyId/:id", getAnnouncementById);
router.put("/update/:id", updateAnnouncement);
router.delete("/delete/:id", deleteAnnouncement);
router.get("/getbyadminId/:superadminId", getAnnouncementsByAdminId);

module.exports = router;
