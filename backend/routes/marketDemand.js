const express = require('express');
const router = express.Router();
const { fetchMarketDemand } = require('../services/comtradeService');

// Map of UN codes to names to ensure specific labels in the UI
const COUNTRY_NAME_MAP = {
  '842': 'United States',
  '784': 'United Arab Emirates',
  '826': 'United Kingdom',
  '276': 'Germany',
  '156': 'China',
  '250': 'France',
  '392': 'Japan',
  '528': 'Netherlands',
  '484': 'Mexico'
};

router.post('/', async (req, res) => {
  const { hsCode } = req.body;
  if (!hsCode) return res.status(400).json({ error: 'hsCode is required' });

  try {
    console.log(`📊 Compiling Fast-Market Report for: ${hsCode}`);
    const result = await fetchMarketDemand(hsCode);

    // The raw data from UN Comtrade is in result.data.data
    const raw = result.data?.data || [];

    // Clean and Normalize names
    const cleanRecords = raw.map(item => {
      // Prioritize: 1. Our map, 2. reporterDesc (e.g. "USA"), 3. reporterName
      let name = COUNTRY_NAME_MAP[String(item.reporterCode)] || item.reporterDesc || item.reporterName || item.text;
      const value = item.primaryValue || item.tradeValue || 0;

      // Filter out generic "World" entries and zero values
      if (!name || name.toLowerCase().includes('world') || value <= 0) return null;

      // Clean text like "United States of America" -> "United States"
      name = name.split(',')[0].split('(')[0].trim();

      return { name, value };
    }).filter(r => r !== null);

    // Sort by largest and limit to Top 5 for speed and clarity
    const top5 = cleanRecords.sort((a, b) => b.value - a.value).slice(0, 5);

    res.json({
      hsCode,
      records: top5,
      period: '2023',
      isDemo: result.source === 'demo'
    });
  } catch (err) {
    console.error('Market Demand Route Error:', err.message);
    res.status(500).json({ error: 'Trade database busy. Please try again.' });
  }
});

module.exports = router;
