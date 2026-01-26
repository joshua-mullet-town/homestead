# Homestead - Cloud Development Environment

## Memory System

**Every new agent should read these files FIRST:**

### STATE.md - What We Know (The Past)
- **Location:** `/Users/joshuamullet/code/homestead/STATE.md`
- **Contains:** Facts, lessons learned, accomplished work
- **Organization:** Newest entries at top with **full timestamps** (date AND time, e.g., `[2026-01-26 14:30]`)

### PLAN.md - What We're Doing (The Future)
- **Location:** `/Users/joshuamullet/code/homestead/PLAN.md`
- **Contains:** Current work, next steps, active tasks
- **Organization:** Current task at top, priority order descending

### The Workflow (Scoop & Consolidate)
1. Work on top item in PLAN.md
2. When completed: scoop it off the top
3. Consolidate into concise learning
4. Drop at top of STATE.md with **full timestamp** (date + time)

---

## Project Vision

Homestead is a **mobile-first cloud development environment** that lets you:
1. Browse your GitHub repos and issues from your phone
2. Spin up a DigitalOcean droplet with Claude Code running
3. View and interact with the terminal remotely
4. Preview hosted pages (npm run dev) from the droplet
5. Use voice dictation to send commands/messages
6. Work on Next.js projects from anywhere

**Target User:** Developers who want to code from their phone while away from their desk.

---

## Current Status (2026-01-26)

### ✅ What's Working
- **Terminal streaming**: Socket.IO + node-pty + xterm.js (based on holler-next architecture)
- **Mobile terminal access**: Can view/interact with terminal from phone on local network
- **GitHub integration**: Fetches user's repos (public + private with PAT)
- **Retro UI**: VT323 font, pixel art aesthetic, orange/yellow/red theme
- **Hide/show repos**: LocalStorage settings for repo visibility

### 🚧 Two Parallel Work Streams

We're working on TWO separate paths simultaneously using git worktrees:

#### **Path A: Droplet Infrastructure** (Backend/DevOps)
**Goal:** Prove you can run Claude Code on a remote droplet and access it from your phone

**Steps:**
1. Manually spin up a DigitalOcean droplet
2. Install Claude Code on the droplet
3. Set up GitHub OAuth/authentication (so Claude Code has repo access)
4. Run the terminal server (Socket.IO + node-pty) on the droplet
5. Expose it publicly so phone can connect
6. Clone a Next.js repo and run `npm run dev` via Claude Code
7. Expose the dev server so you can preview from phone
8. Test full flow: open terminal on phone → give Claude Code instructions → see preview
9. **THEN** automate droplet provisioning (spin up/down on demand)

**Unknowns:**
- How long does droplet provisioning take? (Target: <1 minute)
- How to script GitHub OAuth on droplet?
- Do we need separate domains/subdomains for each session?
- Auto-shutdown logic (inactivity timeout? manual stop button?)

#### **Path B: Mobile Frontend** (UX/UI)
**Goal:** Make the mobile experience smooth and voice-friendly

**Features Needed:**
1. **Toggle between terminal and preview**
   - Simple nav or floating button to switch views
   - Terminal page (`/terminal/[sessionId]`)
   - Preview page (`/preview/[sessionId]`) - iframe to droplet's dev server
2. **Voice dictation**
   - Record button (start/stop)
   - Visual feedback (recording, transcribing, sending)
   - Show transcription before sending (edit if needed)
   - Cancel recording if you don't like it
   - **Transcription options (in priority order):**
     1. Local (like Whisper Village) if feasible
     2. Web Speech API (built-in browser, works on mobile)
     3. Cloud transcription (Deepgram/Groq/OpenAI) as fallback
3. **Mobile UX improvements**
   - Larger terminal text (zoom/pinch support?)
   - PWA manifest (add to home screen, looks like app)
   - Better touch targets for mobile
   - Keyboard handling (show/hide iOS keyboard)

---

## Technical Architecture

### Stack
- **Frontend:** Next.js 16.1.1, React 19, Tailwind CSS v3.4.1
- **Terminal:** Socket.IO v4.8.3, node-pty v1.0.0 (NOT 1.1.0!), xterm.js v6.0.0
- **Backend:** Custom Next.js server (server.js) with Socket.IO
- **Fonts:** VT323 (monospace), Righteous (headings), Rubik (body)
- **Colors:** Orange (#FF6600), Yellow (#FFCC00), Red (#FF3333), Black, White, Green (#00FF66)

### Key Files
- `/server.js` - Custom Next.js server with TerminalManager and Socket.IO handlers
- `/app/page.tsx` - Main GitHub repos/issues dashboard
- `/app/terminal/[sessionId]/page.tsx` - Terminal view with xterm.js
- `/app/layout.tsx` - Root layout, imports xterm CSS
- `/app/globals.css` - Tailwind config, fonts, retro styling

### Important Technical Notes

#### node-pty Version
**CRITICAL:** Must use node-pty v1.0.0, NOT v1.1.0
- v1.1.0 causes `posix_spawnp failed` error on macOS
- holler-next uses v1.0.0 successfully
- Always match holler-next's proven config

#### Socket.IO Connection
Client must use dynamic host for mobile access:
```typescript
const socketUrl = typeof window !== 'undefined'
  ? `http://${window.location.hostname}:3005`
  : 'http://localhost:3005';
```

#### Terminal Spawning (from holler-next)
```javascript
const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
const ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 24,
  cwd: '/Users/joshuamullet/code', // NOT /tmp, NOT process.cwd()
  env: process.env
});
```

---

## Development Workflow

### Running the Server
```bash
cd /Users/joshuamullet/code/homestead
npm run dev  # Runs `node server.js`
```

Server runs on port 3005:
- `http://10.0.0.142:3005` - Main GitHub dashboard
- `http://10.0.0.142:3005/terminal/[sessionId]` - Terminal view

### Using Git Worktrees (For Parallel Work)
```bash
# Create worktree for droplet work
git worktree add ../homestead-droplet droplet-infrastructure

# Create worktree for frontend work
git worktree add ../homestead-mobile mobile-frontend

# Work in parallel, merge when ready
```

---

## Droplet Provisioning Plan (Future)

### Manual Setup (Step 1)
1. Create DigitalOcean droplet (Ubuntu 22.04)
2. SSH in, install Node.js, npm, Claude Code
3. Clone this repo, run `npm install`
4. Set up GitHub OAuth (research needed)
5. Run server, expose ports
6. Test from phone

### Automated Setup (Step 2)
1. DigitalOcean API for droplet creation
2. Cloud-init script to install dependencies
3. GitHub OAuth token injection (env var?)
4. Auto-start server on boot
5. DNS/subdomain management (one per session?)
6. Auto-shutdown after 30min inactivity

### Session Lifecycle
```
User clicks repo/issue → API call to create droplet →
Wait for ready (~60s?) → Show terminal + preview →
User works → Detect inactivity → Shutdown droplet
```

---

## Voice Dictation Architecture (To Be Designed)

### Holler-Next Pattern (Reference)
- Whisper Village integration for local transcription
- Socket.IO streaming of audio chunks
- Real-time transcription display
- Send button to submit to terminal

### Homestead Approach (TBD)
**Option 1: Web Speech API (Simplest)**
- Built into browsers, works on iOS/Android
- No server needed, instant transcription
- Less accurate than Whisper
- Good for MVP

**Option 2: Cloud Transcription (Fallback)**
- Deepgram/Groq/OpenAI Whisper API
- Record audio in browser, send to API
- Fast, accurate, but requires internet + costs money

**Option 3: Whisper Village Integration (Ideal)**
- Reuse existing local Whisper setup
- Requires Whisper Village running on phone or nearby Mac
- Best accuracy, no cost, but complex setup

**Decision:** Start with Web Speech API for MVP, add cloud fallback if needed.

---

## Next Steps

See PLAN.md for current tasks. Remember to update STATE.md when completing work.

---

## Reference Projects

- **holler-next** (`/Users/joshuamullet/code/holler/holler-next`): Terminal streaming implementation (source of truth for Socket.IO + node-pty)
- **mullet-town** (`/Users/joshuamullet/code/mullet-town`): UI/font inspiration (VT323, retro styling)
- **Whisper Village** (`/Users/joshuamullet/code/whisper-village`): Voice dictation reference

---

## Important Instructions

Do what has been asked; nothing more, nothing less.
NEVER create files unless absolutely necessary.
ALWAYS prefer editing existing files over creating new ones.
