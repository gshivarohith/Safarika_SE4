const axios = require('axios');
const TradeData = require('../models/TradeData');

const BASE_URL = 'https://comtradeapi.un.org/data/v1/get/C/A/HS';
const CACHE_TTL_DAYS = 7;

// Top importing country codes (USA, UAE, UK, Germany, China)
const DEFAULT_REPORTERS = '842,784,826,276,156';
const REPORTER_NAMES = {
  842: 'United States',
  784: 'United Arab Emirates',
  826: 'United Kingdom',
  276: 'Germany',
  156: 'China',
};

function withReporterNames(data) {
  if (!data?.data?.length) return data;
  return {
    ...data,
    data: data.data
      .filter((record) => REPORTER_NAMES[record.reporterCode])
      .map((record) => ({
        ...record,
        reporterDesc: REPORTER_NAMES[record.reporterCode],
      })),
  };
}

async function fetchMarketDemand(hsCode, period) {
  const cleanCode = hsCode.replace(/\./g, '');
  const year = period || (new Date().getFullYear() - 1).toString();
  const cacheKey = `${cleanCode}-${year}-W3`;

  // Check valid cache first
  const cached = await TradeData.findOne({
    cacheKey,
    expiresAt: { $gt: new Date() }
  });

  if (cached) {
    return {
      source: 'cache',
      data: cached.data,
      fetchedAt: cached.fetchedAt
    };
  }

  let response;
  let data;

  // Retry Comtrade API up to 3 times
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      response = await axios.get(BASE_URL, {
        params: {
          cmdCode: cleanCode,
          period: year,
          flowCode: 'M',
          reporterCode: DEFAULT_REPORTERS,
          partnerCode: 0,
          partner2Code: 0,
          motCode: 0,
          customsCode: 'C00',
          maxRecords: 50,
          'subscription-key': process.env.COMTRADE_API_KEY
        },
        timeout: 10000
      });

      data = withReporterNames(response.data);
      break;

    } catch (err) {

      console.error(`Comtrade attempt ${attempt} failed:`, err.message);

      if (attempt === 3) {

        // Use expired cache if available
        const oldCache = await TradeData.findOne({ cacheKey });

        if (oldCache) {
          console.log('Using expired cache as fallback');

          return {
            source: 'expired-cache',
            data: oldCache.data,
            fetchedAt: oldCache.fetchedAt,
            fallback: true
          };
        }

        throw new Error(
          'Comtrade service is temporarily unavailable. Please try again later.'
        );
      }

      // Wait 1 second before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Save fresh data to cache
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + CACHE_TTL_DAYS);

  await TradeData.findOneAndUpdate(
    { cacheKey },
    {
      cacheKey,
      hsCode: cleanCode,
      period: year,
      data,
      fetchedAt: new Date(),
      expiresAt
    },
    {
      upsert: true,
      new: true
    }
  );

  return {
    source: 'api',
    data,
    fetchedAt: new Date()
  };
}

module.exports = {
  fetchMarketDemand
};
