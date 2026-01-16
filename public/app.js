// PromptSpace Client

let currentPrompt = null;

// DOM Elements
const loading = document.getElementById('loading');
const stumbleBtn = document.getElementById('stumble-btn');
const copyBtn = document.getElementById('copy-btn');
const navRandom = document.getElementById('nav-random');
const shareBtn = document.getElementById('share-btn');

// Show/hide loading
function showLoading() {
  loading.style.display = 'flex';
}

function hideLoading() {
  loading.style.display = 'none';
}

// Render prompt to page
function renderPrompt(prompt) {
  currentPrompt = prompt;

  // Update URL without reload
  if (prompt.slug) {
    history.pushState({ slug: prompt.slug }, '', `/prompt/${prompt.slug}`);
    // Update URL input field
    const urlInput = document.getElementById('prompt-url');
    if (urlInput) {
      urlInput.value = `/prompt/${prompt.slug}`;
    }
  }

  // Update title
  document.title = `${prompt.prompt_name} | PromptSpace`;

  // Left column
  document.getElementById('profile-name').textContent = prompt.prompt_name;
  document.getElementById('contacting-header').textContent = `Contacting ${prompt.prompt_name}`;

  // Profile photo - colored square
  const photoEl = document.getElementById('profile-photo');
  const color = prompt.aesthetic?.colors?.[0] || '#666';
  photoEl.innerHTML = '';
  photoEl.style.background = color;

  // Quote based on font vibe
  document.getElementById('profile-quote').textContent = `"${prompt.aesthetic?.font_vibe || 'vibing'}"`;

  // Log metadata for v2 layout work
  console.log('🎨 Layout metadata:', {
    source: prompt.source,
    font_vibe: prompt.aesthetic?.font_vibe,
    background: prompt.aesthetic?.background,
    asl: prompt.aesthetic?.asl
  });

  // Show ASL in profile details
  const asl = prompt.aesthetic?.asl || '??/??/somewhere';
  document.getElementById('profile-details').innerHTML = asl;

  // Mood - extract from about_me
  const moods = ['chaotic', 'unhinged', 'chill', 'anxious', 'determined', 'confused', 'hopeful'];
  const aboutLower = (prompt.about_me || '').toLowerCase();
  const mood = moods.find(m => aboutLower.includes(m)) || 'vibing';
  document.getElementById('mood').textContent = mood;

  // Right column
  document.getElementById('the-prompt').textContent = prompt.the_prompt;
  document.getElementById('blurbs-header').textContent = `${prompt.prompt_name}'s Blurbs`;
  document.getElementById('about-me').textContent = prompt.about_me || '';
  document.getElementById('who-id-like-to-meet').textContent = prompt.who_id_like_to_meet || '';

  // Music player - split into artist and song title (format: "Artist - Title")
  const nowPlaying = prompt.aesthetic?.now_playing || 'Nothing playing';
  const songParts = nowPlaying.split(' - ');
  if (songParts.length >= 2) {
    document.getElementById('song-title').textContent = songParts[1];  // Title second
    document.getElementById('song-artist').textContent = songParts[0]; // Artist first
  } else {
    document.getElementById('song-title').textContent = nowPlaying;
    document.getElementById('song-artist').textContent = '';
  }

  // Interests table (If This Were A...) - in left column like MySpace
  const interestsTable = document.getElementById('interests-table');
  interestsTable.innerHTML = '';

  const metaphors = prompt.if_this_were_a || {};
  Object.entries(metaphors).forEach(([key, value]) => {
    const row = document.createElement('tr');
    row.style.cursor = 'pointer';
    row.dataset.type = key;
    row.dataset.value = value;

    // Convert key like "video_game" to "Video Game"
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    row.innerHTML = `
      <td>${escapeHtml(label)}</td>
      <td>${escapeHtml(value)}</td>
    `;

    row.addEventListener('click', () => handleMetaphorClick(key, value));
    interestsTable.appendChild(row);
  });

  // Top 8 friends - show random high friend count
  const fakeFriendCount = Math.floor(Math.random() * 800) + 47; // Random between 47-846
  document.getElementById('friend-header-name').textContent = `${prompt.prompt_name}'s Friend Space`;
  document.getElementById('friend-count').innerHTML = `${prompt.prompt_name} has <strong>${fakeFriendCount}</strong> friends.`;
  const friendGrid = document.getElementById('friend-grid');
  friendGrid.innerHTML = '';

  const top8 = prompt.top_8 || [];
  top8.forEach((friend, i) => {
    const friendEl = document.createElement('div');
    friendEl.className = 'friend-item';
    friendEl.dataset.name = friend.name;
    friendEl.dataset.vibe = friend.vibe;

    // Color from aesthetic
    const friendColor = prompt.aesthetic?.colors?.[i % 3] || '#999';

    friendEl.innerHTML = `
      <div class="friend-name">${escapeHtml(friend.name)}</div>
      <div class="friend-photo" style="background: ${friendColor};"></div>
    `;

    friendEl.addEventListener('click', () => handleFriendClick(friend));
    friendGrid.appendChild(friendEl);
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// API calls
async function fetchStumble() {
  const response = await fetch('/api/stumble');
  if (!response.ok) {
    throw new Error('Failed to fetch random prompt');
  }
  return response.json();
}

async function fetchPrompt(slug) {
  const response = await fetch(`/api/prompt/${encodeURIComponent(slug)}`);
  if (!response.ok) {
    throw new Error('Prompt not found');
  }
  return response.json();
}

async function resolvePrompt(name, vibe) {
  const response = await fetch('/api/prompt/resolve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, vibe })
  });
  if (!response.ok) {
    throw new Error('Failed to resolve prompt');
  }
  return response.json();
}

async function generateFromMetaphor(metaphor, parentId) {
  const response = await fetch('/api/generate/metaphor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ metaphor, parentId })
  });
  if (!response.ok) {
    throw new Error('Failed to generate prompt');
  }
  return response.json();
}

// Event handlers
async function handleStumble() {
  showLoading();
  stumbleBtn.disabled = true;
  try {
    const prompt = await fetchStumble();
    renderPrompt(prompt);
  } catch (error) {
    alert('Error: ' + error.message);
  } finally {
    hideLoading();
    stumbleBtn.disabled = false;
  }
}

async function handleFriendClick(friend) {
  showLoading();
  try {
    const prompt = await resolvePrompt(friend.name, friend.vibe);
    renderPrompt(prompt);
  } catch (error) {
    alert('Error: ' + error.message);
  } finally {
    hideLoading();
  }
}

async function handleMetaphorClick(type, value) {
  if (!value) return;

  showLoading();
  try {
    const prompt = await generateFromMetaphor(value, currentPrompt?.id);
    renderPrompt(prompt);
  } catch (error) {
    alert('Error: ' + error.message);
  } finally {
    hideLoading();
  }
}

function handleCopy(e) {
  if (e) e.preventDefault();
  const promptText = document.getElementById('the-prompt').textContent;
  navigator.clipboard.writeText(promptText).then(() => {
    copyBtn.textContent = '[Copied!]';
    setTimeout(() => copyBtn.textContent = '[Copy to Clipboard]', 2000);
  });
}

function handleShare() {
  if (currentPrompt?.slug) {
    const url = `${window.location.origin}/prompt/${currentPrompt.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    });
  }
}

// Initialize
async function init() {
  // Check URL for slug
  const path = window.location.pathname;
  const match = path.match(/^\/prompt\/(.+)$/);

  showLoading();
  try {
    if (match) {
      const slug = decodeURIComponent(match[1]);
      const prompt = await fetchPrompt(slug);
      renderPrompt(prompt);
    } else {
      const prompt = await fetchStumble();
      renderPrompt(prompt);
    }
  } catch (error) {
    console.error('Init error:', error);
    // Try stumble as fallback
    try {
      const prompt = await fetchStumble();
      renderPrompt(prompt);
    } catch (e) {
      alert('No prompts available. Make sure to run: npm run seed');
    }
  } finally {
    hideLoading();
  }
}

// Event listeners
stumbleBtn.addEventListener('click', handleStumble);
navRandom.addEventListener('click', (e) => {
  e.preventDefault();
  handleStumble();
});
document.getElementById('stumble-link').addEventListener('click', (e) => {
  e.preventDefault();
  handleStumble();
});
copyBtn.addEventListener('click', handleCopy);
// shareBtn might not exist anymore
if (document.getElementById('share-btn')) {
  document.getElementById('share-btn').addEventListener('click', handleShare);
}

// Handle browser back/forward
window.addEventListener('popstate', async (e) => {
  if (e.state?.slug) {
    showLoading();
    try {
      const prompt = await fetchPrompt(e.state.slug);
      renderPrompt(prompt);
    } finally {
      hideLoading();
    }
  }
});

// Start
init();
