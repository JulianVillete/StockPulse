// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://YOUR_RENDER_URL.onrender.com'  // Replace with your actual Render URL
  : 'http://localhost:5000';  // Local development

export default API_BASE_URL;
