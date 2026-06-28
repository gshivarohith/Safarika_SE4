const axios = require('axios');
const TradeData = require('../models/TradeData');

const BASE_URL = 'https://comtradeapi.un.org/data/v1/get/C/A/HS';
const CACHE_TTL_DAYS = 7;

// Top importing country codes to query (USA, UAE, UK, Germany, China)
const DEFAULT_REPORTERS = '842,784,826,276,156';

async function fetchMarketDemand(hsCode, period) {
  const cleanCode = hsCode.replace(/\./g, '');
  const year = period || (new Date().getFullYear() - 1).toString();
  const cacheKey = `${cleanCode}-${year}`;

  const cached = await TradeData.findOne({
    cacheKey,
    expiresAt: { $gt: new Date() }
  });

  if (cached) {
    return { source: 'cache', data: cached.data, fetchedAt: cached.fetchedAt };
  }

  const response = await axios.get(BASE_URL, {
    params: {
      cmdCode: cleanCode,
      period: year,
      flowCode: 'M',
      reporterCode: DEFAULT_REPORTERS,
      maxRecords: 50,
      'subscription-key': process.env.COMTRADE_API_KEY
    },
    timeout: 10000
  });

  const data = response.data;
  if (data?.data?.length > 0) console.log('Comtrade sample record keys:', Object.keys(data.data[0]));

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + CACHE_TTL_DAYS);

  await TradeData.findOneAndUpdate(
    { cacheKey },
    { cacheKey, hsCode: cleanCode, period: year, data, fetchedAt: new Date(), expiresAt },
    { upsert: true, new: true }
  );

  return { source: 'api', data, fetchedAt: new Date() };
}

module.exports = { fetchMarketDemand };
