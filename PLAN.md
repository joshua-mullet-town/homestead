# PLAN.md - What We're Doing

## Current Sprint: Two Parallel Paths

We're using git worktrees to work on droplet infrastructure and mobile frontend simultaneously.

---

## Path A: Droplet Infrastructure (Backend)

**Goal:** Prove Claude Code can run on remote droplet and be accessed from phone

### Next Steps (In Order)

1. **Manual Droplet Setup**
   - Create DigitalOcean droplet (Ubuntu 22.04, basic plan)
   - SSH in, install Node.js, npm, git
   - Install Claude Code CLI
   - Clone a test Next.js repo
   - Test running Claude Code manually

2. **GitHub Authentication on Droplet**
   - Research how others handle GitHub OAuth on remote servers
   - Try manual `claude auth` on droplet (what does this require?)
   - Document what credentials/tokens need to be injected
   - Script the auth process (env vars? GitHub App? Personal token?)

3. **Deploy Terminal Server to Droplet**
   - Copy homestead repo to droplet
   - Run `npm install`, start server
   - Expose port 3005 (or use nginx reverse proxy?)
   - Test connecting from phone via droplet's IP

4. **Claude Code + Next.js Dev Server**
   - Start Claude Code session on droplet
   - Give it instructions to run `npm run dev` on test repo
   - Expose dev server port (usually 3000)
   - Test accessing preview from phone

5. **Full Flow Test**
   - Open terminal on phone
   - Send Claude Code instructions via terminal
   - Claude Code makes changes to Next.js app
   - Preview updates in real-time
   - **If this works, we've proven the concept!**

6. **Automate Droplet Provisioning**
   - DigitalOcean API integration
   - Cloud-init script for setup
   - Auto-shutdown after inactivity (30min?)
   - DNS/subdomain management

---

## Path B: Mobile Frontend (UX)

**Goal:** Make mobile experience smooth and voice-friendly

### Next Steps (In Order)

1. **Preview Page Implementation**
   - Create `/app/preview/[sessionId]/page.tsx`
   - Iframe to droplet's dev server (port 3000)
   - Handle loading states, errors
   - Full-screen preview on mobile

2. **Navigation Between Terminal and Preview**
   - Add simple nav bar or floating button
   - Switch between `/terminal/[sessionId]` and `/preview/[sessionId]`
   - Remember last viewed (localStorage?)
   - Smooth transitions

3. **Voice Dictation MVP (Web Speech API)**
   - Add record button to terminal page
   - Use browser's Web Speech API (works on iOS/Android)
   - Show visual feedback (recording, transcribing)
   - Display transcription before sending
   - Cancel button if transcription is wrong
   - Send button to submit to terminal

4. **Mobile UX Polish**
   - Increase terminal font size (or add zoom controls)
   - PWA manifest for "add to home screen"
   - Better touch targets (buttons at least 44x44px)
   - Handle iOS keyboard show/hide gracefully
   - Test on iPhone Safari and Chrome

5. **Cloud Transcription Fallback (If Needed)**
   - If Web Speech API is too inaccurate
   - Add Deepgram or OpenAI Whisper API
   - Record audio, send to API, display result
   - Handle errors, loading states

---

## Backlog (Future Features)

- Session management (list active sessions, kill sessions)
- Multiple concurrent droplets
- Cost tracking (DigitalOcean billing)
- Collaborative sessions (multiple people in same terminal?)
- Save terminal history/logs
- Dark mode toggle
- Terminal themes (like holler-next has)

---

## Blockers / Unknowns

- **Droplet provisioning time:** How long from API call to ready? (Target: <60s)
- **GitHub OAuth on droplet:** What's the cleanest approach?
- **Domain management:** Do we need unique subdomains per session?
- **Web Speech API accuracy:** Good enough for coding? Or need cloud transcription?
- **Cost:** How much do droplets cost per hour? Auto-shutdown critical?

---

## Completed

(Items will be moved here from top of list when finished, then consolidated into STATE.md)
