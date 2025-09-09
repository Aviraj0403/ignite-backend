// models/enrollment.model.js
import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  enrolledAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  certificateGenerated: { type: Boolean, default: false },
  certificateUrl: { type: String },
  certificateCode: { type: String, unique: true },
});

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true }); // Prevent duplicate enrollments

enrollmentSchema.pre("save", function (next) {
  if (this.isModified("completed") && this.completed && !this.completedAt) {
    this.completedAt = Date.now();
  }
  next();
});

const Enrollment = mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;