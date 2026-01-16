require('dotenv').config({ override: true });

const express = require('express');
const path = require('path');
const db = require('./lib/db');
const claude = require('./lib/claude');
const prompts = require('./lib/prompts');
const { validatePrompt } = require('./lib/validate');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes

// Get random prompt (stumble)
app.get('/api/stumble', async (req, res) => {
  try {
    const prompt = db.getRandom();
    if (!prompt) {
      return res.status(404).json({ error: 'No prompts available. Run npm run seed first.' });
    }
    res.json(prompt);
  } catch (error) {
    console.error('Stumble error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get prompt by slug
app.get('/api/prompt/:slug', async (req, res) => {
  try {
    const prompt = db.getBySlug(req.params.slug);
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    res.json(prompt);
  } catch (error) {
    console.error('Get prompt error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Resolve prompt by name (for Top 8 clicks) - find existing or generate
app.post('/api/prompt/resolve', async (req, res) => {
  try {
    const { name, vibe } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Try to find existing prompt
    const existing = db.getByName(name);
    if (existing) {
      return res.json(existing);
    }

    // Generate new prompt
    const promptTemplate = prompts.TOP8_RESOLVE_PROMPT
      .replace('{{NAME}}', name)
      .replace('{{VIBE}}', vibe || '');

    const generated = await claude.generate('', promptTemplate);
    const validated = validatePrompt(generated, 'top8', null);
    const slug = db.insertPrompt(validated);

    res.json({ ...validated, slug });
  } catch (error) {
    console.error('Resolve error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate from metaphor
app.post('/api/generate/metaphor', async (req, res) => {
  try {
    const { metaphor, parentId } = req.body;
    if (!metaphor) {
      return res.status(400).json({ error: 'Metaphor text is required' });
    }

    const promptTemplate = prompts.METAPHOR_TRANSFORM_PROMPT
      .replace('{{METAPHOR_TEXT}}', metaphor);

    const generated = await claude.generate('', promptTemplate);
    const validated = validatePrompt(generated, 'metaphor', parentId);
    const slug = db.insertPrompt(validated);

    res.json({ ...validated, slug });
  } catch (error) {
    console.error('Metaphor generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve index.html for all other routes (SPA-style)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize database and start server
async function start() {
  await db.init();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`PromptSpace running at http://localhost:${port}`);
    console.log(`Database has ${db.getCount()} prompts`);
  });
}

start().catch(console.error);
