const express = require("express");
const router = express.Router();

const { authenticate, requireAdmin, requireAdminOrSuperAdmin } = require("../middlewares/auth");
const upload = require("../middlewares/Upload");

const addLearningMaterial = require("../controllers/LearningMaterials/addLearningMaterials");
const getAllLearningMaterials = require("../controllers/LearningMaterials/getAllLearningMaterials");
const getLearningMaterialById = require("../controllers/LearningMaterials/getMaterialById");
const getLearningMaterialsByAdminId = require("../controllers/LearningMaterials/getLearningMaterialsByAdminId");
const getLearningMaterialsByCountry = require("../controllers/LearningMaterials/getLearningMaterialsByCountry");
const getLearningMaterialsByTag = require("../controllers/LearningMaterials/getLearningMaterialsByTag");
const deleteLearningMaterial = require("../controllers/LearningMaterials/deleteLearningMaterial");

router.post("/add", authenticate, requireAdminOrSuperAdmin, upload.single("file"), addLearningMaterial);
router.get("/all", authenticate, requireAdminOrSuperAdmin, getAllLearningMaterials);
router.get("/single/:id", authenticate, requireAdminOrSuperAdmin, getLearningMaterialById);
router.get("/getByAdminId/:adminId", authenticate, requireAdmin, getLearningMaterialsByAdminId);
router.get("/get-by-country", authenticate, requireAdminOrSuperAdmin, getLearningMaterialsByCountry);
router.get("/getLearningMaterialsByTag", authenticate, requireAdminOrSuperAdmin, getLearningMaterialsByTag);
router.delete("/delete/:id", authenticate, requireAdmin, deleteLearningMaterial);

module.exports = router;
