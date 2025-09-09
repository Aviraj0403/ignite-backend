// video-service/models/CourseProgress.model.js
import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  courseId: mongoose.Types.ObjectId,
  watchedSeconds: Number,
  isCompleted: { type: Boolean, default: false },
  certificateUrl: String,
});

export default mongoose.model('CourseProgress', progressSchema);
