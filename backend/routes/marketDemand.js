const express = require('express');
const router = express.Router();
const { fetchMarketDemand } = require('../services/comtradeService');

router.post('/', async (req, res) => {
  const { hsCode, period } = req.body;

  if (!hsCode) {
    return res.status(400).json({ error: 'hsCode is required' });
  }

  try {
    const result = await fetchMarketDemand(hsCode, period);

    // Filter and clean the UN Comtrade data for the mobile app
    const cleanData = (result.data?.data || []).map(item => ({
      reporterName: item.reporterName,
      tradeValue: item.primaryValue || item.tradeValue || 0,
      year: item.period
    }));

    res.json({
      hsCode,
      period: period || (new Date().getFullYear() - 1).toString(),
      source: result.source,
      data: cleanData
    });
  } catch (err) {
    console.error('Market Demand Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch market data', details: err.message });
  }
});

module.exports = router;
