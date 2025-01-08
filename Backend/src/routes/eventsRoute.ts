import { Router } from "express";
import { addEventEndpoint, deleteEventEndpoint, getEventsEndpoint } from "../controllers/handleEventController";

const router = Router();

router.get("/get", getEventsEndpoint )
router.post("/add", addEventEndpoint )
router.delete("/:id", deleteEventEndpoint )

export default router; 