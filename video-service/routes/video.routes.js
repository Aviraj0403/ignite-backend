// video-service/routes/course.routes.js
import express from 'express';
import { markProgress } from '../controllers/course.controller.js';

const router = express.Router();

// Define a route for the Course API
router.get('/', (req, res) => {
  res.send('microservice is running');
});

// Define a route to mark course progress
router.post('/progress', markProgress);

export default router;
