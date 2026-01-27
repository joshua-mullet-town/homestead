# PLAN.md - What We're Doing

## ✅ PATH A COMPLETE - Now Automating

**Manual setup proven successful!** Terminal server working on 4GB droplet with Claude Code installed.

---

## Current Priority: Automation Phase

### 1. Automate Droplet Provisioning (HIGH PRIORITY)

**Goal:** User clicks repo → Droplet spins up automatically → Terminal ready in <2 minutes

**Implementation Plan:**
```javascript
// UI flow: User clicks repo card → API call
POST /api/droplets/create
{
  repoUrl: "https://github.com/user/repo",
  repoName: "my-nextjs-app"
}

// Server creates droplet with cloud-init
- Install Node.js v20, npm, git
- Install Claude Code CLI
- Clone selected repo
- Run npm install
- Start PM2 with homestead terminal server
- Auto-start on boot (systemd)
```

**Cloud-init script structure:**
```yaml
#cloud-config
packages:
  - curl
  - git

runcmd:
  - curl -fsSL https://deb.nodesource.com/setup_20.x | bash
  - apt-get install -y nodejs
  - npm install -g npm@latest
  - npm install -g pm2
  - npm install -g @anthropic/claude-code
  - git clone https://github.com/user/repo /root/project
  - cd /root/project && npm install
  # TODO: Claude Code auth injection
  # TODO: Start terminal server
  - pm2 startup
  - pm2 save
```

**DigitalOcean API endpoints needed:**
- `POST /v2/droplets` - Create with cloud-init
- `GET /v2/droplets/{id}` - Check status
- `DELETE /v2/droplets/{id}` - Cleanup
- `GET /v2/droplets/{id}/actions` - Monitor provisioning

**Pricing:** $24/month = $0.036/hour for 4GB droplet (billed per-second, $0.01 minimum)

---

### 2. Automate Claude Code Authentication (HIGH PRIORITY)

**Research findings:**

Based on [Claude Code authentication docs](https://github.com/cabinlab/claude-code-sdk-docker/blob/main/docs/AUTHENTICATION.md) and [headless auth issue](https://github.com/anthropics/claude-code/issues/7100):

**Option A: setup-token (Current Manual Method)**
- Run `claude setup-token` on droplet
- Requires Claude subscription
- Creates long-lived token in `~/.claude/.credentials.json`
- **Problem:** Requires interactive input (not automatable)

**Option B: Environment Variable (RECOMMENDED)**
- Set `CLAUDE_CODE_OAUTH_TOKEN` env variable
- Claude Code prioritizes env vars over subscription
- **Charges via API pay-as-you-go** (not subscription)
- Can be injected via cloud-init
- **Need to research:** How to get long-lived OAuth token from claude.ai

**Option C: Credentials File Injection**
- Generate token once on local machine
- Copy `~/.claude/.credentials.json` to droplet via cloud-init
- **Problem:** Tokens expire, need refresh mechanism

**TODO: Research current Anthropic API token generation**
- Check claude.ai account settings for "API Keys" or "Long-lived tokens"
- Test if Anthropic Console has changed auth flow (2026 updates)
- Determine if subscription vs API billing matters for this use case

**Implementation (once we have token):**
```yaml
# In cloud-init:
runcmd:
  - export CLAUDE_CODE_OAUTH_TOKEN="<token-from-user-settings>"
  - echo 'export CLAUDE_CODE_OAUTH_TOKEN="<token>"' >> /root/.bashrc
```

---

### 3. Auto-Detect and Start Next.js Projects (MEDIUM PRIORITY)

**Goal:** If repo is Next.js, automatically run `npm run dev` on startup

**Detection logic:**
```javascript
// In homestead terminal server startup
function isNextJsProject(repoPath) {
  const packageJson = JSON.parse(fs.readFileSync(`${repoPath}/package.json`));

  // Check for Next.js dependency
  if (packageJson.dependencies?.next || packageJson.devDependencies?.next) {
    return true;
  }

  // Check for "dev" script with "next dev"
  if (packageJson.scripts?.dev?.includes('next dev')) {
    return true;
  }

  return false;
}

// If Next.js detected, start dev server
if (isNextJsProject('/root/project')) {
  // Start in background with PM2
  exec('cd /root/project && pm2 start npm --name "dev-server" -- run dev');
}
```

**Sources:**
- [Next.js package.json structure](https://chris.lu/web_development/tutorials/next-js-static-first-mdx-starterkit/package-json-scripts)
- [npm run dev explained](https://www.geeksforgeeks.org/npm-run-dev/)

**Port detection:**
- Next.js defaults to port 3000
- If 3000 busy, tries 3001, 3002, etc.
- Parse startup logs to find actual port: `ready - started server on 0.0.0.0:3000`

**Non-Next.js projects:**
- Don't auto-start anything
- User can manually run commands via terminal
- No preview iframe (just terminal)
- Still useful for backend projects, scripts, CLIs, etc.

---

### 4. Preview Iframe Integration (MEDIUM PRIORITY)

**Goal:** Toggle button switches between terminal and live preview

**Implementation:**
```typescript
// /app/terminal/[sessionId]/page.tsx
const [showPreview, setShowPreview] = useState(false);
const [previewPort, setPreviewPort] = useState<number | null>(null);

// Listen for dev server startup from terminal output
socket.on('terminal:output', (sid, data) => {
  // Parse: "ready - started server on 0.0.0.0:3000"
  const match = data.match(/started server on.*:(\d+)/);
  if (match) {
    setPreviewPort(parseInt(match[1]));
  }
});

// Render
{showPreview && previewPort && (
  <iframe
    src={`http://${dropletIp}:${previewPort}`}
    className="w-full h-full"
  />
)}
```

**UI additions:**
- Toggle button in header: "PREVIEW" / "TERMINAL"
- Show loading state while dev server boots
- Handle iframe load errors (server not ready yet)
- Auto-refresh on code changes? (HMR should work)

---

### 5. Session Management UI (LOW PRIORITY)

**Goal:** List active droplets, kill sessions, view costs

**Features:**
- Dashboard page: `/sessions`
- List all active droplets with:
  - Repo name
  - Uptime
  - Estimated cost
  - "OPEN TERMINAL" button
  - "STOP SESSION" button (destroys droplet)
- Auto-cleanup after 2 hours of inactivity
- Warning before destroying (unsaved work?)

---

## Automation Roadmap (Next 3 Steps)

### Step 1: Cloud-Init Script v1
**Owner:** Claude
**Time estimate:** 1 hour research + 1 hour implementation
**Deliverable:** Working cloud-init YAML that installs all dependencies

**Tasks:**
- [ ] Write cloud-init.yaml template
- [ ] Test on fresh droplet
- [ ] Verify Node.js, git, PM2, Claude Code all install
- [ ] Verify terminal server auto-starts
- [ ] Document any manual steps still required

---

### ✅ Step 2: Claude Code Authentication - COMPLETE!

**Solution found:** Use `ANTHROPIC_API_KEY` environment variable
- Token from console.anthropic.com (format: `sk-ant-api03-...`)
- Claude Code automatically uses API key when env var is set
- No interactive setup required!
- **Tested and working** on droplet

**For cloud-init:**
```yaml
runcmd:
  - export ANTHROPIC_API_KEY="sk-ant-api03-..."
  - echo 'export ANTHROPIC_API_KEY="sk-ant-api03-..."' >> /root/.bashrc
```

**Added to PM2 config:**
```javascript
env: {
  ANTHROPIC_API_KEY: "sk-ant-api03-..."
}
```

---

### Step 3: Droplet API Integration
**Owner:** Claude
**Time estimate:** 2-3 hours
**Deliverable:** `/api/droplets/create` endpoint that spins up ready-to-use droplet

**Tasks:**
- [ ] Create API route: `POST /api/droplets/create`
- [ ] Accept: `{ repoUrl, repoName }`
- [ ] Call DigitalOcean API with cloud-init script
- [ ] Poll for droplet ready status
- [ ] Return: `{ dropletId, ip, sessionId }`
- [ ] Update UI to call this endpoint when user clicks repo
- [ ] Add loading state: "Provisioning droplet... (30s)"

---

## Open Questions

1. **Claude Code API billing:** Does using `CLAUDE_CODE_OAUTH_TOKEN` charge API rates instead of subscription?
2. **Token expiration:** How long do OAuth tokens last? Need auto-refresh?
3. **Firewall rules:** Do we need to configure ufw on droplet for security?
4. **HTTPS for preview:** Do we need Cloudflare tunnel for dev server preview?
5. **Multi-repo support:** Can one droplet run multiple dev servers (different ports)?

---

## Backlog (Future)

- Voice dictation (requires HTTPS + proper domain)
- Collaborative sessions (multiple users, one terminal)
- Terminal history/logs saved to DB
- Cost tracking dashboard
- Auto-shutdown based on terminal inactivity
- GitHub webhook integration (auto-deploy on push)

---

## Sources

**Claude Code Authentication:**
- [Headless authentication issue](https://github.com/anthropics/claude-code/issues/7100)
- [Docker authentication docs](https://github.com/cabinlab/claude-code-sdk-docker/blob/main/docs/AUTHENTICATION.md)

**Next.js Detection:**
- [Package.json scripts](https://chris.lu/web_development/tutorials/next-js-static-first-mdx-starterkit/package-json-scripts)
- [npm run dev explained](https://www.geeksforgeeks.org/npm-run-dev/)

**DigitalOcean:**
- [Cloud-init tutorial](https://www.digitalocean.com/community/tutorials/how-to-use-cloud-config-for-your-initial-server-setup)
- [Droplet pricing](https://www.digitalocean.com/pricing/droplets)
