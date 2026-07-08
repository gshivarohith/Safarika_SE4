const express = require('express');
const router = express.Router();
const { fetchMarketDemand } = require('../services/comtradeService');
const { logActivity } = require('../services/activityService');

// Map of common UN codes to names to guarantee UI quality
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
  const { hsCode, userEmail, userName } = req.body;
  if (!hsCode) return res.status(400).json({ error: 'hsCode is required' });

  try {
    console.log(`📊 Generating Intelligence Report for: ${hsCode}`);
    const result = await fetchMarketDemand(hsCode);
    const raw = result.data?.data || [];

    // Clean and Normalize: Identify specific countries and their trade values
    const cleanRecords = raw.map(item => {
      // Resolve Name: Prioritize specific map, then API description
      let name = COUNTRY_NAME_MAP[String(item.reporterCode)] || item.reporterDesc || item.reporterName;
      const value = item.primaryValue || item.tradeValue || 0;

      // Filter out generic totals like 'World' or empty names
      if (!name || name.toLowerCase().includes('world') || value <= 0) return null;

      // Clean names like "United States of America" -> "United States"
      name = name.split(',')[0].split('(')[0].trim();

      return { name, value };
    }).filter(r => r !== null);

    // Limit to TOP 5 biggest markets for maximum speed
    const top5 = cleanRecords.sort((a, b) => b.value - a.value).slice(0, 5);

    // Log activity for Admin in Real-Time
    await logActivity(
      userEmail || 'Guest',
      userName || 'Guest',
      'Market Demand Check',
      `HS Code: ${hsCode} | Top Market: ${top5[0]?.name || 'N/A'}`
    );

    res.json({
      hsCode,
      records: top5,
      period: '2023',
      source: result.source
    });
  } catch (err) {
    console.error('Market Demand Error:', err.message);
    res.status(500).json({ error: 'Database link busy. Please try again.' });
  }
});

module.exports = router;
