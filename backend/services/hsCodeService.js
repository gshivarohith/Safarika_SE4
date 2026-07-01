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

Reply in this exact JSON format (no markdown, no explanation outside JSON):
{
  "hsCode": "<6-digit code from shortlist>",
  "description": "<description text from shortlist>",
  "explanation": "<one sentence explaining why this code fits the product>"
}`;

  // Fix: changed model to gemini-1.5-flash (valid model name)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const text   = result.response.text().trim();

  // Strip possible markdown code fences
  const jsonText = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  const parsed   = JSON.parse(jsonText);

  // Validate Gemini didn't stray outside the shortlist
  const validCodes = candidates.map(c => c.code);
  if (!validCodes.includes(parsed.hsCode)) {
    throw new Error(`Gemini returned an HS code not in the shortlist: ${parsed.hsCode}`);
  }

  return {
    hsCode:      parsed.hsCode,
    description: parsed.description,
    explanation: parsed.explanation,
    candidatesConsidered: candidates.length
  };
}

module.exports = { classifyProduct };
