/**
 * ProductLens AI — Google Gemini API Integration Service
 * ══════════════════════════════════════════════════════
 * Provides real LLM-powered product intelligence using Google's Gemini API.
 * Handles API key management, prompt engineering, structured output parsing,
 * rate limiting, and graceful fallback to heuristic engine.
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-2.0-flash';

let _apiKey = '';
let _enabled = false;
let _requestCount = 0;
let _lastRequestTime = 0;
const MIN_REQUEST_INTERVAL_MS = 200; // Rate limit: max 5 req/sec

/**
 * Configure the Gemini service.
 */
export function configureGemini(apiKey, enabled = true) {
  _apiKey = apiKey?.trim() || '';
  _enabled = enabled && _apiKey.length > 0;
  return { configured: _enabled, keyLength: _apiKey.length };
}

export function isGeminiEnabled() {
  return _enabled && _apiKey.length > 0;
}

export function getGeminiStats() {
  return { enabled: _enabled, requestCount: _requestCount, hasKey: _apiKey.length > 0 };
}

/**
 * Call Gemini API with a prompt and return the text response.
 */
async function callGemini(prompt, options = {}) {
  if (!_enabled || !_apiKey) {
    throw new Error('Gemini API not configured');
  }

  // Rate limiting
  const now = Date.now();
  const elapsed = now - _lastRequestTime;
  if (elapsed < MIN_REQUEST_INTERVAL_MS) {
    await new Promise(r => setTimeout(r, MIN_REQUEST_INTERVAL_MS - elapsed));
  }

  const model = options.model || DEFAULT_MODEL;
  const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${_apiKey}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: options.temperature ?? 0.2,
      maxOutputTokens: options.maxTokens ?? 2048,
      topP: 0.8,
      topK: 40,
    },
  };

  _lastRequestTime = Date.now();
  _requestCount++;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const errMsg = errData?.error?.message || `HTTP ${response.status}`;
    throw new Error(`Gemini API Error: ${errMsg}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text.trim();
}

/**
 * Parse JSON from Gemini response (handles markdown code blocks).
 */
function parseJSON(text) {
  // Strip markdown code block if present
  let clean = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  try {
    return JSON.parse(clean);
  } catch {
    // Try to extract JSON object/array
    const objMatch = clean.match(/\{[\s\S]*\}/);
    if (objMatch) {
      try { return JSON.parse(objMatch[0]); } catch {}
    }
    const arrMatch = clean.match(/\[[\s\S]*\]/);
    if (arrMatch) {
      try { return JSON.parse(arrMatch[0]); } catch {}
    }
    return null;
  }
}

// ═══════════════════════════════════════════════
// AI-POWERED ENRICHMENT FUNCTIONS
// ═══════════════════════════════════════════════

/**
 * Extract specifications from raw product text using Gemini.
 */
export async function aiExtractSpecifications(rawText) {
  const prompt = `You are an industrial product specification extraction engine. Analyze the following raw product description and extract ALL technical specifications into structured key-value pairs.

RAW INPUT:
"${rawText}"

Extract these categories of specifications (only include what's found):
- Material (body/housing material)
- Voltage (operating voltage, AC/DC)
- Amperage (current rating)
- Horsepower (motor power)
- Pressure Rating (max working pressure)
- Temperature Rating (max operating temp)
- Port Size (connection size)
- Flow Rate (GPM, LPM, GPD)
- Speed/RPM
- Electrical Phases (1-phase, 3-phase)
- Poles (for breakers)
- Frequency (Hz)
- Bore Diameter (for bearings)
- Outside Diameter
- Width
- Seal Type
- Clearance Class
- Dynamic Load Rating
- Enclosure Rating (IP/NEMA)
- Mounting Type
- End Connection Type
- Body Style
- Actuator Type
- Operating Mode
- Communication Protocol
- Switch Type
- Any other technical specs found

Return ONLY a JSON object with specification names as keys and extracted values as values. Example:
{"Material": "316 Stainless Steel", "Voltage": "24VDC", "Pressure Rating": "150 PSI"}`;

  try {
    const response = await callGemini(prompt, { temperature: 0.1 });
    const parsed = parseJSON(response);
    if (parsed && typeof parsed === 'object') {
      return { specs: parsed, source: 'GEMINI_AI', raw: response };
    }
  } catch (err) {
    console.warn('Gemini spec extraction failed:', err.message);
  }
  return null;
}

/**
 * Classify a product into UNSPSC taxonomy using Gemini.
 */
export async function aiClassifyUNSPSC(rawText, extractedSpecs) {
  const specsStr = extractedSpecs ? Object.entries(extractedSpecs).map(([k,v]) => `${k}: ${v}`).join(', ') : 'None extracted';
  
  const prompt = `You are a UNSPSC (United Nations Standard Products and Services Code) classification expert for industrial products. Classify the following product into the correct UNSPSC taxonomy.

PRODUCT DESCRIPTION:
"${rawText}"

EXTRACTED SPECS: ${specsStr}

Respond with ONLY a JSON object containing:
{
  "code": "8-digit UNSPSC code (e.g., 40141602)",
  "title": "Product type name (e.g., Solenoid Valves)",
  "category": "Full category path using > separator (e.g., Industrial Valves & Fluid Control > Solenoid Valves)",
  "segment": "UNSPSC Segment with code (e.g., Industrial Manufacturing Machinery (40000000))",
  "family": "UNSPSC Family with code",
  "class": "UNSPSC Class with code",
  "confidence": 85,
  "reasoning": "Brief explanation of classification logic"
}`;

  try {
    const response = await callGemini(prompt, { temperature: 0.1 });
    const parsed = parseJSON(response);
    if (parsed && parsed.code) {
      return { taxonomy: parsed, source: 'GEMINI_AI', raw: response };
    }
  } catch (err) {
    console.warn('Gemini UNSPSC classification failed:', err.message);
  }
  return null;
}

/**
 * Generate a standardized e-commerce title using Gemini.
 */
export async function aiGenerateTitle(rawText, brand, mpn, specs, taxonomy) {
  const prompt = `You are an e-commerce product title optimization expert for industrial products. Generate a standardized, SEO-optimized product title.

RAW INPUT: "${rawText}"
BRAND: ${brand || 'Unknown'}
MPN: ${mpn || 'Unknown'}
KEY SPECS: ${specs ? Object.entries(specs).map(([k,v]) => `${k}: ${v}`).join(', ') : 'None'}
PRODUCT TYPE: ${taxonomy?.title || 'Industrial Product'}

Rules:
- Format: Brand [MPN] ProductType, Material, KeySpec1, KeySpec2
- Include the most important 3-4 specifications
- Keep under 120 characters
- Professional, not promotional
- Include units where applicable

Return ONLY the title string, nothing else.`;

  try {
    const response = await callGemini(prompt, { temperature: 0.3, maxTokens: 256 });
    if (response && response.length > 10) {
      return response.replace(/^["']|["']$/g, '').trim();
    }
  } catch (err) {
    console.warn('Gemini title generation failed:', err.message);
  }
  return null;
}

/**
 * Generate short and long descriptions using Gemini.
 */
export async function aiGenerateDescriptions(rawText, brand, mpn, specs, taxonomy) {
  const prompt = `You are an industrial e-commerce content writer. Generate both a short description and a long description for this product.

RAW INPUT: "${rawText}"
BRAND: ${brand || 'Unknown'}
MPN: ${mpn || 'Unknown'}
SPECS: ${specs ? JSON.stringify(specs) : '{}'}
CATEGORY: ${taxonomy?.category || 'Industrial Product'}
UNSPSC: ${taxonomy?.code || 'N/A'}

Return ONLY a JSON object:
{
  "short_description": "A 1-2 sentence, keyword-rich description. 150-250 chars. Include MPN, material, key spec. Professional tone.",
  "long_description": "A detailed 3-5 paragraph HTML description. Include <h3> headings, <ul> lists for specs, <table> for parameters. Professional industrial tone. Include all extracted specifications, applications, and standards compliance."
}`;

  try {
    const response = await callGemini(prompt, { temperature: 0.3, maxTokens: 2048 });
    const parsed = parseJSON(response);
    if (parsed && parsed.short_description) {
      return parsed;
    }
  } catch (err) {
    console.warn('Gemini description generation failed:', err.message);
  }
  return null;
}

/**
 * Run AI quality assessment on an enriched product.
 */
export async function aiQualityAssessment(record) {
  const prompt = `You are a product data quality auditor for an industrial e-commerce catalog. Assess the quality of this enriched product record.

PRODUCT RECORD:
- Product ID: ${record.Product_ID}
- MPN: ${record.MPN}
- Brand: ${record.Brand_Name}
- Title: ${record.Product_Title}
- Short Desc: ${record.Short_Description?.substring(0, 200)}
- Category: ${record.Category_Path}
- UNSPSC: ${record.UNSPSC_Code}
- Specs: ${record.Primary_Specifications}

Assess on these criteria (score each 0-100):
1. Title completeness and formatting
2. Specification richness
3. Taxonomy accuracy
4. Description quality
5. Data consistency (do specs match title/description?)

Return ONLY a JSON object:
{
  "overall_score": 87,
  "title_score": 90,
  "spec_score": 85,
  "taxonomy_score": 92,
  "description_score": 80,
  "consistency_score": 88,
  "issues": ["List of specific issues found"],
  "suggestions": ["List of improvement suggestions"]
}`;

  try {
    const response = await callGemini(prompt, { temperature: 0.2, maxTokens: 1024 });
    const parsed = parseJSON(response);
    if (parsed && parsed.overall_score) {
      return parsed;
    }
  } catch (err) {
    console.warn('Gemini quality assessment failed:', err.message);
  }
  return null;
}

/**
 * Full AI enrichment pipeline — orchestrates all AI calls for a single product.
 */
export async function aiEnrichProduct(item) {
  if (!isGeminiEnabled()) return null;

  const rawText = item.raw_input || '';
  const results = {
    specs: null,
    taxonomy: null,
    title: null,
    descriptions: null,
    source: 'GEMINI_AI',
    stagesCompleted: [],
    errors: [],
  };

  // Stage 1: Extract specs
  try {
    const specResult = await aiExtractSpecifications(rawText);
    if (specResult) {
      results.specs = specResult.specs;
      results.stagesCompleted.push('SPEC_EXTRACTION');
    }
  } catch (e) { results.errors.push(`Spec extraction: ${e.message}`); }

  // Stage 2: Classify UNSPSC
  try {
    const taxResult = await aiClassifyUNSPSC(rawText, results.specs);
    if (taxResult) {
      results.taxonomy = taxResult.taxonomy;
      results.stagesCompleted.push('UNSPSC_CLASSIFICATION');
    }
  } catch (e) { results.errors.push(`UNSPSC: ${e.message}`); }

  // Stage 3: Generate title
  try {
    const title = await aiGenerateTitle(rawText, item.brand, item.mpn, results.specs, results.taxonomy);
    if (title) {
      results.title = title;
      results.stagesCompleted.push('TITLE_GENERATION');
    }
  } catch (e) { results.errors.push(`Title: ${e.message}`); }

  // Stage 4: Generate descriptions
  try {
    const descs = await aiGenerateDescriptions(rawText, item.brand, item.mpn, results.specs, results.taxonomy);
    if (descs) {
      results.descriptions = descs;
      results.stagesCompleted.push('DESCRIPTION_GENERATION');
    }
  } catch (e) { results.errors.push(`Descriptions: ${e.message}`); }

  return results;
}
