require('dotenv').config({ override: true });

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./lib/db');
const claude = require('./lib/claude');
const prompts = require('./lib/prompts');
const { validatePrompt } = require('./lib/validate');

const app = express();

// Trust Fly.io proxy for real client IPs
app.set('trust proxy', 1);

// Security headers (CSP configured to allow inline styles for dynamic colors)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
    }
  }
}));

// Body size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Origin check for generation endpoints
function requireSameOrigin(req, res, next) {
  const origin = req.headers.origin;
  const allowedOrigin = process.env.ALLOWED_ORIGIN || null;

  // Allow requests with no Origin header (same-origin, curl, etc.)
  if (!origin) return next();

  // In production, check against allowed origin
  if (allowedOrigin && origin !== allowedOrigin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
}

// Rate limiter for generation endpoints
const generationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'Too many generation requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Generation logging
function logGeneration(endpoint, req, startTime, success) {
  const duration = Date.now() - startTime;
  console.log(JSON.stringify({
    type: 'generation',
    endpoint,
    duration,
    success,
    timestamp: new Date().toISOString(),
  }));
}

// Robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow: /api/\n');
});

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
    res.status(500).json({ error: 'Something went wrong' });
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
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Resolve prompt by name (for Top 8 clicks) - find existing or generate
app.post('/api/prompt/resolve', requireSameOrigin, generationLimiter, async (req, res) => {
  const startTime = Date.now();
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

    logGeneration('/api/prompt/resolve', req, startTime, true);
    res.json({ ...validated, slug });
  } catch (error) {
    logGeneration('/api/prompt/resolve', req, startTime, false);
    console.error('Resolve error:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Pre-generate Top 8 friends in background (fire-and-forget)
app.post('/api/prefetch/top8', requireSameOrigin, generationLimiter, async (req, res) => {
  // Immediately respond so client doesn't wait
  res.json({ status: 'prefetching' });

  const { friends } = req.body;
  if (!friends || !Array.isArray(friends)) return;

  // Generate each friend in background (don't await all at once to avoid rate limits)
  for (const friend of friends) {
    const startTime = Date.now();
    try {
      // Skip if already exists
      const existing = db.getByName(friend.name);
      if (existing) continue;

      // Generate new prompt
      const promptTemplate = prompts.TOP8_RESOLVE_PROMPT
        .replace('{{NAME}}', friend.name)
        .replace('{{VIBE}}', friend.vibe || '');

      const generated = await claude.generate('', promptTemplate);
      const validated = validatePrompt(generated, 'top8', null);
      db.insertPrompt(validated);
      logGeneration('/api/prefetch/top8', req, startTime, true);
    } catch (error) {
      logGeneration('/api/prefetch/top8', req, startTime, false);
      console.error(`Failed to pre-generate ${friend.name}:`, error.message);
    }
  }
});

// Generate from metaphor
app.post('/api/generate/metaphor', requireSameOrigin, generationLimiter, async (req, res) => {
  const startTime = Date.now();
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

    logGeneration('/api/generate/metaphor', req, startTime, true);
    res.json({ ...validated, slug });
  } catch (error) {
    logGeneration('/api/generate/metaphor', req, startTime, false);
    console.error('Metaphor generation error:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
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
