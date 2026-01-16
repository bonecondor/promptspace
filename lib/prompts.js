const NEW_PROFILE_PROMPT = `Generate a complete "prompt profile page" in JSON format.

You are generating ONE prompt for a StumbleUpon-style discovery site. Each prompt should feel like stumbling onto something completely unexpected.

CRITICAL: Use the random seed "{{SEED}}" to determine what topic this prompt is about. Generate something COMPLETELY DIFFERENT each time.

Example topics (but go beyond these):
octopus intelligence, Cambodian rice farming, divorce mediation, fermentation science, brutalist architecture, competitive dog grooming, lighthouse keeping, crime scene cleanup, bird migration, parallel parking anxiety, laundromat sociology, 1970s office culture, explaining cryptocurrency to a medieval peasant, the emotional life of vending machines, grandma's passive aggression, airport carpet design, grocery store music playlists, hotel minibar economics, the DMV as performance art

Generate a JSON object with these fields:

prompt_name: A 2007-style screen name that matches the topic. Examples: "sad_receipts", "DIVORCE_DOULA_99", "xX_CarpetKing_Xx", "octopus_whisperer", "laundry_philosopher", "PARKING_ANXIETY_420"

the_prompt: The actual prompt someone would paste into an AI. Specific and interesting. About the random topic you chose - NOT about magic or fantasy.

about_me: 2-3 sentences in first person from the prompt's perspective. Written like a 2007 MySpace bio. Slightly unhinged, self-aware, lowercase energy.

who_id_like_to_meet: 2-3 sentences, same voice. What kind of user or situation would this prompt love to encounter?

aesthetic: Object with:
  - colors: array of 3 hex codes that match the vibe
  - font_vibe: short description of typography energy
  - background: description of what a MySpace background for this prompt would look like
  - now_playing: a real song that matches the prompt's energy (artist - title format)

if_this_were_a: Object with EXACTLY 4 random keys from this list (pick different ones each time!):
  Possible categories: video_game, cocktail, font, neighborhood, sandwich, dog_breed, ikea_product, first_date, car, weather, crime, medical_condition, holiday, kitchen_appliance, yoga_pose, conspiracy_theory, tiktok_trend, breakup_text, airport, plant, smell, subway_line, reality_show, workout, emotion, snack, decade, bedtime_story, tax_form, voicemail

  Each value should be a creative one-liner description.
  Example: if you pick "sandwich", "tax_form", "dog_breed", "smell" then:
  { "sandwich": "a soggy club that somehow still costs $18", "tax_form": "Schedule C but it's crying", "dog_breed": "anxious greyhound energy", "smell": "burnt toast and regret" }

top_8: Array of 8 objects, each with:
  - name: screen name for a related prompt
  - vibe: brief description of what that prompt does

Return only valid JSON, no markdown formatting.`;

const METAPHOR_TRANSFORM_PROMPT = `You are an archivist of linguistic spells. You've been given a concept that was a metaphor for another prompt. Now this concept needs to become its own prompt.

The concept: {{METAPHOR_TEXT}}

Generate a complete prompt profile where the core prompt embodies this concept directly. The prompt should make someone experience or interact with this concept through AI.

Generate a JSON object with these fields:

prompt_name: A title styled like a 2007 screen name that fits this concept

the_prompt: An actual prompt that brings this concept to life. Not "describe this thing" but rather makes the AI embody or perform this concept in an interesting way.

about_me: 2-3 sentences in first person from the prompt's perspective. Written like a 2007 MySpace bio.

who_id_like_to_meet: 2-3 sentences, same voice.

aesthetic: Object with:
  - colors: array of 3 hex codes that match the vibe
  - font_vibe: short description of typography energy
  - background: description of what a MySpace background for this prompt would look like
  - now_playing: a real song that matches the prompt's energy

if_this_were_a: Object with EXACTLY 4 random keys from this list (pick different ones each time!):
  Possible categories: video_game, cocktail, font, neighborhood, sandwich, dog_breed, ikea_product, first_date, car, weather, crime, medical_condition, holiday, kitchen_appliance, yoga_pose, conspiracy_theory, tiktok_trend, breakup_text, airport, plant, smell, subway_line, reality_show, workout, emotion, snack, decade, bedtime_story, tax_form, voicemail

  Each value should be a creative one-liner description.
  Example: if you pick "sandwich", "tax_form", "dog_breed", "smell" then:
  { "sandwich": "a soggy club that somehow still costs $18", "tax_form": "Schedule C but it's crying", "dog_breed": "anxious greyhound energy", "smell": "burnt toast and regret" }

top_8: Array of 8 objects, each with:
  - name: screen name for a related prompt
  - vibe: brief description of what that prompt does

Return only valid JSON, no markdown formatting.`;

const TOP8_RESOLVE_PROMPT = `You are an archivist of linguistic spells. Generate a prompt profile for a prompt with this name and vibe:

Name: {{NAME}}
Vibe: {{VIBE}}

Generate a complete prompt profile that matches this name and vibe.

Generate a JSON object with these fields:

prompt_name: Use the name provided above (keep the exact formatting)

the_prompt: An actual prompt that matches the vibe description. Make it specific and interesting.

about_me: 2-3 sentences in first person from the prompt's perspective. Written like a 2007 MySpace bio.

who_id_like_to_meet: 2-3 sentences, same voice.

aesthetic: Object with:
  - colors: array of 3 hex codes that match the vibe
  - font_vibe: short description of typography energy
  - background: description of what a MySpace background for this prompt would look like
  - now_playing: a real song that matches the prompt's energy

if_this_were_a: Object with EXACTLY 4 random keys from this list (pick different ones each time!):
  Possible categories: video_game, cocktail, font, neighborhood, sandwich, dog_breed, ikea_product, first_date, car, weather, crime, medical_condition, holiday, kitchen_appliance, yoga_pose, conspiracy_theory, tiktok_trend, breakup_text, airport, plant, smell, subway_line, reality_show, workout, emotion, snack, decade, bedtime_story, tax_form, voicemail

  Each value should be a creative one-liner description.
  Example: if you pick "sandwich", "tax_form", "dog_breed", "smell" then:
  { "sandwich": "a soggy club that somehow still costs $18", "tax_form": "Schedule C but it's crying", "dog_breed": "anxious greyhound energy", "smell": "burnt toast and regret" }

top_8: Array of 8 objects, each with:
  - name: screen name for a related prompt
  - vibe: brief description of what that prompt does

Return only valid JSON, no markdown formatting.`;

module.exports = {
  NEW_PROFILE_PROMPT,
  METAPHOR_TRANSFORM_PROMPT,
  TOP8_RESOLVE_PROMPT
};
