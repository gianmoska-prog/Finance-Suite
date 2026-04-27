const OPENAI_API_URL = 'https://api.openai.com/v1/responses';

exports.handler = async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(event) };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(event, 405, { error: 'Method not allowed.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonResponse(event, 500, { error: 'OPENAI_API_KEY is not configured in Netlify.' });
  }

  try {
    const scenario = JSON.parse(event.body || '{}');
    const prompt = buildFinancialReviewPrompt(scenario);

    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.5',
        input: prompt
      })
    });

    if (!openaiResponse.ok) {
      const detail = await openaiResponse.text();
      return jsonResponse(event, 502, {
        error: 'OpenAI request failed.',
        detail
      });
    }

    const data = await openaiResponse.json();
    return jsonResponse(event, 200, {
      text: extractOutputText(data)
    });
  } catch (error) {
    return jsonResponse(event, 500, {
      error: 'Financial review failed.',
      detail: error.message
    });
  }
};

function buildFinancialReviewPrompt(scenario) {
  return `You are acting as a severe financial auditor for Moscatelli, an emerging luxury fashion house.

Review this internal financial workstation scenario for:
- cash drawdown risk;
- debt pressure;
- packaging MOQ exposure;
- false optimism;
- tax exclusions;
- sell-through realism;
- launch viability;
- unclear or dangerous assumptions.

Be concise, severe, and practical. Do not flatter. Do not rewrite the business plan.

Return exactly these sections:
1. Executive verdict
2. Critical risks
3. What looks financially sound
4. What must be corrected before committing money
5. Recommended next action

Scenario data:
${JSON.stringify(scenario, null, 2)}
`;
}

function extractOutputText(data) {
  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text;
  }

  if (Array.isArray(data.output)) {
    const text = data.output
      .flatMap(item => item.content || [])
      .map(content => content.text || '')
      .filter(Boolean)
      .join('\n');

    if (text.trim()) return text;
  }

  return 'No readable response returned.';
}

function jsonResponse(event, statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders(event),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

function corsHeaders(event) {
  const requestOrigin = event.headers.origin || event.headers.Origin || '';
  const allowedOrigins = (process.env.MFW_ALLOWED_ORIGINS || '*')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

  const allowOrigin = allowedOrigins.includes('*')
    ? '*'
    : allowedOrigins.includes(requestOrigin)
      ? requestOrigin
      : allowedOrigins[0] || '*';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin'
  };
}
