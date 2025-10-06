// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://stockpulse-backend.onrender.com'  // Render backend URL
  : 'http://localhost:5000';  // Local development

export default API_BASE_URL;
