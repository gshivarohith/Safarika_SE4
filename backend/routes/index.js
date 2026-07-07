const express = require('express');
const router = express.Router();

router.use('/auth',          require('./auth'));
router.use('/market-demand', require('./marketDemand'));
router.use('/classify',     require('./classify'));
router.use('/compliance-check', require('./compliance'));
router.use('/translate',       require('./translate'));

router.get('/', (req, res) => {
  res.json({
    message: 'Safarika API v0.2.0',
    endpoints: {
      health:          'GET /api/health',
      auth:            'POST /api/auth/register, POST /api/auth/login',
      marketDemand:    'POST /api/market-demand',
      classify:        'POST /api/classify',
      complianceCheck: 'POST /api/compliance-check',
      translate:       'POST /api/translate'
    }
  });
});

module.exports = router;
