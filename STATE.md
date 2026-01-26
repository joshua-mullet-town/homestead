# STATE.md - What We Know

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
