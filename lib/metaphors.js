// Curated metaphor categories for "If This Prompt Were A..."
// These should be things that create interesting lateral connections

const METAPHOR_CATEGORIES = [
  // Things that have vibes
  'video_game',
  'cocktail',
  'font',
  'neighborhood',
  'decade',
  'subway_line',
  'airport',
  'holiday',
  'weather',

  // Tangible objects
  'sandwich',
  'ikea_product',
  'kitchen_appliance',
  'car',
  'plant',
  'snack',

  // Living things with personality
  'dog_breed',
  'cryptid',
  'florida_man_headline',

  // Experiences
  'first_date',
  'breakup_text',
  'voicemail',
  'workout',
  'yoga_pose',
  'reality_show',
  'bedtime_story',

  // Bureaucracy & systems
  'tax_form',
  'medical_condition',
  'conspiracy_theory',
  'crime',

  // Senses & feelings
  'smell',
  'emotion',
  'type_of_silence',
  'kind_of_tired',

  // Internet culture
  'tiktok_trend',
  'subreddit',
  'wikipedia_rabbit_hole',
  'podcast_genre',

  // Weird specifics
  'gas_station_in_a_specific_state',
  'hotel_star_rating',
  'font_pairing',
  'time_of_day_to_receive_bad_news'
];

function getRandomMetaphors(count = 4) {
  const shuffled = [...METAPHOR_CATEGORIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

module.exports = { METAPHOR_CATEGORIES, getRandomMetaphors };
