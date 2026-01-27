# STATE.md - What We Know

## [2026-01-27 17:45] PATH A COMPLETE: Remote Terminal Server Working on 4GB Droplet

**MAJOR VICTORY**: Successfully deployed Claude Code-ready terminal server accessible from phone!

**Final working setup:**
- **DigitalOcean Droplet**: 4GB RAM, 2 vCPU ($24/month) - Ubuntu 22.04
- **IP Address**: 24.199.99.12
- **URL**: `http://24.199.99.12:3005/terminal/[sessionId]`
- **Terminal works from phone**: Full xterm.js terminal with Socket.IO streaming
- **Claude Code installed**: v2.1.20 (manually authenticated via setup-token)

### Critical Wins & Lessons Learned

#### 1. Node.js + Next.js RAM Requirements
- **1GB droplet**: Crashes constantly, OOM kills during compilation
- **2GB droplet**: Still crashes (tried both dev and production mode)
- **4GB droplet**: STABLE - This is the minimum for Next.js 16 + Socket.IO + xterm.js
- **Community recommendation**: 2GB minimum for simple Next.js, 4GB for production apps
- **Our stack needs 4GB** due to: Next.js dev mode + Socket.IO + xterm.js + node-pty

**Sources:**
- [Deploying Next.js on DigitalOcean](https://www.digitalocean.com/community/developer-center/deploying-a-next-js-application-on-a-digitalocean-droplet)
- [Next.js Memory Usage Issues](https://github.com/vercel/next.js/issues/79588)

#### 2. Node.js v20 IPv6 Binding Issue
**Problem**: Server listened on `[::1]:3005` (localhost IPv6 only), not accessible from phone
**Root cause**: Node.js v17+ defaults to IPv6, `'0.0.0.0'` doesn't bind to external interfaces
**Solution**: Use `'::'` as hostname - listens on ALL IPv4 + IPv6 interfaces
**Fix**: Changed `server.listen(port, '0.0.0.0')` to `server.listen(port, '::')`
**Verification**: `ss -tlnp | grep 3005` shows `*:3005 *:*` (all interfaces)

**Sources:**
- [Node v17 IPv6 default](https://github.com/nodejs/node/issues/40537)
- [NodeJS defaults to IPv6](https://github.com/nodejs/node/issues/18041)

#### 3. node-pty Platform-Specific Binaries
**Problem**: `invalid ELF header` - macOS binaries don't work on Linux
**Cause**: Pushing node_modules with macOS binaries, pulling on Linux droplet
**Solution**: Always run `npm rebuild node-pty` after git pull on droplet
**Prevention**: Add node_modules to .gitignore (we already have this, but binaries got in)

#### 4. Hardcoded Paths in Client Code
**Problem**: Terminal spawned with cwd `/Users/joshuamullet/code` (Mac path) on Linux
**Root cause**: Client-side page.tsx sent hardcoded path: `socket.emit('terminal:create', sessionId, '/Users/joshuamullet/code')`
**Solution**: Remove cwd parameter entirely, let server default to `process.env.HOME`
**Fix**: Changed to `socket.emit('terminal:create', sessionId)` (no cwd)

#### 5. Claude Code Authentication Strategy
**Manual setup (what we did)**:
1. SSH into droplet
2. Run `claude setup-token`
3. Get long-lived API key from claude.ai
4. Paste into terminal
5. Token stored in `~/.claude/config.json`

**For automation** (research needed):
- Long-lived API keys from claude.ai can be scripted
- Can potentially inject token into config.json via cloud-init
- Need to research: does setup-token still work, or new auth required?

#### 6. PM2 Process Management Pitfalls
- **PM2 restart**: Doesn't reload code from disk, uses in-memory cache
- **Proper reload**: `pm2 delete all && pm2 start ecosystem.config.js && pm2 save`
- **max_memory_restart**: Don't set it - causes artificial crashes
- **Auto-start on reboot**: `pm2 startup && pm2 save` (we did this)

### Current Droplet Configuration

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: "homestead",
    script: "./server.js",
    cwd: "/root/homestead",
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: "development",
      GH_TOKEN: "<github-personal-access-token>"
    }
  }]
};
```

**Installed software:**
- Node.js v20.20.0
- npm v10.8.2
- git v2.34.1
- Claude Code CLI v2.1.20
- PM2 v6.0.14 (with systemd integration)

**SSH key**: `~/.ssh/homestead_droplet` (ed25519, added to DO account)
**GitHub PAT**: Set as `GH_TOKEN` environment variable (token stored securely, not in repo)

### What Works Now
✅ Terminal page loads from phone
✅ Socket.IO connects successfully
✅ Terminal spawns in /root directory
✅ Commands work (ls, cd, etc.)
✅ Claude Code CLI installed and **FULLY AUTHENTICATED via ANTHROPIC_API_KEY**
✅ GitHub PAT set as GH_TOKEN environment variable
✅ Server auto-starts on droplet reboot (PM2 + systemd)
✅ **Claude Code responds to prompts** - tested with `claude "what is 2+2"` → works!

### Claude Code Authentication - SOLVED ✅

**Solution:** Use `ANTHROPIC_API_KEY` environment variable (NOT `CLAUDE_CODE_OAUTH_TOKEN`)
- API key from console.anthropic.com (format: `sk-ant-api03-...`)
- Set in PM2 ecosystem.config.js under `env.ANTHROPIC_API_KEY`
- Claude Code automatically uses this for API billing
- **No interactive setup-token required!**

**For cloud-init automation:**
```yaml
runcmd:
  - echo 'export ANTHROPIC_API_KEY="sk-ant-api03-..."' >> /root/.bashrc
  - export ANTHROPIC_API_KEY="sk-ant-api03-..."
```

### What's Next (See PLAN.md)
- [ ] Auto-provision droplets via API
- [ ] Auto-authenticate Claude Code (script setup-token)
- [ ] Auto-detect and start Next.js projects (npm run dev)
- [ ] Preview iframe for dev servers
- [ ] Cloudflare tunnel for HTTPS + microphone access

---

## [2026-01-27 16:05] Voice Dictation Blocked by Chrome Security

**Problem discovered**: Chrome blocks microphone/speech API on ALL non-localhost domains, including:
- Cloudflare tunnel (even with valid HTTPS cert)
- Self-signed HTTPS certificates
- IP addresses (10.0.0.142)
- `.local` domains

**Even `http://localhost` failed** with `not-allowed` error, suggesting:
- macOS system microphone permission not granted to Chrome, OR
- Mac microphone disabled/not available, OR
- Chrome global microphone setting blocking it

**What we tried**:
- HTTPS with self-signed cert (failed - cert not trusted)
- Cloudflare tunnel with valid cert (failed - domain not whitelisted)
- HTTP on localhost (failed - system permission issue?)
- Web Speech API (same `not-allowed` error)
- Manual Chrome microphone allow list (no effect)

**Why holler-next works**: Uses `http://localhost:3002` and apparently has system mic permission

**Decision**: **Defer voice to Phase 2** or post-deployment with real domain
- Voice requires proper production deployment with real domain + SSL
- Not solvable in local development with current Chrome security policies
- Alternative: Use phone's native dictation and paste (Gboard voice typing)

**Files created during investigation**:
- `/app/mic-test/page.tsx` - MediaRecorder test page
- `/app/speech-test/page.tsx` - Web Speech API test page
- `/components/VoiceRecorder.tsx` - Native MediaRecorder implementation (blocked)

---

## [2026-01-27 15:00] Path B Partial: Terminal + Mobile Polish (No Voice)

**What we built:**
- Voice recording UI component at bottom of terminal page (VoiceRecorder.tsx)
- Three-phase workflow: Record → Transcribe → Preview → Send
- WaveSurfer.js waveform visualization (orange/yellow theme)
- OpenAI Whisper transcription API endpoint (`/api/transcribe/route.ts`)
- Font size controls in terminal header (10-32px, zoom in/out buttons)
- PWA manifest for "Add to Home Screen" on mobile
- Touch-optimized buttons (48px min height, no keyboard shortcuts)

**Voice recording flow:**
1. Tap RECORD button → WaveSurfer shows live waveform
2. Choose: STOP (cancel), PREVIEW (transcribe+edit), or SEND (transcribe+send immediately)
3. Preview mode shows editable textarea with transcribed text
4. SEND button submits text to terminal (simulates typing with 10ms delay per char)

**Key learnings:**
- Adapted holler-next's AudioWorkstation for mobile (removed keyboard shortcuts, larger buttons)
- WaveSurfer RecordPlugin handles audio capture + visualization in one
- Message sending simulates typing: splits text into chars, emits with delay, sends Enter
- Font size must trigger terminal refresh (useEffect watching fontSize state)
- PWA manifest enables standalone mode on iOS/Android

**Transcription architecture:**
- **Current:** OpenAI Whisper API (~$0.02/min, cloud-based, 2-5s latency)
- **Investigated:** Whisper Village uses local whisper.cpp (C++, 100% offline, <1s latency)
- **Recommendation:** Add Web Speech API as free fallback for MVP, consider local whisper.cpp on droplet later
- **Implementation:** Transcription backend is abstracted, easy to swap providers

**Files created/modified:**
- `/components/VoiceRecorder.tsx` (316 lines) - Mobile voice recording component
- `/app/api/transcribe/route.ts` (68 lines) - OpenAI Whisper API endpoint
- `/app/terminal/[sessionId]/page.tsx` - Added VoiceRecorder at bottom, font size controls in header
- `/app/layout.tsx` - Added PWA manifest link + icon metadata
- `/public/manifest.json` - PWA configuration
- `/public/icon-*.png` - App icons (192x192, 512x512)

**Mobile polish checklist:**
- ✅ Voice recording (WaveSurfer visualization)
- ✅ Font size controls (zoom in/out)
- ✅ PWA manifest (add to home screen)
- ✅ Touch-friendly buttons (48px min height)
- ✅ Full-screen terminal layout
- ✅ Bottom recording bar (doesn't block terminal)

**Path B Status:** Complete and ready for testing on mobile

---

## [2026-01-27 11:30] Droplet Infrastructure Research

**Research findings for Path A implementation:**

### Claude Code Authentication on Remote Servers
- Current Claude Code CLI requires OAuth through local browser (not headless-friendly)
- **SSH port forwarding workaround**: Run `claude /login` on remote server, forward port with `ssh -L`, complete OAuth on local machine, token transmits back to remote
- For automated setup: Can use GitHub PAT via environment variable (`GH_TOKEN`) which GitHub CLI recognizes by default
- Note: GitHub MCP server has separate auth from gh CLI (would need separate PAT)

### DigitalOcean Droplet Provisioning Time
- **Typical provisioning: "a few minutes"** (some sources say 10-15 minutes for full setup)
- Droplet shows IP address when ready
- API flow: POST to `/v2/droplets` → provisioning → IP available
- Billing: CPU droplets billed per-second (minimum 60s or $0.01) as of Jan 2026
- **Conclusion**: Sub-60s goal is aggressive but possible with cloud-init

### Cloud-Init for Node.js Setup
- DigitalOcean supports cloud-init on Ubuntu/CentOS images
- Can install packages, configure services, set up SSH keys automatically
- Script runs as root on first boot
- Example: Install Node.js, npm, git, clone repo, start services
- Must start with `#cloud-config` on first line

### Accessing Multiple Ports from Mobile
- **Same IP, different ports works fine**: `http://<ip>:3005` for terminal, `http://<ip>:3000` for dev server
- Mobile browsers handle port numbers in URLs without issue
- Local network access (same Wi-Fi): Just use IP:port directly
- Remote access: Can use ngrok, cloudflared, or expose ports directly
- **Decision**: Start with raw IP addresses + port numbers, add domain later if needed

**Next steps:** Manual droplet creation and testing the full flow.

**Sources:**
- [Claude Code Remote Authentication Issue #7100](https://github.com/anthropics/claude-code/issues/7100)
- [Claude Code SDK Docker Authentication Docs](https://github.com/cabinlab/claude-code-sdk-docker/blob/main/docs/AUTHENTICATION.md)
- [DigitalOcean API Overview](https://docs.digitalocean.com/reference/api/)
- [DigitalOcean Cloud-Init Tutorial](https://www.digitalocean.com/community/tutorials/how-to-use-cloud-config-for-your-initial-server-setup)
- [Accessing Localhost from Mobile Devices](https://www.silvestar.codes/articles/testing-localhost-on-multiple-devices/)

---

## [2026-01-26 15:45] Terminal Streaming Working on Mobile

**What we built:**
- Custom Next.js server with Socket.IO and TerminalManager
- Terminal page at `/terminal/[sessionId]` with xterm.js integration
- Mobile-friendly Socket.IO connection (dynamic hostname)

**Key learnings:**
- node-pty v1.0.0 works, v1.1.0 fails with `posix_spawnp failed` error
- Must use exact holler-next pattern: no fallback shell, explicit cwd
- Socket.IO client must use `window.location.hostname` not `localhost` for mobile access
- Terminal works perfectly on iPhone over local network

**Files created/modified:**
- `/server.js` - TerminalManager class, Socket.IO handlers, PTY spawning
- `/app/terminal/[sessionId]/page.tsx` - xterm.js terminal with Socket.IO integration
- `/app/layout.tsx` - Added xterm CSS import
- `/package.json` - Added terminal deps, changed dev script to `node server.js`

---

## [2026-01-26 14:20] Tailwind v3 Downgrade Fixed Grid Layout

**Problem:** Tailwind utility classes (grid, gap, max-w) not applying
**Root cause:** Homestead had Tailwind v4.0.0 beta, incompatible config system
**Solution:** Downgraded to v3.4.1, added PostCSS config, installed autoprefixer

**Key learnings:**
- Always check Tailwind version before debugging layout issues
- v4 has completely different configuration system from v3
- PostCSS config required for v3: `tailwindcss` and `autoprefixer` plugins

---

## [2026-01-26 13:50] Icon and Layout Fixes

**Problem:** SVG icons without explicit dimensions expanded to fill container
**Solution:** Added `width="24" height="24"` to all inline SVG components

**Problem:** Buttons stacked vertically despite `grid grid-cols-2`
**Root cause:** Each button wrapped in `<div className="relative">` which became grid item
**Solution:** Removed wrapper div, moved `key` to button directly

**Key learnings:**
- Always set explicit width/height on SVG elements
- Grid/flex layouts break if you wrap grid items in extra containers
- Remove `w-full` from grid items that should size to content

---

## [2026-01-26 13:00] Project Started - Homestead

**Vision:** Mobile-first cloud development environment
- Browse GitHub repos from phone
- Spin up DigitalOcean droplets with Claude Code
- View terminal and preview hosted pages remotely
- Use voice dictation to send commands

**Initial setup:**
- Next.js 16.1.1 with App Router
- GitHub integration (public + private repos with PAT)
- Retro UI design (VT323 font, orange/yellow/red theme)
- Repo visibility settings (localStorage)
