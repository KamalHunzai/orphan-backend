const express = require("express");
const router = express.Router();

// Upload instance (multer + S3)
const upload = require("../middlewares/Upload");

const createJournal = require("../controllers/Journal/createJournal");
const getAllJournalsByChild = require("../controllers/Journal/getByChild");
const getJournalById = require("../controllers/Journal/getJournalById");
const deleteJournal = require("../controllers/Journal/deleteJournal");

// -------- JOURNAL ROUTES ----------

// Single file upload → uploadedFile (form-data)
router.post("/create", upload.single("uploadedFile"), createJournal);

router.get("/child/:childId", getAllJournalsByChild);
router.get("/single/:id", getJournalById);
router.delete("/delete/:id", deleteJournal);

module.exports = router;
