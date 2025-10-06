const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
// const cron = require('node-cron'); // Disabled to prevent deployment issues

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stockpulse';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('💡 To fix this:');
  console.log('1. Set up MongoDB Atlas (free): https://www.mongodb.com/atlas');
  console.log('2. Update MONGODB_URI in Render environment variables');
  console.log('3. Or install local MongoDB: https://www.mongodb.com/try/download/community');
  console.log('📝 For now, the app will work without database (watchlist won\'t persist)');
  console.log('🔄 App will continue running with in-memory storage...');
});

// Routes
console.log('Loading routes...');
const stockRoutes = require('./routes/stocks');
const watchlistRoutes = require('./routes/watchlist');

console.log('Setting up route middleware...');
app.use('/api/stocks', stockRoutes);
app.use('/api/watchlist', watchlistRoutes);
console.log('Routes configured successfully');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'StockPulse API is running' });
});

// Test endpoint to verify routes
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API routes are working',
    timestamp: new Date().toISOString(),
    routes: ['/api/stocks', '/api/watchlist', '/api/health']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Schedule price alert checks every 30 seconds (disabled for debugging)
// cron.schedule('*/30 * * * * *', () => {
//   console.log('Checking price alerts...');
//   // This will be implemented in the watchlist routes
// });
