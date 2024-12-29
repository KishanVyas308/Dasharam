import express from 'express';
import { checkAddToken, removeToken } from '../controllers/notfyController';

const router = express.Router();

router.post('/check-add-token', checkAddToken)
router.post('/remove-token', removeToken)

export default router;