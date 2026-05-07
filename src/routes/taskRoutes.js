const express = require("express");
const router = express.Router();

const { authenticate, requireAdmin, requireAdminOrSuperAdmin } = require("../middlewares/auth");

const createTask = require("../controllers/task/createTask");
const getAllTasks = require("../controllers/task/getAllTasks");
const getTaskById = require("../controllers/task/getTaskById");
const getTasksByChildId = require("../controllers/task/getTaskByChild");
const deleteTask = require("../controllers/task/deleteTask");
const countTasksByTypeWithCountry = require("../controllers/task/countTasksByTypeWithCountry");
const getTasksByAdminId = require("../controllers/task/getTasksByAdminId");

router.post("/create", authenticate, requireAdminOrSuperAdmin, createTask);
router.get("/alltasks", authenticate, requireAdmin, getAllTasks);
router.get("/singletasks/:taskId", authenticate, requireAdmin, getTaskById);
router.get("/child/:childId", authenticate, requireAdmin, getTasksByChildId);
router.delete("/delete/:id", authenticate, requireAdmin, deleteTask);
router.get("/count-Tasks-ByType", authenticate, requireAdmin, countTasksByTypeWithCountry);
router.get("/getTasksByAdminId/:adminId", authenticate, requireAdmin, getTasksByAdminId);

module.exports = router;
