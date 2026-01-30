const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// In production (Fly.io), use the mounted volume at /data
// Locally, use the project's data/ directory
const DB_DIR = process.env.NODE_ENV === 'production' ? '/data' : path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DB_DIR, 'prompts.db');

let db = null;

async function init() {
  const SQL = await initSqlJs();

  // Ensure data directory exists
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  // Load existing database or create new
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Create table if not exists
  db.run(`
    CREATE TABLE IF NOT EXISTS prompts (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      prompt_name TEXT NOT NULL,
      the_prompt TEXT NOT NULL,
      about_me TEXT,
      who_id_like_to_meet TEXT,
      aesthetic_json TEXT,
      if_this_were_a_json TEXT,
      top_8_json TEXT,
      source TEXT,
      parent_id TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_slug ON prompts(slug)`);

  save();
  return db;
}

function save() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

function generateSlug(promptName) {
  let slug = promptName
    .toLowerCase()
    .replace(/^xx_/gi, '')
    .replace(/_xx$/gi, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) slug = 'prompt';
  return slug.substring(0, 45);
}

function getUniqueSlug(promptName) {
  const baseSlug = generateSlug(promptName);
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = db.exec(`SELECT id FROM prompts WHERE slug = ?`, [slug]);
    if (existing.length === 0 || existing[0].values.length === 0) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

function insertPrompt(prompt) {
  const slug = getUniqueSlug(prompt.prompt_name);

  db.run(`
    INSERT INTO prompts (id, slug, prompt_name, the_prompt, about_me, who_id_like_to_meet,
                         aesthetic_json, if_this_were_a_json, top_8_json, source, parent_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    prompt.id,
    slug,
    prompt.prompt_name,
    prompt.the_prompt,
    prompt.about_me || '',
    prompt.who_id_like_to_meet || '',
    JSON.stringify(prompt.aesthetic || {}),
    JSON.stringify(prompt.if_this_were_a || {}),
    JSON.stringify(prompt.top_8 || []),
    prompt.source || 'seed',
    prompt.parent_id || null
  ]);

  save();
  return slug;
}

function getBySlug(slug) {
  const result = db.exec(`SELECT * FROM prompts WHERE slug = ?`, [slug]);
  if (result.length === 0 || result[0].values.length === 0) return null;
  return rowToPrompt(result[0].columns, result[0].values[0]);
}

function getByName(name) {
  // Fuzzy match: normalize both sides
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const result = db.exec(`SELECT * FROM prompts`);
  if (result.length === 0) return null;

  for (const row of result[0].values) {
    const promptName = row[result[0].columns.indexOf('prompt_name')];
    const rowNormalized = promptName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (rowNormalized === normalized || rowNormalized.includes(normalized) || normalized.includes(rowNormalized)) {
      return rowToPrompt(result[0].columns, row);
    }
  }
  return null;
}

function getRandom() {
  const result = db.exec(`SELECT * FROM prompts ORDER BY RANDOM() LIMIT 1`);
  if (result.length === 0 || result[0].values.length === 0) return null;
  return rowToPrompt(result[0].columns, result[0].values[0]);
}

function getCount() {
  const result = db.exec(`SELECT COUNT(*) as count FROM prompts`);
  if (result.length === 0) return 0;
  return result[0].values[0][0];
}

function rowToPrompt(columns, row) {
  const obj = {};
  columns.forEach((col, i) => {
    obj[col] = row[i];
  });

  return {
    id: obj.id,
    slug: obj.slug,
    prompt_name: obj.prompt_name,
    the_prompt: obj.the_prompt,
    about_me: obj.about_me,
    who_id_like_to_meet: obj.who_id_like_to_meet,
    aesthetic: JSON.parse(obj.aesthetic_json || '{}'),
    if_this_were_a: JSON.parse(obj.if_this_were_a_json || '{}'),
    top_8: JSON.parse(obj.top_8_json || '[]'),
    source: obj.source,
    parent_id: obj.parent_id,
    created_at: obj.created_at
  };
}

module.exports = {
  init,
  save,
  insertPrompt,
  getBySlug,
  getByName,
  getRandom,
  getCount,
  generateSlug
};
