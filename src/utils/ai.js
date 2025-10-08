// Gemini (Google Generative Language) integration via serverless proxy ONLY.
// Set VITE_GEMINI_PROXY_URL in your frontend .env.

const DEFAULT_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';
const DEFAULT_THIS_YEAR = 2024;
const DEFAULT_TARGET_YEAR = 2050;

function buildSystemPrompt(thisYear, targetYear) {
  return `You are an economics assistant tasked with projecting nominal GDP for a country.
Return strictly valid JSON only. No markdown, no leading or trailing text.
The JSON schema must be:
{
  "projections": [ { "year": number, "gdp": number } ],
  "rationale": string,
  "risks": string,
  "recommendations": string
}
Rules:
- Start at year ${thisYear} and include all years up to ${targetYear}, inclusive.
- Each GDP value is the country's projected nominal GDP in BILLION USD for that year.
- The first value (year ${thisYear}) should be very close to the provided current GDP value.
- Consider macro factors: demographics, productivity, investment, inflation, fiscal/monetary policy, geopolitics, climate risk, tech adoption, energy transitions, trade, institutional quality.
- Avoid extreme outliers unless strongly justified.
- Keep narrative concise (<= 120 words each for rationale, risks, recommendations).`;
}

function buildGeminiBody(countryName, currentGDPUSD, thisYear, targetYear) {
  const systemPrompt = buildSystemPrompt(thisYear, targetYear);
  const userPrompt = { countryName, currentGDPUSD };
  return {
    contents: [
      {
        role: 'user',
        parts: [
          { text: systemPrompt },
          { text: `Input: ${JSON.stringify(userPrompt)}` },
          { text: 'Output the JSON now.' }
        ]
      }
    ]
  };
}

function parseGeminiJson(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) parsed = JSON.parse(match[0]);
  }
  if (!parsed) throw new Error('Failed to parse AI response as JSON');
  return parsed;
}

function normalizeResponse(parsed, thisYear, targetYear) {
  if (!Array.isArray(parsed.projections)) {
    throw new Error('AI response missing projections array');
  }
  const projections = parsed.projections
    .filter(p => typeof p.year === 'number' && typeof p.gdp === 'number')
    .sort((a, b) => a.year - b.year)
    .filter(p => p.year >= thisYear && p.year <= targetYear);

  return {
    projections,
    rationale: parsed.rationale || '',
    risks: parsed.risks || '',
    recommendations: parsed.recommendations || ''
  };
}

async function callGeminiViaProxy(proxyUrl, payload) {
  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Proxy error: ${res.status} ${errText}`);
  }
  return res.json();
}

export async function getGDPProjectionWithSummary({ countryName, currentGDPUSD, thisYear = DEFAULT_THIS_YEAR, targetYear = DEFAULT_TARGET_YEAR }) {
  const proxyUrl = import.meta.env.VITE_GEMINI_PROXY_URL;
  const model = (import.meta.env.VITE_GEMINI_MODEL || DEFAULT_MODEL).trim();

  if (!proxyUrl) {
    throw new Error('VITE_GEMINI_PROXY_URL is not set. Configure your Vercel (or other) proxy and set the URL in .env.');
  }

  const parsed = await callGeminiViaProxy(proxyUrl, { countryName, currentGDPUSD, model, thisYear, targetYear });
  return normalizeResponse(parsed, thisYear, targetYear);
}
