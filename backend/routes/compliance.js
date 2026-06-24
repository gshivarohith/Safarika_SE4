const express = require('express');
const router  = express.Router();
const { checkCompliance } = require('../services/complianceService');

router.post('/', async (req, res) => {
  const { hsCode, destinationCountry } = req.body;

  if (!hsCode) {
    return res.status(400).json({ error: 'hsCode is required' });
  }

  try {
    const result = await checkCompliance(hsCode, destinationCountry);
    res.json(result);
  } catch (err) {
    console.error('compliance-check error:', err.message);
    res.status(500).json({ error: 'Compliance check failed', details: err.message });
  }
});

module.exports = router;
