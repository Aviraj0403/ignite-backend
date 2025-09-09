// controllers/enrollmentController.js
// Assumptions:
// - Authentication middleware is in place (e.g., req.user from JWT, where req.user._id is User ID).
// - Student is fetched via userId.
// - For standalone courses, we assume courses with 'youtubeVideoId' present are standalone (video-based).
// - Add courseType to Course if needed for better distinction: courseSchema.add({ courseType: { type: String, enum: ['regular', 'standalone'], default: 'regular' } });
// - Error handling is basic; enhance with try-catch and custom errors.
// - Install uuid if not present.

import Enrollment from "../models/enrollment.model.js";
import Student from "../models/student.model.js"; // Assuming path
import Course from "../models/course.model.js"; // Assuming path
import { generateCertificatePDF } from "../utils/generateCertificate.js";

export const enrollInCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id; // From auth middleware

  try {
    const student = await Student.findOne({ userId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ studentId: student._id, courseId });
    if (existingEnrollment) return res.status(400).json({ message: "Already enrolled" });

    const enrollment = new Enrollment({ studentId: student._id, courseId });
    await enrollment.save();

    res.status(201).json({ message: "Enrolled successfully", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const completeCourse = async (req, res) => {
  const { enrollmentId } = req.params; // Or pass courseId and find enrollment
  const userId = req.user._id;

  try {
    const student = await Student.findOne({ userId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment || enrollment.studentId.toString() !== student._id.toString()) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (enrollment.completed) return res.status(400).json({ message: "Course already completed" });

    const course = await Course.findById(enrollment.courseId);
    if (!course.youtubeVideoId) {
      return res.status(403).json({ message: "This course does not support auto-completion via video watch" });
    }

    // Mark as completed
    enrollment.completed = true;

    // Generate certificate
    const { url, code } = await generateCertificatePDF(student, course);
    enrollment.certificateUrl = url;
    enrollment.certificateCode = code;
    enrollment.certificateGenerated = true;

    await enrollment.save();

    res.status(200).json({ message: "Course completed and certificate generated", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCertificate = async (req, res) => {
  const { enrollmentId } = req.params;
  const userId = req.user._id;

  try {
    const student = await Student.findOne({ userId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const enrollment = await Enrollment.findById(enrollmentId).populate("courseId");
    if (!enrollment || enrollment.studentId.toString() !== student._id.toString()) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (!enrollment.certificateGenerated) {
      return res.status(400).json({ message: "Certificate not generated yet" });
    }

    res.status(200).json({
      certificateUrl: enrollment.certificateUrl,
      certificateCode: enrollment.certificateCode,
      courseName: enrollment.courseId.name,
      completionDate: enrollment.completedAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getStudentEnrollments = async (req, res) => {
  const userId = req.user._id;

  try {
    const student = await Student.findOne({ userId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const enrollments = await Enrollment.find({ studentId: student._id }).populate("courseId", "name code youtubeVideoId");

    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};