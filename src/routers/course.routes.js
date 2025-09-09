import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
  updateCourse
} from '../controllers/course.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
const router = express.Router();

// Create a new course
import upload from '../middlewares/upload.js';  // your multer middleware

// For creating course with image upload
router.post('/createCourse', upload.single('image'), createCourse);

// For updating course with image upload
router.put('/updateCourse/:courseId', verifyToken, upload.single('image'), updateCourse);
// Get all courses
router.get('/getAllCourses', getAllCourses);

// Get a single course by ID
router.get('/getCourseById/:courseId', getCourseById);


// Delete a course
router.delete('/deleteCourse/:courseId', deleteCourse);

export default router;
