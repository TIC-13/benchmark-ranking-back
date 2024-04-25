import express from "express";
import inferenceController from "../controllers/inference";

const router = express.Router()

router.get("/", inferenceController.getAllInferences)
router.get("/:id", inferenceController.getInference)
router.post("/", inferenceController.createInference)
router.get("/get/models", inferenceController.getAllModels)

export default router