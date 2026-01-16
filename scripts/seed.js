const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), override: true });

const db = require('../lib/db');
const claude = require('../lib/claude');
const prompts = require('../lib/prompts');
const { getRandomTopic } = require('../lib/topics');
const { validatePrompt } = require('../lib/validate');

const TARGET_COUNT = 30;
const BATCH_SIZE = 5; // Run 5 in parallel (10 was overloading the API)

async function generateOne(i, total) {
  const topic = getRandomTopic();
  console.log(`[${i}/${total}] "${topic}"`);

  const promptWithTopic = prompts.NEW_PROFILE_PROMPT.replace('{{TOPIC}}', topic);
  const generated = await claude.generate('', promptWithTopic);
  const validated = validatePrompt(generated, 'seed', null);
  const slug = db.insertPrompt(validated);

  console.log(`  ✓ ${validated.prompt_name}`);
  return slug;
}

async function seed() {
  console.log('Initializing database...');
  await db.init();

  const currentCount = db.getCount();
  console.log(`Current prompt count: ${currentCount}`);

  const toGenerate = Math.max(0, TARGET_COUNT - currentCount);
  if (toGenerate === 0) {
    console.log('Database already has enough prompts.');
    return;
  }

  console.log(`Generating ${toGenerate} new prompts in batches of ${BATCH_SIZE}...\n`);

  let generated = 0;
  while (generated < toGenerate) {
    const batchSize = Math.min(BATCH_SIZE, toGenerate - generated);
    const batch = [];

    for (let i = 0; i < batchSize; i++) {
      batch.push(generateOne(generated + i + 1, toGenerate));
    }

    const results = await Promise.allSettled(batch);
    const succeeded = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    if (failed > 0) {
      console.log(`  (${failed} failed in this batch)`);
    }

    generated += batchSize;
    console.log(`--- Batch complete: ${db.getCount()} total prompts ---\n`);
  }

  console.log(`\nDone! Database now has ${db.getCount()} prompts.`);
}

seed().catch(console.error);
