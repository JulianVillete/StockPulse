const express = require('express');
const axios = require('axios');
const router = express.Router();

const ALPHA_VANTAGE_API_KEY = 'F83JJ8M93FB6GF22';
const BASE_URL = 'https://www.alphavantage.co/query';

// Test route to verify stocks router is working
router.get('/test', (req, res) => {
  console.log('🧪 Stocks router test endpoint hit');
  res.json({ 
    status: 'OK', 
    message: 'Stocks router is working',
    timestamp: new Date().toISOString()
  });
});

// Helper function to make Alpha Vantage API calls
const fetchFromAlphaVantage = async (params) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        ...params,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Alpha Vantage API error:', error.message);
    throw new Error('Failed to fetch stock data');
  }
};

// Get real-time stock quote
router.get('/quote/:symbol', async (req, res) => {
  console.log(`📈 Stock quote request for: ${req.params.symbol}`);
  try {
    const { symbol } = req.params;
    
    const data = await fetchFromAlphaVantage({
      function: 'GLOBAL_QUOTE',
      symbol: symbol.toUpperCase()
    });

    if (data['Error Message']) {
      return res.status(400).json({ error: 'Invalid symbol' });
    }

    if (data['Note']) {
      return res.status(429).json({ error: 'API call frequency exceeded' });
    }

    const quote = data['Global Quote'];
    if (!quote) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    const stockData = {
      symbol: quote['01. symbol'],
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      price: parseFloat(quote['05. price']),
      volume: parseInt(quote['06. volume']),
      latestTradingDay: quote['07. latest trading day'],
      previousClose: parseFloat(quote['08. previous close']),
      change: parseFloat(quote['09. change']),
      changePercent: quote['10. change percent']
    };

    res.json(stockData);
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Get intraday stock data for charts
router.get('/intraday/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = '5min' } = req.query;
    
    const data = await fetchFromAlphaVantage({
      function: 'TIME_SERIES_INTRADAY',
      symbol: symbol.toUpperCase(),
      interval: interval
    });

    if (data['Error Message']) {
      return res.status(400).json({ error: 'Invalid symbol' });
    }

    if (data['Note']) {
      return res.status(429).json({ error: 'API call frequency exceeded' });
    }

    const timeSeries = data[`Time Series (${interval})`];
    if (!timeSeries) {
      return res.status(404).json({ error: 'No intraday data found' });
    }

    // Convert to array format for Chart.js
    const chartData = Object.entries(timeSeries)
      .slice(0, 100) // Limit to last 100 data points
      .map(([timestamp, values]) => ({
        timestamp,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      }))
      .reverse(); // Sort chronologically

    res.json({
      symbol: symbol.toUpperCase(),
      interval,
      data: chartData
    });
  } catch (error) {
    console.error('Error fetching intraday data:', error);
    res.status(500).json({ error: 'Failed to fetch intraday data' });
  }
});

// Get daily stock data for historical charts
router.get('/daily/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const data = await fetchFromAlphaVantage({
      function: 'TIME_SERIES_DAILY',
      symbol: symbol.toUpperCase()
    });

    if (data['Error Message']) {
      return res.status(400).json({ error: 'Invalid symbol' });
    }

    if (data['Note']) {
      return res.status(429).json({ error: 'API call frequency exceeded' });
    }

    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries) {
      return res.status(404).json({ error: 'No daily data found' });
    }

    // Convert to array format for Chart.js (last 30 days)
    const chartData = Object.entries(timeSeries)
      .slice(0, 30)
      .map(([date, values]) => ({
        date,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume'])
      }))
      .reverse(); // Sort chronologically

    res.json({
      symbol: symbol.toUpperCase(),
      data: chartData
    });
  } catch (error) {
    console.error('Error fetching daily data:', error);
    res.status(500).json({ error: 'Failed to fetch daily data' });
  }
});

module.exports = router;
