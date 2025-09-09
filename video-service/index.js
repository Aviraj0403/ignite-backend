// video-service/index.js
import app from './app.js';
const PORT = process.env.PORT || 5006;

app.listen(PORT, () => {
  console.log(`🎥 Video Service running on port ${PORT}`);
});
