require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '../'))); // Serve static files from root

// Weather Endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    
    if (!process.env.OPENWEATHER_API_KEY) {
      throw new Error('API key not configured');
    }

    let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    
    if (city) url += `&q=${city}`;
    if (lat && lon) url += `&lat=${lat}&lon=${lon}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ 
      error: error.response?.data?.message || 'Weather data unavailable' 
    });
  }
});

// Forecast Endpoint
app.get('/api/forecast', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    if (!process.env.OPENWEATHER_API_KEY) {
      throw new Error('API key not configured');
    }

    let url = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    if (city) url += `&q=${city}`;
    if (lat && lon) url += `&lat=${lat}&lon=${lon}`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({
      error: error.response?.data?.message || 'Forecast data unavailable'
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Test: http://localhost:${PORT}/api/weather?city=Paris`);
});