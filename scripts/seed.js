const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), override: true });

const db = require('../lib/db');
const claude = require('../lib/claude');
const prompts = require('../lib/prompts');
const { validatePrompt } = require('../lib/validate');

const TARGET_COUNT = 25;

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

  console.log(`Generating ${toGenerate} new prompts...`);

  for (let i = 0; i < toGenerate; i++) {
    try {
      console.log(`Generating prompt ${i + 1}/${toGenerate}...`);

      // Generate random seed to force variety
      const seed = Math.random().toString(36).substring(2, 10) + '-' + Date.now();
      const promptWithSeed = prompts.NEW_PROFILE_PROMPT.replace('{{SEED}}', seed);
      const generated = await claude.generate('', promptWithSeed);
      const validated = validatePrompt(generated, 'seed', null);
      const slug = db.insertPrompt(validated);

      console.log(`  Created: ${validated.prompt_name} (${slug})`);

      // Small delay between generations to be nice to the API
      if (i < toGenerate - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`  Failed to generate prompt ${i + 1}:`, error.message);
      // Continue with next prompt
    }
  }

  console.log(`\nDone! Database now has ${db.getCount()} prompts.`);
}

seed().catch(console.error);
