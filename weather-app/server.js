// Load environment variables from .env file (for API keys, etc.)
require('dotenv').config();

// Import required modules
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

// Create an Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5500', // Adjust to match your frontend port
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Key Validation Middleware
const validateApiKey = (req, res, next) => {
  if (!process.env.OPENWEATHER_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: API key not configured' });
  }
  next();
};

// Weather Endpoint
app.get('/api/weather', validateApiKey, async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    
    if (!city && !(lat && lon)) {
      return res.status(400).json({ error: 'Either city or lat/lon parameters required' });
    }

    const params = {
      units: 'metric',
      appid: process.env.OPENWEATHER_API_KEY,
      ...(city && { q: city }),
      ...(lat && lon && { lat, lon })
    };

    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', { params });
    res.json(response.data);
  } catch (error) {
    console.error('Weather API Error:', error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Weather data unavailable';
    res.status(status).json({ error: message });
  }
});

// Forecast Endpoint
app.get('/api/forecast', validateApiKey, async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    
    if (!city && !(lat && lon)) {
      return res.status(400).json({ error: 'Either city or lat/lon parameters required' });
    }

    const params = {
      units: 'metric',
      appid: process.env.OPENWEATHER_API_KEY,
      ...(city && { q: city }),
      ...(lat && lon && { lat, lon })
    };

    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', { params });
    res.json(response.data);
  } catch (error) {
    console.error('Forecast API Error:', error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Forecast data unavailable';
    res.status(status).json({ error: message });
  }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Endpoints:`);
  console.log(`- Weather: http://localhost:${PORT}/api/weather?city=Paris`);
  console.log(`- Forecast: http://localhost:${PORT}/api/forecast?city=Paris`);
  console.log(`- Health Check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
