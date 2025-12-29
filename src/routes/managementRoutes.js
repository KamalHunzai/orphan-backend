const express = require("express");
const router = express.Router();
const addManagementBySuperadmin = require("../controllers/Management/addManagementBySuperadmin");
const getManagementBySuperadmin = require("../controllers/Management/getManagementBySuperadmin");
const deleteManagementById = require("../controllers/Management/deleteManagementById");

router.post("/add", addManagementBySuperadmin);
router.get("/getBySuperadmin/:superadminId", getManagementBySuperadmin);
router.delete("/delete/:id", deleteManagementById);

module.exports = router;
