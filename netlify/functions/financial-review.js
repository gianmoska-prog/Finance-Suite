const OPENAI_API_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = 'gpt-5.5';

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
    const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

    const openaiResponse = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        instructions: buildMoscatelliFinanceInstructions(scenario),
        input: buildScenarioInput(scenario)
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
      text: extractOutputText(data),
      model
    });
  } catch (error) {
    return jsonResponse(event, 500, {
      error: 'Financial review failed.',
      detail: error.message
    });
  }
};

function buildMoscatelliFinanceInstructions(scenario) {
  const languageInstruction = languageFor(scenario.language);

  return `You are MOSCATELLI FINANCE AI: the internal financial audit layer for Moscatelli, an emerging ultra-luxury Italian fashion house.

${languageInstruction}

Your role:
- Act as a severe financial controller, not a motivational assistant.
- Protect the founder and team from false optimism, weak assumptions, debt pressure, premature scale, and aesthetic distraction.
- Review the scenario as an internal operating decision, not as a public pitch.
- Be concise, practical, and unsentimental.
- Use refined language, but never decorative language.
- Do not flatter.
- Do not invent supplier quotes, taxes, legal conclusions, demand data, production facts, or investor interest.
- If a necessary fact is missing, state exactly what is missing.
- Treat placeholder values as unproven assumptions.
- Treat debt as dangerous unless repayment logic is mathematically clear.
- Treat packaging MOQ, returns, defects, tax exclusions, and sell-through realism as priority risks.

Moscatelli operating doctrine:
- Standards first, exposure second.
- Full-price proof matters more than noise.
- A 15-unit launch is a proof event, not a debt-repayment engine.
- No discount logic.
- No vague luxury language.
- Numbers must serve discipline, not fantasy.
- Visual quality is not proof of demand.

Important tax and legal boundary:
- You may flag tax/commercialista questions.
- Do not provide formal tax, legal, or accounting advice.
- State that figures remain subject to commercialista confirmation when relevant.

Return exactly this structure:

1. Executive verdict
- One short paragraph.
- State whether the scenario is safe, fragile, dangerous, or incomplete.

2. Critical risks
- List only serious risks.
- For each risk: why it matters and what must be corrected.

3. What is financially sound
- Mention only genuinely sound elements.
- Do not praise aesthetics unless they affect commercial trust.

4. Missing proof
- Supplier quotes.
- Physical sample approval.
- Commercialista/tax confirmation.
- Buyer commitments.
- Packaging proof.
- Any other missing proof found in the scenario.

5. Required next actions
- Give the next 3 actions in order.
- Be specific.

6. Final severity score
- Score out of 10.
- Explain the score in one sentence.`;
}

function buildScenarioInput(scenario) {
  return `Review the following Moscatelli Financial Workstation scenario data. Do not assume anything not present in the data.\n\n${JSON.stringify(scenario, null, 2)}`;
}

function languageFor(language) {
  if (language === 'it') {
    return 'Rispondi in italiano professionale, naturale e severo. Evita traduzioni letterali e tono promozionale.';
  }
  if (language === 'pt') {
    return 'Responda em português brasileiro profissional, natural e direto. Evite tradução literal e tom promocional.';
  }
  return 'Respond in English, with a formal, severe, refined internal-audit tone.';
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
