import express from 'express';
import { checkAddToken, removeToken } from '../controllers/notfyController';
import { verifyToken } from '../middleware/midlleware';

const router = express.Router();

router.post('/check-add-token', checkAddToken) // use in app
router.post('/remove-token' ,removeToken) // use in app
export default router;