import express from "express";
import llmInferenceController from "../controllers/llmInference";

const router = express.Router()

router.get("/", llmInferenceController.getAllLLMInferences)
router.post("/", llmInferenceController.createLLMInference)
router.get("/ranking", llmInferenceController.getRanking)
router.get("/models", llmInferenceController.getLLMModels)
router.get("/get/count", llmInferenceController.totalInferences)

export default router