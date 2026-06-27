const express = require('express');
const router = express.Router();
const { translateText, SUPPORTED_LANGUAGES } = require('../services/translationService');

router.post('/', async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }
  if (!targetLanguage) {
    return res.status(400).json({ error: 'targetLanguage is required', supported: SUPPORTED_LANGUAGES });
  }

  try {
    const result = await translateText(text, targetLanguage);
    res.json(result);
  } catch (err) {
    console.error('translate error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
