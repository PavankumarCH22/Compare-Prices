import express from 'express';
import { processChat } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', processChat);

export default router;
