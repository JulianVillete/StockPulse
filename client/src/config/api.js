// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://stockpulse-backend-5nhn.onrender.com'  // Your Render backend URL
  : 'http://localhost:5000';  // Local development

export default API_BASE_URL;
