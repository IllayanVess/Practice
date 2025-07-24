require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// API Routes (keep your existing /api/weather and /api/forecast endpoints)
app.get('/api/weather', async (req, res) => { /* ... */ });
app.get('/api/forecast', async (req, res) => { /* ... */ });

// All other routes -> serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'project', 'weather.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
