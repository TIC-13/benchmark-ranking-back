import express from "express";
import llmInferenceController from "../controllers/llmInference";

const router = express.Router()

router.get("/", llmInferenceController.getAllLLMInferences)
router.post("/", llmInferenceController.createLLMInference)

export default router