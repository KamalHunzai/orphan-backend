const express = require("express");
const router = express.Router();

const upload = require("../middlewares/Upload");

const addLearningMaterial = require("../controllers/LearningMaterials/addLearningMaterials");
const getAllLearningMaterials = require("../controllers/LearningMaterials/getAllLearningMaterials");
const getLearningMaterialById = require("../controllers/LearningMaterials/getMaterialById");
const getLearningMaterialsByAdminId = require("../controllers/LearningMaterials/getLearningMaterialsByAdminId");
const getLearningMaterialsByCountry = require("../controllers/LearningMaterials/getLearningMaterialsByCountry");
const getLearningMaterialsByTag = require("../controllers/LearningMaterials/getLearningMaterialsByTag");
const deleteLearningMaterial = require("../controllers/LearningMaterials/deleteLearningMaterial");

router.post("/add", upload.single("file"), addLearningMaterial);
router.get("/all", getAllLearningMaterials);
router.get("/single/:id", getLearningMaterialById);
router.get("/getByAdminId/:adminId", getLearningMaterialsByAdminId);
router.get("/get-by-country", getLearningMaterialsByCountry);
router.get("/getLearningMaterialsByTag", getLearningMaterialsByTag);
router.delete("/delete/:id", deleteLearningMaterial);

module.exports = router;
