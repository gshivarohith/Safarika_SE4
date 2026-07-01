const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main API Routes
app.use('/api', require('./routes/index.js'));

// Health check specifically for mobile verification
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/safarika';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('🚀 MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`📡 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    // Start server even if DB connection fails for health checks
    app.listen(PORT, () => {
      console.log(`📡 Server running on port ${PORT} (Database connection failed)`);
    });
  });
