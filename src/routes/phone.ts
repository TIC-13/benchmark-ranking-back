import express from "express";
import phoneController from "../controllers/phone";

const router = express.Router()

router.get("/", phoneController.getAllPhones)
router.get("/:id", phoneController.getPhone)
router.post("/", phoneController.createPhone)
router.get("/get/ranking", phoneController.ranking)

export default router