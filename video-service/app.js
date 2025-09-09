// video-service/app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import courseRoutes from './routes/course.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('📦 MongoDB connected for Video Service'));

app.use('/api/standalone-courses', courseRoutes);

export default app;
