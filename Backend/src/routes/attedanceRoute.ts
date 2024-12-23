import express from "express";
import {  addAttendanceEndpoint,  checkAttendanceEndpoint, updateAttendanceEndpoint } from "../controllers/handleAttadanceController";

const router = express.Router();

router.post('/add-for-standard', addAttendanceEndpoint);
router.post('/get-for-standard', checkAttendanceEndpoint);
router.put('/update-for-standard', updateAttendanceEndpoint);

export default router;