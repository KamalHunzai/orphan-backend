const express = require("express");
const router = express.Router();

const { authenticate, requireSuperAdmin } = require("../middlewares/auth");

const addManagementBySuperadmin = require("../controllers/Management/addManagementBySuperadmin");
const getManagementBySuperadmin = require("../controllers/Management/getManagementBySuperadmin");
const deleteManagementById = require("../controllers/Management/deleteManagementById");

router.post("/add", authenticate, requireSuperAdmin, addManagementBySuperadmin);
router.get("/getBySuperadmin/:superadminId", authenticate, requireSuperAdmin, getManagementBySuperadmin);
router.delete("/delete/:id", authenticate, requireSuperAdmin, deleteManagementById);

module.exports = router;
