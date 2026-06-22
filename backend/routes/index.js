const express = require('express');
const router = express.Router();

router.use('/market-demand', require('./marketDemand'));

// Phase 2: POST /api/classify
// Phase 3: POST /api/compliance-check
// Phase 4: POST /api/translate
// Phase 6: POST /api/auth/signup, /api/auth/login

router.get('/', (req, res) => {
  res.json({
    message: 'Safarika API v0.1.0',
    endpoints: {
      health: 'GET /api/health',
      marketDemand: 'POST /api/market-demand',
      phases_todo: [
        'Phase 2: HS Code Classification',
        'Phase 3: Compliance Rule Engine',
        'Phase 4: Multilingual Translation (Gemini)',
        'Phase 5: Mobile Integration',
        'Phase 6: Authentication & Error Handling',
        'Phase 7: Deployment',
        'Phase 8: Benchmarking & Thesis'
      ]
    }
  });
});

module.exports = router;
