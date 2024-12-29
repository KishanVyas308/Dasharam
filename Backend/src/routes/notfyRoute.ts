import express from 'express';
import { checkAddToken } from '../controllers/notfyController';

const router = express.Router();

router.post('/check-add-token', checkAddToken)

export default router;