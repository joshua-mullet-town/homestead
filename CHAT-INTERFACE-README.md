# Chat Interface - Claude Code with Retro UI

## What This Is

I've added a **chat-style interface** for Claude Code alongside your existing terminal. It's a mobile-friendly, retro-styled UI that shows Claude's work in a more structured way than the raw terminal.

## How It Works

### Architecture

```
User opens /chat/[sessionId]
  ↓
Frontend calls /api/chat/start (spawns Claude process)
  ↓
Backend uses ClaudeProcessManager (extracted from CUI)
  ↓
Claude outputs events (JSONL or plain text)
  ↓
Events streamed to frontend via Server-Sent Events (SSE)
  ↓
Retro UI renders events as cards (messages, file edits, errors)
```

### Files Added

**Backend:**
- `/lib/claude-process-manager.ts` - Manages Claude CLI processes
- `/app/api/chat/start/route.ts` - Start Claude session
- `/app/api/chat/stream/[sessionId]/route.ts` - SSE event stream
- `/app/api/chat/message/route.ts` - Send messages to Claude

**Frontend:**
- `/app/chat/[sessionId]/page.tsx` - Retro chat UI
- Updated `/app/terminal/[sessionId]/page.tsx` - Added "CHAT" button

## How to Use

### From Terminal Page:

1. Open any terminal: `/terminal/[sessionId]?ip=...`
2. Click the yellow **"CHAT"** button in the header
3. Chat interface opens with Claude running

### From Issue Detail Page:

The "START SESSION" button still works as before (opens terminal). To use chat instead, you'd need to modify the button to point to `/chat/[sessionId]` instead of `/terminal/[sessionId]`.

### Chat Interface Features:

✅ **Auto-start** - Claude session starts automatically when you open the page
✅ **Real-time streaming** - See Claude's responses as they happen
✅ **Message types** - Different card styles for:
  - Regular messages (white cards)
  - File edits (with file name)
  - Bash command outputs (black terminal-style)
  - Errors (red cards)
  - Completion status (green)
✅ **Retro styling** - VT323 font, shadow-retro cards, your color scheme
✅ **Mobile-friendly** - Input at bottom, messages scroll, touch-optimized
✅ **Back to terminal** - Arrow button to return to terminal view

## Current Status

### ✅ Fixed Issues

**Circular Dependency (2026-01-27)**
- Fixed circular dependency in API routes that was causing "Cannot access 'process1' before initialization" error
- Created `/lib/claude-manager-singleton.ts` to manage ClaudeProcessManager instance
- All API routes now import from singleton instead of from each other

## Current Limitations

### 1. **Claude Output Format**
The process manager tries to parse JSONL (JSON Lines) events from Claude, but Claude Code CLI might just output plain text. In that case, all output shows as generic "message" cards.

**To investigate:** Check if Claude Code outputs JSONL or plain text by monitoring the chat interface.

### 2. **Auto-Start Prompt**
Currently starts with: "Hello! I'm ready to help. What would you like me to do?"

**To improve:** Could auto-start with the issue description:
```typescript
initialPrompt: `Fix issue #${issueNumber}: ${issueTitle}\n\n${issueBody}`
```

### 3. **Working Directory**
Hardcoded to `/root/workspace` for now. Should get this from droplet session metadata.

### 4. **No Permissions Prompt**
Uses `dangerouslySkipPermissions: true` to auto-approve everything. In production, you'd want proper permission handling.

### 5. **Process Management**
Process manager is in-memory. If Next.js server restarts, all Claude sessions are lost. For production, would need to:
- Track processes in database
- Re-attach to running processes on restart
- Or run as separate service

## Next Steps for Other Developer

The other developer working on droplet automation can:

1. **Ignore this for now** - It's completely separate from terminal flow
2. **Or integrate it** by:
   - Modifying cloud-init to auto-start Claude with issue prompt
   - Pointing "START SESSION" button to `/chat/` instead of `/terminal/`
   - Passing working directory to the chat page

## Testing the Chat Interface

### Local Testing (Without Droplet):

**Won't work yet** because:
- Needs Claude Code CLI installed locally
- Needs ANTHROPIC_API_KEY in environment
- Tries to spawn `claude` command

### With Droplet:

1. Wait for droplet provisioning to complete
2. SSH into droplet: `ssh root@DROPLET_IP`
3. Make sure Claude is installed: `which claude`
4. Make sure API key is set: `echo $ANTHROPIC_API_KEY`
5. Open chat page: `http://DROPLET_IP:3005/chat/SESSION_ID?dir=/root/workspace`

## How to Test Locally (Quick Setup)

The chat interface is ready to test locally:

```bash
# 1. Make sure Claude Code CLI is installed (already done ✅)
which claude  # Should show path

# 2. API key should be in .env.local (already done ✅)

# 3. Server should be running (already running ✅)
# If not: npm run dev

# 4. Open chat interface
# http://localhost:3005/chat/test-session?dir=/Users/joshuamullet/code/homestead
```

**What to expect:**
1. Chat page should load with retro UI
2. "STARTING CLAUDE..." indicator should appear briefly
3. Connection indicator should turn green
4. Claude should send an initial greeting message
5. You can type messages and see Claude's responses

## Styling

Uses your existing retro theme:
- VT323 font for Claude messages
- Rubik font for user messages
- `card-white`, `card-green`, `card-red` classes
- `shadow-retro-lg` shadows
- Orange background
- Black borders

## Mobile Optimizations

- Fixed header with back/terminal buttons
- Scrollable message area
- Fixed input at bottom (iOS keyboard-friendly)
- Auto-scroll to latest message
- Touch-optimized buttons
- No complex interactions needed

## Questions?

This is all **separate** from the terminal, so it won't interfere with the other developer's work. You can:
- Try it out when ready
- Modify it to fit your workflow
- Or ignore it entirely and stick with terminal

Let me know if you want me to:
1. Change the auto-start prompt
2. Add better error handling
3. Improve the UI styling
4. Add more message type renderers
5. Integrate with issue detail page
