const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SUPPORTED_LANGUAGES = [
  'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu', 'Odia', 'Assamese'
];

async function translateText(text, targetLanguage) {
  if (!SUPPORTED_LANGUAGES.includes(targetLanguage)) {
    throw new Error(`Unsupported language. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`);
  }

  const prompt = `Translate the following text into ${targetLanguage}. Return only the translated text, nothing else.

Text: ${text}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    return {
      originalText: text,
      translatedText: result.response.text().trim(),
      targetLanguage
    };
  } catch (err) {
    console.error('Gemini unavailable, returning original text:', err.message);
    return {
      originalText: text,
      translatedText: text,
      targetLanguage,
      fallback: true
    };
  }
}

module.exports = { translateText, SUPPORTED_LANGUAGES };
