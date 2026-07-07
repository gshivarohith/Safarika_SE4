const express = require('express');
const router  = express.Router();
const { classifyProduct } = require('../services/hsCodeService');

router.post('/', async (req, res) => {
  const { productDescription } = req.body;

  if (!productDescription || !productDescription.trim()) {
    return res.status(400).json({ error: 'Please enter a product description' });
  }

  console.log(`[API] Received classification request for: "${productDescription}"`);

  try {
    const result = await classifyProduct(productDescription.trim());
    console.log(`[API] Successfully classified as: ${result.hsCode}`);
    res.json(result);
  } catch (err) {
    console.error('❌ [API] Classification Error:', err.message);

    // Send a friendly error with technical details in 'details'
    res.status(500).json({
      error: 'System Busy',
      details: err.message,
      hint: 'Make sure MongoDB is running and you have run "node scripts/seedHSCodes.js"'
    });
  }
});

// Simple GET endpoint to test connectivity
router.get('/test', (req, res) => {
  res.json({ message: 'Classification route is reachable' });
});

module.exports = router;
