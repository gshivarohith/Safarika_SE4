require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('express-async-errors');

const app = express();
// Force port 3000 to match the mobile app and avoid the 3001 conflict
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register API Routes
app.use('/api', require('./routes/index'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: err.message });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/safarika');
    console.log('🚀 MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`📡 Safarika backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Startup Error:', error.message);
    process.exit(1);
  }
};

startServer();
