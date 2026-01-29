# PLAN.md - What We're Doing

## 🎯 CURRENT PRIORITIES

### ✅ COMPLETED PRIORITIES

1. **Skip Claude Code Text Style Prompt** - DONE
   - Added `"outputStyle": "Default"` to `~/.claude/settings.json` in cloud-init
   - Claude Code starts immediately without prompts

2. **Fix "Disconnected" State on Terminal Load** - DONE
   - Created detailed provisioning status screen
   - Polls droplet every 3 seconds showing 4 steps
   - **BONUS:** Added live provision.log streaming via SSH!
   - Shows real-time cloud-init progress (Node.js install, npm install, etc.)
   - Only navigates to terminal once everything is ready

3. **Add "Restart Dev Server" Button** - DONE
   - Added orange RESTART button to terminal UI
   - Sends PM2 restart command through Socket.IO
   - Shows spinning icon while restarting

---

## 🎯 NEXT PRIORITIES

### 1. Polish Provisioning Status Screen
**Ideas for improvement:**
- Color-code log lines (errors in red, success in green)
- Parse log timestamps and show "step took X seconds"
- Add progress bar (estimate based on typical timing)
- Show "Installing dependencies... (this usually takes 60s)" context

---

### 2. Handle Provisioning Failures Better
**Problem:** If cloud-init fails, user just sees "Taking longer than expected"

**Improvements:**
- Detect common errors (SSH key, npm install failure, port already in use)
- Show specific error messages with suggested fixes
- Add "View Full Log" button to see complete provision.log
- Add "Retry Provisioning" button

---

### 3. Session Management Improvements
**Ideas:**
- Show all active sessions on homepage with status
- Add "Stop Session" button (destroys droplet, saves money)
- Show cost estimate ("This session has cost $0.05 so far")
- Auto-shutdown after X minutes of inactivity

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
