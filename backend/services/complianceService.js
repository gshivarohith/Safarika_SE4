const { GoogleGenerativeAI } = require('@google/generative-ai');
const ComplianceRule = require('../models/ComplianceRule');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function checkCompliance(hsCode, destinationCountry) {
  const hsChapter = hsCode.toString().slice(0, 2);

  const rule = await ComplianceRule.findOne({ hsChapter });

  if (!rule) {
    return {
      hsChapter,
      rules: null,
      explanation: `No specific compliance rules found for HS chapter ${hsChapter}. You will still need a valid IEC (Import Export Code) and GST registration for any export from India.`
    };
  }

  const countryWarning = destinationCountry && rule.prohibitedCountries
    .map(c => c.toLowerCase())
    .includes(destinationCountry.toLowerCase())
    ? `WARNING: ${destinationCountry} is a restricted destination for this product category.`
    : null;

  const prompt = `You are an export compliance advisor helping a small Indian business owner (MSME) understand what they need to export their product.

HS Chapter: ${hsChapter}, ${rule.chapterDescription}
${destinationCountry ? `Destination country: ${destinationCountry}` : ''}
Documents required: ${rule.documentsRequired.join(', ')}
${rule.notes ? `Additional notes: ${rule.notes}` : ''}
${countryWarning ? countryWarning : ''}

Write a short, friendly explanation (3-5 sentences) in simple English that:
1. Names the key documents they need
2. Mentions where to get the most important one
3. Flags any country restriction if present
Do not use bullet points. Write as a short paragraph.`;

  let explanation = null;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    explanation = result.response.text().trim();
  } catch (err) {
    console.error('Gemini unavailable, returning raw rules:', err.message);
  }

  return {
    hsChapter,
    chapterDescription: rule.chapterDescription,
    documentsRequired: rule.documentsRequired,
    prohibitedCountries: rule.prohibitedCountries,
    destinationCountry: destinationCountry || null,
    restricted: !!countryWarning,
    explanation
  };
}

module.exports = { checkCompliance };
