const express = require('express');
const router = express.Router();

router.use('/market-demand', require('./marketDemand'));
router.use('/classify',     require('./classify'));
router.use('/compliance-check', require('./compliance'));
router.use('/translate',       require('./translate'));

router.get('/', (req, res) => {
  res.json({
    message: 'Safarika API v0.1.0',
    endpoints: {
      health:          'GET /api/health',
      marketDemand:    'POST /api/market-demand',
      classify:        'POST /api/classify',
      complianceCheck: 'POST /api/compliance-check',
      translate:       'POST /api/translate'
    }
  });
});

module.exports = router;
