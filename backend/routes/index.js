const express = require('express');
const router = express.Router();

const authRouter = require('./auth');
const marketRouter = require('./marketDemand');
const classifyRouter = require('./classify');
const complianceRouter = require('./compliance');
const translateRouter = require('./translate');

router.use('/auth', authRouter);
router.use('/market-demand', marketRouter);
router.use('/classify', classifyRouter);
router.use('/compliance-check', complianceRouter);
router.use('/translate', translateRouter);

router.get('/', (req, res) => {
  res.json({ message: 'Safarika API v1.0.0 Online' });
});

module.exports = router;
