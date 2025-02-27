import express from "express";
import utilsController from "../controllers/utils";

const router = express.Router()

//Número de inferências total
router.get("/vision/get/countInferences", utilsController.totalVisionImages)
//Número de modelos executados individualmente
router.get("/vision/get/countModels", utilsController.totalVisionInferences)
//Número de benchmarks executados para cada modelo neural
router.get("/vision/get/countBenchmarking", utilsController.totalVisionInferencesByModel)

export default router