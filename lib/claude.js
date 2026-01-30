const Anthropic = require('@anthropic-ai/sdk');

let client = null;
let inFlight = 0;
const MAX_CONCURRENT = 3;
const REQUEST_TIMEOUT = 30000;

// Global daily generation cap
const DAILY_CAP = parseInt(process.env.DAILY_GENERATION_CAP || '2000', 10);
let dailyCount = 0;
let dailyResetDate = new Date().toDateString();

function checkDailyCap() {
  const today = new Date().toDateString();
  if (today !== dailyResetDate) {
    dailyCount = 0;
    dailyResetDate = today;
  }
  return dailyCount < DAILY_CAP;
}

function getClient() {
  if (!client) {
    client = new Anthropic.default({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }
  return client;
}

async function generate(systemPrompt, userPrompt, retries = 2) {
  // Check kill switch
  if (process.env.DISABLE_GENERATION === 'true') {
    throw new Error('Generation is disabled');
  }

  // Daily cap
  if (!checkDailyCap()) {
    throw new Error('Daily generation limit reached');
  }

  // Concurrency cap
  if (inFlight >= MAX_CONCURRENT) {
    throw new Error('Too many generation requests in progress');
  }

  inFlight++;
  dailyCount++;
  try {
    return await _generate(systemPrompt, userPrompt, retries);
  } finally {
    inFlight--;
  }
}

async function _generate(systemPrompt, userPrompt, retries) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await getClient().messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
        ]
      }, { signal: controller.signal });

      clearTimeout(timeout);

      const text = response.content[0].text;

      // Try to extract JSON from response
      let jsonStr = text;

      // If wrapped in markdown code block, extract it
      const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1];
      }

      // Parse JSON
      const parsed = JSON.parse(jsonStr);
      return parsed;

    } catch (error) {
      console.error(`Generation attempt ${attempt + 1} failed:`, error.message);
      if (attempt === retries) {
        throw error;
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

module.exports = { generate };
