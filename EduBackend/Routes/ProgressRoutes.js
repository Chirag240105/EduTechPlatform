import express from 'express'
import { protect } from '../Middlewares/AuthMiddleware.js';
import { progress } from '../Controllers/ProgressController.js';

const router = express.Router();

router.get('/get-progress', protect, progress);

export default router;