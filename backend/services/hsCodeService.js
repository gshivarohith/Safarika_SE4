const { GoogleGenerativeAI } = require('@google/generative-ai');
const HSCode = require('../models/HSCode');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function classifyProduct(productDescription) {
  // 1. Search MongoDB for candidate HS codes via full-text search
  let candidates = await HSCode.find(
    { $text: { $search: productDescription } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(10);

  // Fallback: if text search returns nothing, sample broadly
  if (candidates.length === 0) {
    candidates = await HSCode.find({}).limit(15);
  }

  // 2. Build shortlist for Gemini — never let it invent codes
  const shortlist = candidates.map(c => `${c.code} — ${c.description}`).join('\n');

  const prompt = `You are an HS code classification assistant. You must ONLY choose from the shortlist below — never invent or suggest a code not in this list.

Product description: "${productDescription}"

Shortlist of HS codes to choose from:
${shortlist}

Reply in this exact JSON format (no markdown, no text outside the JSON object):
{
  "hsCode": "<copy the exact code from the shortlist, character for character>",
  "description": "<copy the exact description from the shortlist>",
  "explanation": "<one sentence explaining why this code fits the product>"
}`;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  const text   = result.response.text().trim();

  // Extract the JSON object robustly, ignoring any surrounding text or fences
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in Gemini response');
  const parsed = JSON.parse(jsonMatch[0]);

  // Validate Gemini didn't stray outside the shortlist (dot-insensitive comparison)
  const normalize = code => code.replace(/\./g, '');
  const matched = candidates.find(c => normalize(c.code) === normalize(parsed.hsCode));
  if (!matched) {
    throw new Error(`Gemini returned an HS code not in the shortlist: ${parsed.hsCode}`);
  }

  return {
    hsCode:      matched.code,
    description: matched.description,
    explanation: parsed.explanation,
    candidatesConsidered: candidates.length
  };
}

module.exports = { classifyProduct };
