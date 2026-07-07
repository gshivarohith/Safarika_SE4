const axios = require('axios');
const TradeData = require('../models/TradeData');

const BASE_URL = 'https://comtradeapi.un.org/data/v1/get/C/A/HS';
const CACHE_TTL_DAYS = 7;

// Focused list of top global importers for maximum speed
const KEY_MARKETS = '842,784,528,826,276';

const MOCK_DATA = [
  { reporterDesc: 'United States', primaryValue: 1250000000 },
  { reporterDesc: 'United Arab Emirates', primaryValue: 980000000 },
  { reporterDesc: 'Netherlands', primaryValue: 740000000 },
  { reporterDesc: 'United Kingdom', primaryValue: 620000000 },
  { reporterDesc: 'Germany', primaryValue: 510000000 }
];

async function fetchMarketDemand(hsCode, period) {
  const cleanHsCode = hsCode ? hsCode.toString().replace(/\./g, '') : '000000';
  const year = period || '2023';
  // New cache key v4 to force refresh from old "Global Market" data
  const cacheKey = `${cleanHsCode}-${year}-pro-v4`;

  try {
    const cached = await TradeData.findOne({ cacheKey, expiresAt: { $gt: new Date() } });
    if (cached) return { source: 'cache', data: cached.data };

    const apiKey = process.env.COMTRADE_API_KEY;
    if (apiKey && apiKey !== 'your_comtrade_api_key' && apiKey.length > 5) {
      try {
        const response = await axios.get(BASE_URL, {
          params: { cmdCode: cleanHsCode, period: year, flowCode: 'M', reporterCode: KEY_MARKETS, 'subscription-key': apiKey },
          timeout: 4000 // 4 seconds timeout for snappy UI
        });
        if (response.data?.data && response.data.data.length > 0) {
          await TradeData.findOneAndUpdate({ cacheKey }, {
            hsCode: cleanHsCode, period: year, data: response.data,
            expiresAt: new Date(Date.now() + 86400000 * CACHE_TTL_DAYS)
          }, { upsert: true });
          return { source: 'api', data: response.data };
        }
      } catch (apiErr) { console.warn('Trade API slow, switching to safe mode'); }
    }
  } catch (err) { console.error('DB Error:', err.message); }

  return { source: 'demo', data: { data: MOCK_DATA }, isDemo: true };
}

module.exports = { fetchMarketDemand };
