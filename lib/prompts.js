// PromptSpace Generation Prompts
// Philosophy: "Is there a rabbit hole? If it opens into a world, it's right."

// Vibe exemplars - show the AI what "good" looks like
const VIBE_EXEMPLARS = `
VIBE EXEMPLARS - These show what "good" looks like across different emotional registers:

1. Quiet archive energy:
"i've been photographing payphones since 2007. not because i'm nostalgic exactly, just... they're disappearing and someone should notice. this site has 2,847 payphones across 38 states. some still work. most don't. a few have been turned into planters. i update when i can."

2. Obsessive grower energy:
"i've been hunting for a specific New Jersey heirloom tomato that supposedly hasn't been commercially grown since 1985. a woman in a facebook gardening group claims she has seeds from her grandmother's original vines. i'm driving to Trenton on Saturday. if this works i'll have maybe the only living plants of the Ramapo Red in existence. my hands are shaking typing this."

3. Committed whimsy:
"the crows in my neighborhood have a clear hierarchy and i've been documenting it for two years. there's a succession crisis brewing. the old leader (i call him Commissioner Gordon) hasn't been seen in weeks and two factions are forming. i have charts."

4. Nature wonder:
"there's a beach in Tasmania where wombats have been using the same paths for so long they've worn grooves into the sandstone. we're talking centuries of wombat commutes. the paths lead to a freshwater spring, a grazing clearing, and one route that just... ends at a nice rock. no one knows why that rock. but the wombats keep going there."

5. Technical "actually":
"the reason manhole covers are round isn't just 'so they don't fall in' - that's the answer you get in job interviews. the REAL answer involves casting efficiency, the specific brittleness of iron under load stress, and a 1920s engineering paper from Newark that nobody's read but everyone's citing wrong. i've read it. let me explain."

6. Cracked absurdist:
"the sport of cheese rolling has a higher injury rate than rugby, zero official safety regulations, and has been held on the same hill in Gloucestershire since at least the 1800s. the cheese reaches 70mph. people travel from around the world to chase it. the winner gets the cheese. that's it. that's the prize. the cheese."

7. Forager/field notes:
"there are six species of edible violet in the northeast and people mix them up constantly. i've been mapping where each one grows in a 50-mile radius of my house. the common blue is everywhere but the Birdfoot violet only shows up on one specific type of disturbed limestone soil. i keep a journal. i press samples. spring is my whole personality now."
`;

// Soft banned words - not blocklisted but should trigger "door or dead end?" check
// Blurb exemplars - show the AI what MySpace-era bios look like
const BLURB_EXEMPLARS = `
BLURB EXEMPLARS - These show what "About Me" and "Who I'd Like to Meet" sound like.

⚠️ CRITICAL - READ THIS CAREFULLY ⚠️

The "About Me" is NOT a bio. It is NOT a description of the topic. It is NOT "I've been fascinated by X since..."

The "About Me" IS: An actual example of what the AI would OUTPUT if someone ran this prompt.

Think of it this way:
- If the prompt is "Explain plate tectonics as a divorce" → the About Me IS that explanation
- If the prompt is "Narrate X as a nature documentary" → the About Me IS that narration
- If the prompt is "Write patch notes for Y" → the About Me IS those patch notes

DO NOT write: "I've been studying cheese rolling for years..."
DO write: The actual cheese rolling content the prompt would generate.

TONE DISTRIBUTION - Each PAGE picks ONE tone. Both About Me AND Who I'd Like to Meet use the SAME tone.
- 60% of pages: Regular/Serious - Normal capitalization, proper sentences
- 30% of pages: 2000s forum/xanga energy - ~tildes~, random CAPS, emoticons :) XD <3
- 10% of pages: Internet-lingo heavy - memes, very online speak

ABOUT ME examples - these are what the PROMPT WOULD OUTPUT, not descriptions of topics:

1. Regular/Serious (60% of the time):
"Plate tectonics is essentially a 200-million-year custody battle. Pangaea wanted to stay together. The mantle had other plans. Now we've got continents sending passive-aggressive seismic waves across the Atlantic."

2. Regular/Serious:
"The 2019 office water cooler offers subtle notes of plastic with a fluoride finish. Pairs well with microwave fish and passive aggressive reply-alls. A working professional's staple."

3. 2000s forum energy (30% of the time):
"omg ok so basically the adult human is attempting to locate matching socks and it's NOT going well lol. The drawer is literally a graveyard of singles at this point?? RIP to all the socks we've lost along the way :("

4. 2000s forum energy:
"~*~WELCOME TO MY TED TALK ABOUT CHEESE ROLLING~*~ Did you know the cheese reaches 70mph?? SEVENTY. And people just... chase it down a hill. The winner gets the cheese. That's it. That's the whole prize. I am OBSESSED honestly XD"

5. Internet-lingo heavy (10% of the time):
"no thoughts just manhole covers. this is my roman empire. the engineering paper from 1920s Newark is giving unhinged and I'm here for it."

6. Regular/Serious:
"Form 27-B stroke 6: Haunting Complaint. Ma'am, I understand the ghost situation is distressing but you'll need to file with Spectral Affairs. This is the Department of Unexplained Sounds. Chains clanking is their jurisdiction."

WHO I'D LIKE TO MEET examples:

1. Regular/Serious:
"Other people who pull over when they see something weird on a road trip. Urban explorers who respect the spaces. Anyone who's ever said 'wait I need to take a picture of this' about something objectively unremarkable."

2. 2000s forum energy:
"anyone else who has like 47 browser tabs open about this rn?? fellow obsessives welcome!! also if you've ever stayed up til 3am reading wikipedia articles we should be friends :)"

3. Regular/Serious:
"People who notice things about infrastructure that they can't un-notice. Civil engineers with opinions. Anyone who has ever photographed a drain."
`;

const SOFT_BANNED_GUIDANCE = `
TONE GUIDANCE - Ask yourself: "Is this a door or a dead end?"

AVOID these patterns:
- Therapy session words: loneliness, lonely, melancholy, dread, anxiety, anxious, sadness, sad, ennui, malaise, despair
- Ironic millennial internet words: liminal, late capitalism, "specific sadness," "existential weight"
- Death/decay cluster: mortality, decay, rot (unless literal)

THE TEST: Is the word pointing toward discovery and depth, or toward a closed loop of sad observation?

Wistful is okay - but wistful about the THING, not about existence.

This isn't an observation about life - it's a door into something.
`;

const NEW_PROFILE_PROMPT = `You are generating a prompt profile for a StumbleUpon-style discovery site.

${VIBE_EXEMPLARS}

${BLURB_EXEMPLARS}

YOUR ASSIGNED TOPIC: {{TOPIC}}

**Voice:**
Someone who cared enough to make a whole page about this. The WHY they care can vary - excitedly sharing a discovery, quietly archiving over years, a hint of "I know this is obscure but it matters to me." You can feel the intention.

**Structure:**
Sometimes this is formal - a guide, a ranking, an archive, a history. Sometimes it's just someone mid-obsession, talking to whoever will listen. Let the topic decide. The structure serves the thing, not the other way around.

**Reality:**
Most of the time, this is real - a hobby, a history, a community, a niche that actually exists. Occasionally it's a playful bit someone's fully committed to. Either way: genuine investment, open invitation.

**The test:**
Is there a rabbit hole? Could you click deeper, find a community, discover more? If it dead-ends in an observation about the human condition, it's wrong. If it opens into a world, it's right.

${SOFT_BANNED_GUIDANCE}

Generate a JSON object with these fields:

prompt_name: A short 2000s-style screen name. Keep it SIMPLE and SHORT (under 15 characters preferred).

USERNAME PATTERNS - keep them punchy!:
- Simple + number: "dave420", "jess67", "mike2k", "void69", "star99"
- xXx style: "xXdaveXx", "xXstarXx"
- Tilde style: "~stargirl~", "~void~"
- Short descriptive: "mapguy", "birdnerd", "fonthead", "radiojoe"
- Name + year: "jen2007", "chris03", "sara99"
- One word: "void", "static", "pixel", "ghost"

GOOD: dave420, ~stella~, xXmarcusXx, birdman69, fontgirl, radio_jen, void99
BAD: topic_role_descriptor_year_number, anything over 20 characters, too many underscores

BANNED NUMBERS: Never use 88 or 14 in usernames.
ENCOURAGED NUMBERS: 420, 69, 67, 99, 2k, 03, 07

the_prompt: The actual prompt someone would COPY AND PASTE into ChatGPT or Claude. This is NOT a welcome message or blog intro. It's an instruction that makes the AI do something interesting related to the topic.

GOOD EXAMPLES:
- "Explain plate tectonics as a bitter divorce between continents who still have to share custody of the ocean."
- "You are a sommelier but for regional chip flavors. Guide me through a tasting flight of the most underrated gas station chips in America."
- "Narrate my morning routine as a nature documentary, but you're becoming increasingly judgmental about my choices."
- "Write the patch notes for the latest update to 'being a human' - what bugs were fixed, what features were added, what's still broken."

BAD EXAMPLES (DO NOT DO THIS):
- "Join me on a journey through..." (this is a blog intro, not a prompt)
- "Welcome to my exploration of..." (not a prompt)
- "I've been fascinated by..." (not a prompt)

The prompt should be a COMMAND or ROLEPLAY SETUP that makes the AI do something fun.

about_me: ⚠️ THIS IS NOT A BIO. This is a SAMPLE OUTPUT of the prompt - literally what someone would get if they ran this prompt. If the prompt says "Explain X as Y", write that explanation. If it says "Narrate X as Z", write that narration. DO NOT write "I've been interested in..." or describe the topic. WRITE THE ACTUAL PROMPT OUTPUT. 2-4 sentences. Follow TONE DISTRIBUTION in BLURB EXEMPLARS.

who_id_like_to_meet: 2-3 sentences that match the energy of the about_me. Who would love this rabbit hole? Be specific about the TYPE of person - their habits, what they notice, what they say. See BLURB EXEMPLARS for examples.

aesthetic: Object with:
  - colors: array of 3 hex codes that match the vibe
  - font_vibe: short description of typography energy (5 words max)
  - background: 5-10 word description of background vibe (e.g. "tiled vintage postcards", "blurry forest photo")
  - now_playing: a REAL song (artist - title format) that relates to the page content. Should reference something on the page or be thematically connected. Time-period appropriate songs (2000s-2010s) are good but not required
  - asl: whimsical fake A/S/L. Distribution: 20% M, 20% F, 10% void/??/other, 50% OMIT SEX ENTIRELY (just age/location). Age can be a number, symbol (∞), or concept. Location should be whimsical, can reference sci-fi/fantasy. Examples: "23/M/sector 7g", "∞/F/the backrooms", "42/void/a denny's at 3am", "eternal/the upside down" (no sex), "69/tatooine" (no sex)

if_this_were_a: Object with EXACTLY 4 random keys from this list (pick DIFFERENT ones each time!):
  video_game, cocktail, font, neighborhood, decade, subway_line, airport, holiday, weather, sandwich, ikea_product, kitchen_appliance, car, plant, snack, dog_breed, first_date, voicemail, reality_show, wikipedia_rabbit_hole, podcast_genre, time_of_day

  Each value should be a creative, specific one-liner that captures the vibe.

top_8: Array of 8 objects, each with:
  - name: SHORT screen name (under 15 chars). Use patterns like: dave420, ~stella~, xXmarcusXx, birdguy, jen2k. NO long compound names. BANNED: 88, 14. GOOD: 420, 69, 67, 99
  - vibe: brief description of what that prompt explores

Return only valid JSON, no markdown formatting.`;

const METAPHOR_TRANSFORM_PROMPT = `You are generating a prompt profile based on a concept that started as a metaphor for another prompt.

${VIBE_EXEMPLARS}

${BLURB_EXEMPLARS}

The concept: {{METAPHOR_TEXT}}

Turn this concept into its own rabbit hole. The prompt should make someone experience or explore this concept in a way that opens up, not closes down.

${SOFT_BANNED_GUIDANCE}

Generate a JSON object with these fields:

prompt_name: A short 2000s-style screen name. Keep it SIMPLE and SHORT (5-15 characters).

USERNAME PATTERNS - keep them punchy!:
- Simple + number: "dave420", "jess67", "mike2k", "void69", "star99"
- xXx style: "xXdaveXx", "xXstarXx"
- Tilde style: "~stargirl~", "~void~"
- Short descriptive: "mapguy", "birdnerd", "fonthead", "radiojoe"
- Name + year: "jen2007", "chris03", "sara99"
- One word: "void", "static", "pixel", "ghost"

GOOD: dave420, ~stella~, xXmarcusXx, birdman69, fontgirl, radio_jen, void99
BAD: topic_role_descriptor_year_number, anything over 15 characters, too many underscores

BANNED NUMBERS: Never use 88 or 14 in usernames.
ENCOURAGED NUMBERS: 420, 69, 67, 99, 2k, 03, 07

the_prompt: An actual prompt that brings this concept to life. Not "describe this thing" but rather invites exploration, discovery, or genuine engagement with the concept.

about_me: ⚠️ THIS IS NOT A BIO. This is a SAMPLE OUTPUT of the prompt - literally what someone would get if they ran this prompt. If the prompt says "Explain X as Y", write that explanation. If it says "Narrate X as Z", write that narration. DO NOT write "I've been interested in..." or describe the topic. WRITE THE ACTUAL PROMPT OUTPUT. 2-4 sentences. Follow TONE DISTRIBUTION in BLURB EXEMPLARS.

who_id_like_to_meet: 2-3 sentences that match the energy of the about_me. Who would love this rabbit hole? Be specific about the TYPE of person - their habits, what they notice, what they say. See BLURB EXEMPLARS for examples.

aesthetic: Object with:
  - colors: array of 3 hex codes that match the vibe
  - font_vibe: short description of typography energy
  - background: description of what a MySpace background for this prompt would look like
  - now_playing: a REAL song (artist - title format) that relates to the page content. Should reference something on the page or be thematically connected
  - asl: whimsical fake A/S/L. Distribution: 20% M, 20% F, 10% void/??/other, 50% OMIT SEX ENTIRELY (just age/location). Examples: "23/M/sector 7g", "∞/F/the backrooms", "42/void/a denny's at 3am", "eternal/the upside down" (no sex), "69/tatooine" (no sex)

if_this_were_a: Object with EXACTLY 4 random keys from this list (pick DIFFERENT ones each time!):
  video_game, cocktail, font, neighborhood, decade, subway_line, airport, holiday, weather, sandwich, ikea_product, kitchen_appliance, car, plant, snack, dog_breed, first_date, voicemail, reality_show, wikipedia_rabbit_hole, podcast_genre, time_of_day

  Each value should be a creative, specific one-liner.

top_8: Array of 8 objects, each with:
  - name: SHORT screen name (5-15 chars). Use patterns like: dave420, ~stella~, xXmarcusXx, birdguy, jen2k. NO long compound names. BANNED: 88, 14. GOOD: 420, 69, 67, 99
  - vibe: brief description of what that prompt explores

Return only valid JSON, no markdown formatting.`;

const TOP8_RESOLVE_PROMPT = `You are generating a prompt profile for a prompt that was referenced in another prompt's Top 8 friends.

${VIBE_EXEMPLARS}

${BLURB_EXEMPLARS}

Name: {{NAME}}
Vibe: {{VIBE}}

Generate a complete prompt profile that matches this name and vibe. This prompt should feel like it belongs in the same ecosystem - someone with adjacent interests who would naturally be in the first prompt's Top 8.

${SOFT_BANNED_GUIDANCE}

Generate a JSON object with these fields:

prompt_name: Use the name provided above (keep the exact formatting)

the_prompt: An actual prompt that matches the vibe description. Make it invite exploration and discovery.

about_me: ⚠️ THIS IS NOT A BIO. This is a SAMPLE OUTPUT of the prompt - literally what someone would get if they ran this prompt. If the prompt says "Explain X as Y", write that explanation. If it says "Narrate X as Z", write that narration. DO NOT write "I've been interested in..." or describe the topic. WRITE THE ACTUAL PROMPT OUTPUT. 2-4 sentences. Follow TONE DISTRIBUTION in BLURB EXEMPLARS.

who_id_like_to_meet: 2-3 sentences that match the energy of the about_me. Who would love this rabbit hole? Be specific about the TYPE of person - their habits, what they notice, what they say. See BLURB EXEMPLARS for examples.

aesthetic: Object with:
  - colors: array of 3 hex codes that match the vibe
  - font_vibe: short description of typography energy
  - background: description of what a MySpace background for this prompt would look like
  - now_playing: a REAL song (artist - title format) that relates to the page content. Should reference something on the page or be thematically connected
  - asl: whimsical fake A/S/L. Distribution: 20% M, 20% F, 10% void/??/other, 50% OMIT SEX ENTIRELY (just age/location). Examples: "23/M/sector 7g", "∞/F/the backrooms", "42/void/a denny's at 3am", "eternal/the upside down" (no sex), "69/tatooine" (no sex)

if_this_were_a: Object with EXACTLY 4 random keys from this list (pick DIFFERENT ones each time!):
  video_game, cocktail, font, neighborhood, decade, subway_line, airport, holiday, weather, sandwich, ikea_product, kitchen_appliance, car, plant, snack, dog_breed, first_date, voicemail, reality_show, wikipedia_rabbit_hole, podcast_genre, time_of_day

  Each value should be a creative, specific one-liner.

top_8: Array of 8 objects, each with:
  - name: SHORT screen name (5-15 chars). Use patterns like: dave420, ~stella~, xXmarcusXx, birdguy, jen2k. NO long compound names. BANNED: 88, 14. GOOD: 420, 69, 67, 99
  - vibe: brief description of what that prompt explores

Return only valid JSON, no markdown formatting.`;

module.exports = {
  NEW_PROFILE_PROMPT,
  METAPHOR_TRANSFORM_PROMPT,
  TOP8_RESOLVE_PROMPT,
  VIBE_EXEMPLARS,
  BLURB_EXEMPLARS,
  SOFT_BANNED_GUIDANCE
};
