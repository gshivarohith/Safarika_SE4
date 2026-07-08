const express = require('express');
const router  = express.Router();
const { classifyProduct } = require('../services/hsCodeService');
const { logActivity } = require('../services/activityService');

router.post('/', async (req, res) => {
  const { productDescription, userEmail, userName } = req.body;

  if (!productDescription || !productDescription.trim()) {
    return res.status(400).json({ error: 'Please enter a product description' });
  }

  try {
    const result = await classifyProduct(productDescription.trim());

    // Log this activity for Admin via the Service
    await logActivity(
      userEmail || 'Guest',
      userName || 'Guest',
      'Product Classification',
      `Searched: "${productDescription}" -> Result: ${result.hsCode}`
    );

    res.json(result);
  } catch (err) {
    console.error('❌ [API] Classification Error:', err.message);
    res.status(500).json({
      error: 'System Busy',
      details: err.message
    });
  }
});

module.exports = router;
