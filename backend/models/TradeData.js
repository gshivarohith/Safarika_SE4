const mongoose = require('mongoose');

const tradeDataSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true },
  hsCode:   { type: String, required: true },
  period:   { type: String, required: true },
  data:     { type: mongoose.Schema.Types.Mixed, required: true },
  fetchedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

tradeDataSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TradeData', tradeDataSchema);
