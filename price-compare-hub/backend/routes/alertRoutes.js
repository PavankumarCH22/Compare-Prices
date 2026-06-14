import express from 'express';
import { createAlert, getUserAlerts, deleteAlert } from '../controllers/alertController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createAlert).get(protect, getUserAlerts);
router.route('/:id').delete(protect, deleteAlert);

export default router;
