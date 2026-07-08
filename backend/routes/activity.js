const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');

/**
 * @route   GET /api/activity
 * @desc    Fetch all user activities for Admin Dashboard
 */
router.get('/', async (req, res) => {
  try {
    console.log('[Admin] Fetching activity logs...');
    const activities = await Activity.find().sort({ timestamp: -1 }).limit(100);
    res.json(activities);
  } catch (err) {
    console.error('Error fetching activities:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * @route   POST /api/activity/log
 * @desc    Manually log an activity (e.g. Admin Login)
 */
router.post('/log', async (req, res) => {
  try {
    const { userEmail, userName, action, details } = req.body;
    const newActivity = new Activity({
      userEmail: userEmail || 'Guest',
      userName: userName || 'Guest',
      action,
      details
    });
    await newActivity.save();
    res.status(201).json({ message: 'Activity logged' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
