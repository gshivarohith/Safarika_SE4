const express = require('express');
const router  = express.Router();
const { classifyProduct } = require('../services/hsCodeService');

router.post('/', async (req, res) => {
  const { productDescription } = req.body;

  if (!productDescription || typeof productDescription !== 'string' || !productDescription.trim()) {
    return res.status(400).json({ error: 'productDescription is required' });
  }

  try {
    const result = await classifyProduct(productDescription.trim());
    res.json(result);
  } catch (err) {
    console.error('classify error:', err.message);
    res.status(500).json({ error: 'Classification failed', details: err.message });
  }
});

module.exports = router;
