# PromptSpace Features Roadmap

## Current (v1)
- [x] Stumble to random prompts
- [x] MySpace-style profile pages for prompts
- [x] Top 8 prompt friends (clickable, generates if needed)
- [x] "If This Prompt Were A..." metaphors (clickable, generates new prompts)
- [x] Shareable URLs (/prompt/slug)
- [x] Copy prompt button
- [x] Coming Soon tooltips on unimplemented features

## Phase 2: User Accounts & Favorites

### Authentication Options
**Option A: Magic Link (Simplest)**
- Email-only auth, no passwords
- Send login link to email
- Session stored in cookie/JWT
- Pros: Simple, no password management
- Cons: Requires email infrastructure (Resend, SendGrid)

**Option B: OAuth Only**
- Google/GitHub login
- Pros: Very simple, no passwords, trusted
- Cons: Requires OAuth setup, some users may not want to link accounts

**Option C: Email + Password (Traditional)**
- Standard signup/login
- Password hashing with bcrypt
- Pros: Familiar to users
- Cons: More code, password reset flow needed

**Recommendation: Start with Magic Link + optional Google OAuth**

### Database Changes
```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  last_login INTEGER
);

-- User favorites (saved prompts)
CREATE TABLE favorites (
  user_id TEXT NOT NULL,
  prompt_id TEXT NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  PRIMARY KEY (user_id, prompt_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (prompt_id) REFERENCES prompts(id)
);

-- Collections (curated sets of prompts)
CREATE TABLE collections (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE collection_prompts (
  collection_id TEXT NOT NULL,
  prompt_id TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  added_at INTEGER DEFAULT (strftime('%s', 'now')),
  PRIMARY KEY (collection_id, prompt_id),
  FOREIGN KEY (collection_id) REFERENCES collections(id),
  FOREIGN KEY (prompt_id) REFERENCES prompts(id)
);
```

### New API Endpoints
```
POST /api/auth/magic-link     - Request login link
GET  /api/auth/verify         - Verify magic link token
POST /api/auth/logout         - Clear session
GET  /api/user/me             - Get current user

POST /api/favorites           - Add prompt to favorites
DELETE /api/favorites/:id     - Remove from favorites
GET  /api/favorites           - List user's favorites

POST /api/collections         - Create collection
GET  /api/collections         - List user's collections
GET  /api/collections/:id     - Get collection with prompts
POST /api/collections/:id/add - Add prompt to collection
DELETE /api/collections/:id   - Delete collection
```

### UI Changes
1. Login/Logout in top bar
2. Favorites page (list of saved prompts)
3. Collections page (user-created sets)
4. "Add to Favorites" button works
5. "Add to Collection" button opens collection picker

## Phase 3: Social Features

### Prompt Ownership
- Users can "claim" prompts they generate
- "Fork Prompt" creates a variant with credit to original
- User profiles showing their prompts and collections

### Discovery
- Browse public collections
- "Trending" prompts (most favorited recently)
- User leaderboard (most prompts generated)

## Phase 4: Submit & Edit

### User Prompt Submission
- Form to manually create prompts (no LLM)
- Moderation queue for new submissions
- Edit your own prompts

### Community Features
- "Suggest Edit" creates a pull-request-like flow
- Prompt versioning/history
- Comments or reactions

## Technical Debt / Improvements
- [ ] Switch to Postgres for production scale
- [ ] Add rate limiting per user
- [ ] Image generation for profile photos (DALL-E/Stable Diffusion)
- [ ] Better error handling on frontend
- [ ] Mobile responsive design
- [ ] PWA support
