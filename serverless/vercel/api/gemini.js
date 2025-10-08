// Vercel Serverless Function to call Gemini securely (Node.js, ESM)
// Save this under api/ in a Vercel project (this file path assumes monorepo under serverless/vercel/)
// Set an environment variable GEMINI_API_KEY in Vercel project settings.

async function handler(req, res) {
  // CORS: allow only the specified production frontend
  const ALLOWED_ORIGIN = 'https://gdp-projections.netlify.app';
  const origin = req.headers?.origin || '';
  const isAllowed = origin === ALLOWED_ORIGIN;
  res.setHeader('Vary', 'Origin');
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  console.log('[gemini] Incoming request', {
    method: req.method,
    path: req.url,
    contentType: req.headers?.['content-type'] || req.headers?.['Content-Type'],
  });
  if (req.method === 'OPTIONS') {
    // For preflight, if origin not allowed, respond 403 to signal blocked
    if (!isAllowed) return res.status(403).end();
    return res.status(204).end();
  }

  if (!isAllowed) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST with application/json.' });
  }

  try {
    // Robust body parsing: Vercel usually parses JSON body, but handle raw string just in case
    const reqBody = req.body;
    let payload;
    if (typeof reqBody === 'string') {
      try {
        payload = JSON.parse(reqBody);
      } catch (e) {
        console.warn('[gemini] Invalid JSON body received');
        return res.status(400).json({ error: 'Invalid JSON in request body' });
      }
    } else {
      payload = reqBody || {};
    }

    const { countryName, currentGDPUSD, model = 'gemini-2.5-flash', thisYear = 2024, targetYear = 2050 } = payload;
    console.log('[gemini] Parsed payload', { countryName, currentGDPUSD, model, thisYear, targetYear });

    if (!countryName || typeof currentGDPUSD !== 'number') {
      return res.status(400).json({ error: 'Invalid payload', details: { countryName, currentGDPUSD } });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not set on server' });
    }

    const systemPrompt = `You are an economics assistant tasked with projecting nominal GDP for a country.\n` +
      `Return strictly valid JSON only. No markdown, no leading or trailing text.\n` +
      `The JSON schema must be:\n` +
      `{"projections":[{"year":number,"gdp":number}],"rationale":string,"risks":string,"recommendations":string}\n` +
      `Rules:\n` +
      `- Start at year ${thisYear} and include all years up to ${targetYear}, inclusive.\n` +
      `- Each GDP value is the country's projected nominal GDP in BILLION USD for that year.\n` +
      `- The first value (year ${thisYear}) should be very close to the provided current GDP value.\n` +
      `- Consider macro factors: demographics, productivity, investment, inflation, fiscal/monetary policy, geopolitics, climate risk, tech adoption, energy transitions, trade, institutional quality.\n` +
      `- Avoid extreme outliers unless strongly justified.\n` +
      `- Keep narrative concise (<= 120 words each for rationale, risks, recommendations).`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            { text: `Input: ${JSON.stringify({ countryName, currentGDPUSD })}` },
            { text: 'Output the JSON now.' }
          ]
        }
      ]
    };

    const base = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const url = `${base}?key=${apiKey}`;
    console.log('[gemini] Upstream request', { endpoint: base, model });
    let upstream;
    try {
      upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
      });
    } catch (err) {
      console.error('Fetch to Gemini failed:', err);
      return res.status(502).json({ error: 'Failed to reach Gemini API', details: String(err) });
    }

    const rawRespText = await upstream.text();
    console.log('[gemini] Upstream response status', upstream.status);
    console.log('[gemini] Upstream response body (first 600 chars)', rawRespText.slice(0, 600));
    let upstreamJson;
    try {
      upstreamJson = JSON.parse(rawRespText);
    } catch {
      upstreamJson = { text: rawRespText };
    }
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'Upstream error', details: upstreamJson });
    }

    const text = upstreamJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('[gemini] Candidate text snippet (first 300 chars)', text.slice(0, 300));

    // Try to return parsed JSON directly
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }
    if (!parsed) {
      console.warn('[gemini] Model returned non-JSON content; cannot parse');
      return res.status(502).json({ error: 'Model returned non-JSON content' });
    }

    console.log('[gemini] Success: returning parsed JSON with', {
      projections: Array.isArray(parsed.projections) ? parsed.projections.length : 0,
      hasRationale: Boolean(parsed.rationale),
      hasRisks: Boolean(parsed.risks),
      hasRecommendations: Boolean(parsed.recommendations),
    });
    return res.status(200).json(parsed);
  } catch (err) {
    console.error('Unhandled server error:', err);
    return res.status(500).json({ error: 'Internal server error', details: String(err) });
  }
}

export default handler;
