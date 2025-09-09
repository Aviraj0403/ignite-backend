import dotenv from 'dotenv';
import connectDB from './src/config/dbConfig.js';
import app from './src/App.js';
import { startCluster } from './serviceWorker.js'; // Import startCluster

dotenv.config(); 

const port = process.env.PORT || 4000;

const startServer = () => {
  // Start the server after DB connection is successful
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

connectDB()
  .then(() => {
    console.log("✅ MongoDB Connected");

    // startCluster();

    startServer();
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });
