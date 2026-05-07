const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth");

const createComment = require("../controllers/Comments/createComment");
const getCommentsByJournal = require("../controllers/Comments/getCommentsByJournal");
const deleteComment = require("../controllers/Comments/deleteComment");
const getCommentById = require("../controllers/Comments/getCommentById");
const getCommentsByJournalforuser = require("../controllers/Comments/getCommentsByJournalforuser");

// Both admin and child can interact with comments
router.post("/add", authenticate, createComment);
router.get("/getbyjournal/:journalId", authenticate, getCommentsByJournal);
router.delete("/delete/:id", authenticate, deleteComment);
router.get("/getbyId/:id", authenticate, getCommentById);
router.get("/user/:journalId", authenticate, getCommentsByJournalforuser);

module.exports = router;
