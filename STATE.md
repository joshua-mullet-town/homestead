# STATE.md - What We Know

## [2026-01-27 15:00] Path B Complete: Voice Dictation + Mobile Polish

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
