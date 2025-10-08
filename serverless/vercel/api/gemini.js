// Vercel Serverless Function to call Gemini securely (Node.js)
// Save this under api/ in a Vercel project (this file path assumes monorepo under serverless/vercel/)
// Set an environment variable GEMINI_API_KEY in Vercel project settings.

export default async function handler(req, res) {
  // Basic CORS for local testing; adjust origins for production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { countryName, currentGDPUSD, model = 'gemini-2.5-flash', thisYear = 2024, targetYear = 2050 } = req.body || {};

    if (!countryName || typeof currentGDPUSD !== 'number') {
      return res.status(400).json({ error: 'Invalid payload' });
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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const raw = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'Upstream error', details: raw });
    }

    const text = raw?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Try to return parsed JSON directly
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }
    if (!parsed) {
      return res.status(502).json({ error: 'Model returned non-JSON content' });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
