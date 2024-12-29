import express from 'express';
import { checkAddToken, sendNotification } from '../controllers/notfyController';

const router = express.Router();

router.post('/check-add-token', checkAddToken)
router.post('/send-notification', sendNotification)

export default router;