# PLAN.md - What We're Doing

## 🎯 CURRENT PRIORITIES

### 1. Skip Claude Code Text Style Prompt
**Problem:** When Claude Code starts, it asks user to choose a text style (conversational/concise/code). This is annoying and delays getting to work.

**Goal:** Auto-configure Claude Code to skip this prompt and use a default style.

**Questions:**
- Is there a Claude Code setting we can pre-configure to skip this?
- Can we pass a flag like `--style=concise`?
- Is there a config file (`~/.claude/settings.json`) that controls this?

**Research needed:** Check Claude Code docs for text style configuration options.

---

### 2. Fix "Disconnected" State on Terminal Load
**Problem:** When user first opens terminal page, it shows "disconnected" status for 30+ seconds. User just stares at black screen. Bad UX.

**Goal:** Either connect faster OR show a better loading state with progress indicator.

**Possible causes:**
- Socket.IO connection takes time to establish?
- Cloud-init still running when user opens page?
- Frontend trying to connect before backend is ready?
- Race condition in terminal initialization?

**Investigation steps:**
1. Check if PM2 homestead process is already running when page loads
2. Add logging to see how long Socket.IO connection takes
3. Check if droplet is fully provisioned before showing terminal UI
4. Consider adding "Provisioning... (X% complete)" indicator

**UI improvements:**
- Show "Provisioning droplet..." with spinner
- Show "Connecting to terminal..." once port 3005 is open
- Only show "disconnected" if connection actually fails

---

### 3. Add "Restart Dev Server" Button
**Problem:** Dev server (Next.js on port 7087) sometimes crashes. User has no way to restart it without SSH access.

**Goal:** Add a button in the UI to restart the dev server via PM2.

**Implementation:**
1. **API Endpoint:** `POST /api/droplets/restart-dev-server`
   - Takes `sessionId` or `dropletId`
   - SSHs into droplet (or uses terminal command)
   - Runs: `export HOME=/root && pm2 restart dev-server`
   - Returns success/failure status

2. **UI Button:** Add to terminal page (next to preview toggle?)
   - Shows current dev server status (running/stopped/error)
   - Button: "Restart Dev Server"
   - Shows loading state while restarting
   - Shows success/failure toast

3. **Status Checking:** Optionally poll dev server status
   - Check if port 7087 is responding
   - Show "Dev server crashed" warning if down
   - Auto-suggest restart button

**Questions:**
- Should we auto-restart dev server if it crashes?
- Should we show dev server logs in UI?
- Should restart button be in preview iframe or terminal page?

---

## 🔮 FUTURE WORK (Not Urgent)

### Voice Dictation
- Whisper Village integration for voice commands
- Web Speech API fallback
- Mobile-friendly recording UI

### Mobile UX Polish
- PWA manifest for "add to home screen"
- Better touch targets
- Keyboard handling improvements
- Pinch-to-zoom terminal

### Droplet Management
- Auto-shutdown after inactivity
- Cost tracking (show $ per session)
- List all active sessions
- Manual stop button

### Multi-User Support
- User authentication (GitHub OAuth?)
- Personal droplet limits
- Session history per user

---

## ✅ COMPLETED WORK

See STATE.md for full history of completed features.
