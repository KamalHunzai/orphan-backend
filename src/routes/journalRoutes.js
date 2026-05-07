const express = require("express");
const router = express.Router();

const { authenticate, requireAdmin, requireAdminOrSuperAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/Upload");

const createJournal = require("../controllers/Journal/createJournal");
const getAllJournalsByChild = require("../controllers/Journal/getByChild");
const getJournalById = require("../controllers/Journal/getJournalById");
const deleteJournal = require("../controllers/Journal/deleteJournal");

router.post("/create", authenticate, requireAdmin, upload.single("uploadedFile"), createJournal);
router.get("/child/:childId", authenticate, getAllJournalsByChild);
router.get("/single/:id", authenticate, getJournalById);
router.delete("/delete/:id", authenticate, requireAdmin, deleteJournal);

module.exports = router;
