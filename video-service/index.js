// video-service/index.js
import app from './app.js';
// const PORT = process.env.video.PORT1 || 5006;
const PORT =  6002;
app.listen(PORT, () => {
  console.log(`🎥 Video Service running on port ${PORT}`);
});
