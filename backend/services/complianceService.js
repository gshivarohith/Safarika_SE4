const { GoogleGenerativeAI } = require('@google/generative-ai');
const ComplianceRule = require('../models/ComplianceRule');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function checkCompliance(hsCode, destinationCountry) {
  // Ensure we have a string and handle padding for single digits
  let codeStr = hsCode ? hsCode.toString().trim() : '';

  // If user types '5', make it '05'. If they type '50', keep it '50'.
  const hsChapter = codeStr.length === 1 ? `0${codeStr}` : codeStr.slice(0, 2);

  console.log(`🔍 Searching compliance for Chapter: ${hsChapter}`);

  const rule = await ComplianceRule.findOne({ hsChapter });

  if (!rule) {
    return {
      hsChapter,
      found: false,
      chapterDescription: 'No specific records in database',
      explanation: `We don't have specific rules for Chapter ${hsChapter} in our database yet. However, all Indian exports require a valid IEC (Import Export Code) and GST/LUT registration.`
    };
  }

  const countryWarning = destinationCountry && rule.prohibitedCountries
    .map(c => c.toLowerCase())
    .includes(destinationCountry.toLowerCase())
    ? `WARNING: ${destinationCountry} is a restricted destination for this category.`
    : null;

  const prompt = `Explain export rules for: ${rule.chapterDescription}. Documents: ${rule.documentsRequired.join(', ')}. ${rule.notes || ''}. ${countryWarning || ''}`;

  let explanation = null;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    explanation = result.response.text().trim();
  } catch (err) {
    explanation = rule.notes || 'Contact DGFT for detailed export guidelines on this category.';
  }

  return {
    hsChapter,
    found: true,
    chapterDescription: rule.chapterDescription,
    documentsRequired: rule.documentsRequired,
    prohibitedCountries: rule.prohibitedCountries,
    destinationCountry: destinationCountry || null,
    restricted: !!countryWarning,
    explanation
  };
}

module.exports = { checkCompliance };
