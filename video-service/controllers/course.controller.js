// video-service/controllers/course.controller.js
import CourseProgress from '../models/CourseProgress.model.js';
import StandaloneCourse from '../models/StandaloneCourse.model.js';
// import generateCertificate from '../utils/generateCertificate.js'; // if needed

export const markProgress = async (req, res) => {
  const { userId, courseId, watchedSeconds } = req.body;

  const course = await StandaloneCourse.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  const percent = (watchedSeconds / course.duration) * 100;

  let progress = await CourseProgress.findOne({ userId, courseId });
  if (!progress) {
    progress = await CourseProgress.create({
      userId,
      courseId,
      watchedSeconds,
      isCompleted: percent >= 80,
    });
  } else {
    progress.watchedSeconds = watchedSeconds;
    if (percent >= 80) progress.isCompleted = true;
    await progress.save();
  }

  res.json({ message: 'Progress updated', isCompleted: progress.isCompleted });
};
