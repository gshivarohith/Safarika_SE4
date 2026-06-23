const mongoose = require('mongoose');

const complianceRuleSchema = new mongoose.Schema({
  hsChapter:           { type: String, required: true, unique: true },
  chapterDescription:  { type: String, required: true },
  documentsRequired:   [{ type: String }],
  prohibitedCountries: [{ type: String }],
  notes:               { type: String, default: '' }
});

module.exports = mongoose.model('ComplianceRule', complianceRuleSchema);
