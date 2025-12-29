const express = require("express");
const router = express.Router();

const createTask = require("../controllers/task/createTask");
const getAllTasks = require("../controllers/task/getAllTasks");
const getTaskById = require("../controllers/task/getTaskById");
const getTasksByChildId = require("../controllers/task/getTaskByChild");
const deleteTask = require("../controllers/task/deleteTask");
const countTasksByTypeWithCountry = require("../controllers/task/countTasksByTypeWithCountry");
const getTasksByAdminId = require("../controllers/task/getTasksByAdminId");

router.post("/create", createTask);
router.get("/alltasks", getAllTasks); // Get all tasks
router.get("/singletasks/:taskId", getTaskById); // Get task by ID
router.get("/child/:childId", getTasksByChildId);
router.delete("/delete/:id", deleteTask);
router.get("/count-Tasks-ByType", countTasksByTypeWithCountry);
router.get("/getTasksByAdminId/:adminId", getTasksByAdminId);

module.exports = router;
