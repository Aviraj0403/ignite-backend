// video-service/app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/dbConfig.js';
import courseRoutes from './routes/video.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('📦 MongoDB connected for Video Service'));
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected for Video Service");
  })
  .catch((err) => {
    console.error("MongoDB  Video Service failed:", err);
  });
app.use('/api/standalone-courses', courseRoutes);
app.use('/', courseRoutes);

export default app;
