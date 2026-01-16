// Inject random ASL values into existing prompts
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/prompts.db');

const ages = ['∞', '??', 'eternal', '42', '23', '69', '420', '1987', 'ancient', '∞+1', 'n/a', '37 going on 12', 'timeless', '2007', '99', '67', '100+', 'idk', 'old enough'];
// Distribution: 20% M, 20% F, 10% void/other, 50% omit (empty string)
const sexes = ['M', 'M', 'F', 'F', 'void', '', '', '', '', ''];  // 2M, 2F, 1void, 5empty = 20/20/10/50
const locations = [
  'the space between radio stations',
  'sector 7g',
  'a liminal mall',
  'the backrooms',
  'floor 13',
  'the upside down',
  'zone 51',
  'a geocities server',
  'the waiting room',
  'nowhere in particular',
  'between channels',
  'the phantom zone',
  'a rest stop off I-95',
  'the long now',
  'a blockbuster that never closed',
  'the vaporwave dimension',
  'an infinite ikea',
  'the dial-up dimension',
  'a myspace that still works',
  'the last radio shack',
  'a mall fountain',
  'the space under the couch',
  'tatooine probably',
  'deep space 9',
  'rivendell adjacent',
  'the shire (east)',
  'narnia time',
  'hogwarts dropout',
  'platform 9.5',
  "a denny's at 3am",
  'the shadow realm',
  'silent hill',
  'raccoon city',
  'the twilight zone',
  'a target at 2am',
  'liminal poolrooms',
  'the astral plane',
  'dimension c-137',
  'the sunken place',
  'springfield (the other one)',
  'a circuit city that never died'
];

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  const SQL = await initSqlJs();
  const fileBuffer = fs.readFileSync(DB_PATH);
  const db = new SQL.Database(fileBuffer);

  const rows = db.exec('SELECT id, aesthetic_json FROM prompts');
  if (!rows.length) {
    console.log('No prompts found');
    return;
  }

  const data = rows[0].values;
  let updated = 0;

  for (const [id, aestheticJson] of data) {
    const aesthetic = JSON.parse(aestheticJson || '{}');

    const age = pick(ages);
    const sex = pick(sexes);
    const loc = pick(locations);

    // Format: age/sex/location or age/location if sex is empty
    aesthetic.asl = sex ? `${age}/${sex}/${loc}` : `${age}/${loc}`;

    db.run('UPDATE prompts SET aesthetic_json = ? WHERE id = ?', [JSON.stringify(aesthetic), id]);
    updated++;
  }

  // Save back to file
  const newData = db.export();
  const buffer = Buffer.from(newData);
  fs.writeFileSync(DB_PATH, buffer);

  console.log(`Updated ${updated} prompts with ASL`);
  db.close();
}

main().catch(console.error);
