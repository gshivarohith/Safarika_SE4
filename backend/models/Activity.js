const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userEmail: { type: String, default: 'Guest' },
  userName: { type: String, default: 'Guest' },
  action: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
