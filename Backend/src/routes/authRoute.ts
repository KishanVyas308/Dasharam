import { Router } from "express";
import { login, loginStundent } from "../controllers/handleAuthController";

const router = Router();

router.post('/login', login);
router.post('/login-student', loginStundent);

export default router;