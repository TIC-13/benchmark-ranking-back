import express from "express";
import reportController from "../controllers/report";

const router = express.Router()

router.post("/", reportController.createReport) 

export default router