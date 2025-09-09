// routes/enrollmentRoutes.js
// Assuming Express router
import express from "express";
import { enrollInCourse, completeCourse, getCertificate, getStudentEnrollments } from "../controllers/enrollmentController.js";
import authMiddleware from "../middleware/auth.js"; // Assume you have auth middleware to verify JWT and set req.user

const router = express.Router();

router.use(authMiddleware); // Protect all routes

router.post("/enroll", enrollInCourse);
router.put("/complete/:enrollmentId", completeCourse); // Frontend calls this when YouTube video ends (use YouTube IFrame API on frontend to detect)
router.get("/certificate/:enrollmentId", getCertificate);
router.get("/enrollments", getStudentEnrollments);

export default router;