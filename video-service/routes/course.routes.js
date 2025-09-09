// video-service/routes/course.routes.js
import express from 'express';
import { markProgress } from '../controllers/course.controller.js';

const router = express.Router();

router.post('/progress', markProgress);

export default router;
