const { v4: uuidv4 } = require('uuid');

function isValidHex(color) {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

function validatePrompt(data, source = 'seed', parentId = null) {
  // Ensure colors are valid hex codes
  let colors = ['#333333', '#666666', '#999999'];
  if (Array.isArray(data.aesthetic?.colors)) {
    colors = data.aesthetic.colors
      .slice(0, 3)
      .map(c => isValidHex(c) ? c : '#333333');
    while (colors.length < 3) {
      colors.push('#666666');
    }
  }

  // Validate top_8 items
  let top8 = [];
  if (Array.isArray(data.top_8)) {
    top8 = data.top_8.slice(0, 8).map(item => ({
      name: String(item.name || 'unknown_prompt').substring(0, 100),
      vibe: String(item.vibe || '').substring(0, 200)
    }));
  }

  return {
    id: uuidv4(),
    prompt_name: String(data.prompt_name || 'unnamed_prompt').substring(0, 100),
    the_prompt: String(data.the_prompt || 'No prompt generated').substring(0, 2000),
    about_me: String(data.about_me || '').substring(0, 1000),
    who_id_like_to_meet: String(data.who_id_like_to_meet || '').substring(0, 1000),
    aesthetic: {
      colors: colors,
      font_vibe: String(data.aesthetic?.font_vibe || '').substring(0, 200),
      background: String(data.aesthetic?.background || '').substring(0, 500),
      now_playing: String(data.aesthetic?.now_playing || '').substring(0, 200)
    },
    if_this_were_a: {
      video_game: String(data.if_this_were_a?.video_game || '').substring(0, 200),
      cocktail: String(data.if_this_were_a?.cocktail || '').substring(0, 200),
      font: String(data.if_this_were_a?.font || '').substring(0, 200),
      neighborhood: String(data.if_this_were_a?.neighborhood || '').substring(0, 200)
    },
    top_8: top8,
    source: source,
    parent_id: parentId
  };
}

module.exports = { validatePrompt };
