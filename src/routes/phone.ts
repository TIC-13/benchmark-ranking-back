import express from "express";
import phoneController from "../controllers/phone";

const router = express.Router()

router.get("/phone", phoneController.getAllPhones)
router.post("/phone", phoneController.createPhone)

export default router