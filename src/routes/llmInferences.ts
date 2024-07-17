import express from "express";
import llmInferenceController from "../controllers/llmInference";

const router = express.Router()

router.get("/", llmInferenceController.getAllLLMInferences)
router.post("/", llmInferenceController.createLLMInference)
router.get("/ranking", llmInferenceController.getRanking)

export default router