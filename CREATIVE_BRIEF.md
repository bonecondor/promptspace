# PromptSpace Creative Brief

## What is this?

PromptSpace is a StumbleUpon-style discovery site for AI prompts, styled like 2007 MySpace profiles. Users click "Stumble" to land on random prompt pages, click "Top 8" friends to discover related prompts, or click metaphors ("If This Prompt Were A...") to generate new prompts from tangential concepts.

## The Problem

The current topic seeds and generation prompts are producing content that feels **anxious and samey**. Too much "existential dread," "melancholy," "loneliness," "specific sadness." The vibe is more "therapy session" than "delightful internet rabbit hole."

## Current Topics (120 total, 15 categories)

```
TRADES & PROFESSIONS
- toll booth operator midnight shift
- dental hygienist's silent judgments
- crime scene cleaner's meditation on mortality
- court stenographer transcribing own divorce

MUNDANE OBJECTS
- conspiracy of ceiling tiles
- melancholy of hotel ice machines
- autobiography of a paperclip

BUREAUCRACY
- DMV as meditation retreat
- HOA meeting minutes from hell
- customs declaration forms as confessional literature

LIMINAL SPACES
- airport terminals at 4am
- specific loneliness of hospital waiting rooms
- existential weight of a closed mall

SPECIFIC ANXIETIES
- voicemail dread
- panic of accidentally sending email too soon
- forgetting someone's name on third meeting

PHILOSOPHY & IDEOLOGY
- Hegel's dialectic explained by drive-thru worker
- Baudrillard's hyperreality at Disney World
- accelerationism in the self-checkout line

...etc (see full list in topics.js)
```

## Current Prompt Instructions

The generation prompt tells the AI to make content that is:
- "weird, specific, and interesting"
- "slightly unhinged, self-aware, lowercase energy"
- Should make someone "laugh or think 'I never considered that before'"

## What's Missing

- **Joy/delight** - pure fun, absurdist humor, wonder
- **Curiosity** - "wait, is that real?" rabbit holes
- **Warmth** - nostalgia, tenderness, human connection
- **Playfulness** - silly hypotheticals, "what if" energy
- **Weird internet specificity** - the actual strange corners of the web

## Reference Vibes

**StumbleUpon at its best:**
- Landing on a page about competitive duck herding
- Finding someone's passionate geocities shrine to a discontinued cereal
- A surprisingly well-researched article about the history of the color beige

**Not the vibe:**
- Existential dread listicles
- "I'm so quirky and anxious" millennial humor
- Everything framed through loneliness/sadness

## Questions to Explore

1. What topics make you go "wait, that's a thing?" with delight rather than dread?
2. How do we balance weird/specific with warm/inviting?
3. What categories are we missing entirely?
4. Should some prompts be enthusiastic instead of ironic?
5. What makes the difference between "charmingly obsessive" and "sad"?

## Files to Update

When we have a direction:
- `lib/topics.js` - the curated topic seeds (currently 120)
- `lib/prompts.js` - the generation instructions
- Then clear DB and reseed
