const Activity = require('../models/Activity');

/**
 * Logs a user action to MongoDB for the Admin Dashboard.
 */
const logActivity = async (userEmail, userName, action, details) => {
  try {
    const newActivity = new Activity({
      userEmail: userEmail || 'Guest',
      userName: userName || 'Guest',
      action,
      details: String(details)
    });
    await newActivity.save();
    console.log(`[REAL-TIME LOG] ${action} by ${userEmail || 'Guest'}`);
  } catch (err) {
    console.error('Logging System Error:', err.message);
  }
};

module.exports = { logActivity };
