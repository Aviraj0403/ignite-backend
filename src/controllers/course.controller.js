// controllers/course.controller.js
import Course from '../models/Course.model.js';

import cloudinary from '../config/cloudinaryConfig.js'; // Adjust path as needed
import fs from 'fs';

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { name, code, duration, department, description } = req.body;

    const existing = await Course.findOne({ $or: [{ name }, { code }] });
    if (existing) return res.status(409).json({ message: 'Course already exists' });

    let imageUrl = '';
    if (req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'courses', // Optional: put your images in a folder
      });
      imageUrl = result.secure_url;

      // Remove the file from local uploads after upload to cloudinary
      fs.unlinkSync(req.file.path);
    }

    const course = await Course.create({ name, code, duration, department, description, image: imageUrl });
    res.status(201).json({ message: 'Course created', course });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name, code, duration, department, description } = req.body;

    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const duplicate = await Course.findOne({
      $and: [
        { _id: { $ne: courseId } },
        { $or: [{ name }, { code }] }
      ]
    });
    if (duplicate) {
      return res.status(409).json({ message: 'Another course with the same name or code already exists' });
    }

    // If image is uploaded, upload to Cloudinary and update
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'courses',
      });
      existingCourse.image = result.secure_url;

      // Remove local file
      fs.unlinkSync(req.file.path);
    }

    existingCourse.name = name ?? existingCourse.name;
    existingCourse.code = code ?? existingCourse.code;
    existingCourse.duration = duration ?? existingCourse.duration;
    existingCourse.department = department ?? existingCourse.department;
    existingCourse.description = description ?? existingCourse.description;

    await existingCourse.save();

    res.status(200).json({ message: 'Course updated', course: existingCourse });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};


// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Get one course
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.courseId);
    if (!deleted) return res.status(404).json({ message: 'Course not found' });

    res.status(200).json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};
