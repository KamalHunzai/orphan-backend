const express = require("express");
const createComment = require("../controllers/Comments/createComment");
const getCommentsByJournal = require("../controllers/Comments/getCommentsByJournal");
const deleteComment = require("../controllers/Comments/deleteComment");
const getCommentById = require("../controllers/Comments/getCommentById");
const getCommentsByJournalforuser = require("../controllers/Comments/getCommentsByJournalforuser");
const router = express.Router();

router.post("/add", createComment);
router.get("/getbyjournal/:journalId", getCommentsByJournal);
router.delete("/delete/:id", deleteComment);
router.get("/getbyId/:id", getCommentById);
router.get("/user/:journalId", getCommentsByJournalforuser);
module.exports = router;
