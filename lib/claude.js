const Anthropic = require('@anthropic-ai/sdk');

let client = null;

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

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await getClient().messages.create({
        model: 'claude-haiku-4-20250514',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
        ]
      });

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
