# PLAN.md - What We're Doing

## 🔥🔥🔥 TOP PRIORITY - PROVE THE AUTOMATION ACTUALLY WORKS 🔥🔥🔥

**STOP SAYING IT WORKS. PROVE IT WORKS.**

**Current Status:** User reports:
- Terminal shows "connection error timeout"
- Preview shows "IP address took too long to respond"
- **NOTHING IS WORKING**

**Goal:** Get ONE COMPLETE SUCCESSFUL END-TO-END TEST:
1. ✅ Droplet provisions successfully (no cloud-init errors)
2. ✅ Terminal connects (NOT "timeout")
3. ✅ Claude Code is running and ready
4. ✅ Dev server is running on port 7087
5. ✅ Preview loads the actual working app (NOT "took too long to respond")

**Testing Process (DO THIS NOW):**
1. Find the droplet that was just created
2. SSH into it
3. Check EVERYTHING systematically:
   - `cat /root/provision.log` - did cloud-init complete?
   - `export HOME=/root && pm2 status` - are BOTH processes running?
   - `lsof -i -P -n | grep LISTEN` - are ports 3005 AND 7087 listening?
   - `ls -la /root/project/.env*` - were env files created?
   - `ls -la /root/project/service-account*` - was service account created?
   - `export HOME=/root && pm2 logs dev-server --lines 50` - is Next.js running or crashing?
4. If ANYTHING is broken, FIX IT
5. Test from Mac - connect to terminal, check preview
6. If STILL broken, iterate

**DO NOT MOVE ON. DO NOT SAY IT WORKS. PROVE IT WORKS WITH REAL TESTING.**

---

*(rest of plan below - ignore until top priority is complete)*
