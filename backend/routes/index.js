const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented in subsequent phases
// Phase 1: POST /api/market-demand
// Phase 2: POST /api/classify
// Phase 3: POST /api/compliance-check
// Phase 4: POST /api/translate
// Phase 6: POST /api/auth/signup, /api/auth/login

router.get('/', (req, res) => {
  res.json({
    message: 'Safarika API v0.1.0',
    endpoints: {
      health: 'GET /api/health',
      phases_todo: [
        'Phase 1: Market Demand Intelligence',
        'Phase 2: HS Code Classification',
        'Phase 3: Compliance Rule Engine',
        'Phase 4: Multilingual Translation',
        'Phase 5: Mobile Integration',
        'Phase 6: Authentication & Error Handling',
        'Phase 7: Deployment',
        'Phase 8: Benchmarking & Thesis'
      ]
    }
  });
});

module.exports = router;
