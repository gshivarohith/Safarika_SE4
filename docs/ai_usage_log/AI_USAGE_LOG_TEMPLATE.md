# Safarika AI Usage Log

**Purpose:** Document all LLM (ChatGPT, Gemini, Claude) prompts and responses used in Safarika development. Required for thesis appendix and institutional AI usage disclosure.

**Format:** Add an entry for each significant LLM usage (design decisions, prompt engineering, code generation, etc.)

---

## Log Entries

### Entry 1 — Phase 2: HS Code Classifier Prompt Engineering

**Date:** YYYY-MM-DD  
**Phase:** 2 — HS Code Classifier  
**Module:** `services/hsCodeService.js`  
**LLM Model:** OpenAI GPT-4o  

**Context:**
Building the structured prompt for HS code classification from free-text product descriptions.

**Prompt (Input):**
```
You are an expert in Harmonized System (HS) code classification for international trade.

Given a product description, suggest the top 3 HS codes from this reference list: [OFFICIAL_HS_CODES]

Product description: "${productDescription}"

Return ONLY valid JSON (no other text):
{
  "suggestions": [
    { "code": "XXXXXX", "description": "...", "confidence": 95 },
    ...
  ]
}
```

**Response (Output):**
```json
{
  "suggestions": [
    { "code": "6109.90", "description": "T-shirts, cotton, not knitted", "confidence": 92 },
    { "code": "6110.20", "description": "Pullovers, cardigans, cotton", "confidence": 78 },
    ...
  ]
}
```

**Rationale:**
Structured prompt with JSON schema forces deterministic output. Confidence scores enable ranking and benchmarking accuracy later.

**Usage Notes:**
- Test with 20+ sample products from Indian export categories (textiles, electronics, handicrafts)
- Benchmark confidence scores against ground truth to measure classifier accuracy

---

### Entry 2 — Phase 3: Compliance Explanation Prompt

**Date:** YYYY-MM-DD  
**Phase:** 3 — Compliance Rule Engine  
**Module:** `services/complianceService.js`  
**LLM Model:** OpenAI GPT-4o  

**Context:**
Once compliance rules are determined from static tables, use LLM to generate plain-language explanations in the user's preferred language.

**Prompt (Input):**
```
You are an export compliance expert. Explain this requirement in simple Hindi language, suitable for a small business owner:

Requirement: "${complianceRequirement}"

Keep explanation to 1-2 sentences. Do not use technical jargon.
```

**Response (Output):**
```
"आपको भारत सरकार के DGFT से RCMC (रजिस्ट्रेशन-सह-मेमोरेंडम ऑफ अंडरटेकिंग) लेना होगा। यह एक आधिकारिक दस्तावेज है जो दिखाता है कि आप निर्यात करने के लिए योग्य हैं।"
```

**Rationale:**
Keep LLM usage for explanation/summarization only. Compliance determination stays deterministic (static rules).

---

### Entry 3 — Phase 4: Bhashini Translation Validation

**Date:** YYYY-MM-DD  
**Phase:** 4 — Multilingual Integration  
**Module:** `services/bhashiniService.js`  
**Tool:** Bhashini API (Government of India)

**Context:**
Testing Bhashini API for translating HS classification results and compliance checklists into Hindi/Tamil/Marathi/Gujarati.

**Test Case:**
- **Source (English):** "Commercial Invoice: A detailed invoice showing product description, quantity, price, and payment terms. Required by: EXPORTER. Estimated time: 1 day"
- **Target Language:** Hindi
- **Bhashini Output:** "[Hindi translation from Bhashini API]"

**Validation:**
- Readability check: Can a non-English speaker understand the translated checklist?
- Accuracy check: Are trade-specific terms translated correctly?

---

### Entry 4 — Phase 5: Mobile UI Component Generation

**Date:** YYYY-MM-DD  
**Phase:** 5 — Mobile Onboarding Flow  
**Module:** `screens/ClassificationResult.js`  
**LLM Model:** Claude (for code generation)  

**Prompt (Input):**
```
Write a React Native component that displays HS code classification results. 
- Show top 3 candidates
- Display confidence score as a percentage
- Allow user to select one
- Call a callback function with selected code

Use React Native built-in components (View, Text, FlatList, TouchableOpacity).
```

**Response:** [React Native component code]

**Usage Notes:**
- Reviewed generated code for best practices
- Modified styling to match Safarika design system
- Added error handling for empty results

---

## Template for New Entries

Use this format when adding new LLM interactions:

```markdown
### Entry X — Phase Y: [Brief description]

**Date:** YYYY-MM-DD  
**Phase:** Y — [Phase name]  
**Module:** [code path]  
**LLM Model:** [GPT-4o / Gemini / Claude / Bhashini API]  

**Context:**
[Brief explanation of why LLM was used]

**Prompt (Input):**
[Full prompt text or code]

**Response (Output):**
[Full response or relevant excerpts]

**Rationale:**
[Why this approach? How does it fit into Safarika's architecture?]

**Usage Notes:**
[Any important validation, testing, or refinement details]
```

---

## Summary Stats (Update as you build)

- **Total LLM API Calls:** [Count]
- **Phases Using LLM:** 2, 3, 4, 5
- **Primary Models Used:** GPT-4o, Gemini, Claude
- **Specialized Tools:** Bhashini API (Phase 4)
- **Total Cost (Estimated):** [e.g., $150–200 for MVP]

---

## Thesis Appendix Structure

When finalizing thesis (Phase 8), reorganize this log as follows:

1. **AI Integration Overview**
   - Which phases use LLM?
   - Which components are deterministic vs. AI-assisted?

2. **Prompt Engineering Methodology**
   - Structured prompts for deterministic output (HS classifier)
   - Explanation prompts for user-facing text (compliance summaries)

3. **Benchmarking AI Accuracy**
   - HS code confidence scores vs. ground truth
   - Compliance explanation readability scores

4. **Full Log** — Append this document with all entries

---

**Last Updated:** YYYY-MM-DD  
**Next Review:** Phase 8 (finalization)
