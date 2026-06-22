const mongoose = require('mongoose');

const hsCodeSchema = new mongoose.Schema({
  code:        { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category:    { type: String, required: true },
  keywords:    [{ type: String }]
});

hsCodeSchema.index({ description: 'text', keywords: 'text' });

module.exports = mongoose.model('HSCode', hsCodeSchema);
