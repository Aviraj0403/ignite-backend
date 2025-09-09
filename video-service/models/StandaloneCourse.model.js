// video-service/models/StandaloneCourse.model.js
import mongoose from 'mongoose';

const standaloneCourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  youtubeVideoId: String,
  duration: Number, // in seconds
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('StandaloneCourse', standaloneCourseSchema);
