const express = require('express');
const router = express.Router();

router.use('/market-demand', require('./marketDemand'));
router.use('/classify',     require('./classify'));
router.use('/compliance-check', require('./compliance'));

// Phase 4: POST /api/translate
// Phase 4: POST /api/translate
// Phase 6: POST /api/auth/signup, /api/auth/login

router.get('/', (req, res) => {
  res.json({
    message: 'Safarika API v0.1.0',
    endpoints: {
      health: 'GET /api/health',
      marketDemand: 'POST /api/market-demand',
      classify:     'POST /api/classify',
      phases_todo: [
        'Phase 3: Compliance Rule Engine',
        'Phase 3: POST /api/compliance-check',
        'Phase 4: POST /api/translate',
        'Phase 5: Mobile Integration',
        'Phase 6: Authentication & Error Handling',
        'Phase 7: Deployment',
        'Phase 8: Benchmarking & Thesis'
      ]
    }
  });
});

module.exports = router;
