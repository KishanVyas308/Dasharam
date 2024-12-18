import express from "express";
import { addAttendance, checkAttendance, updateAttendance } from "../controllers/attadanceController";

const router = express.Router();

router.post("/add", addAttendance);
router.get("/check", checkAttendance);
router.put("/update", updateAttendance);

export default router;