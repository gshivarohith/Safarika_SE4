const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const { fetchMarketDemand } = require('../services/comtradeService');

router.post('/', auth, async (req, res) => {
  const { hsCode, period } = req.body;

  if (!hsCode) {
    return res.status(400).json({ error: 'hsCode is required' });
  }

  try {
    const result = await fetchMarketDemand(hsCode, period);
    res.json({
      hsCode,
      period: period || (new Date().getFullYear() - 1).toString(),
      source: result.source,
      fetchedAt: result.fetchedAt,
      data: result.data
    });
  } catch (err) {
    console.error('market-demand error:', err.message);
    res.status(500).json({ error: 'Failed to fetch market data. Please try again.' });
  }
});

module.exports = router;
