(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/terminal/[sessionId]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TerminalPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-in.js [app-client] (ecmascript) <export default as ZoomIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-out.js [app-client] (ecmascript) <export default as ZoomOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/house.js [app-client] (ecmascript) <export default as Home>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-client] (ecmascript) <export default as RefreshCw>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// Client-side logging helper
function logClient(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [CLIENT] [${level}] ${message}`;
    console.log(logMessage);
}
function TerminalPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const sessionId = params.sessionId;
    const dropletIp = searchParams.get('ip');
    const previewPort = searchParams.get('port') || '7087'; // Default to 7087 (crowne-vault), override with ?port=XXXX
    const terminalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const xtermRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fitAddonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const socketRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [fontSize, setFontSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(14);
    const [showPreview, setShowPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isRestarting, setIsRestarting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    logClient(`Terminal page loaded - sessionId: ${sessionId}, dropletIp: ${dropletIp}, previewPort: ${previewPort}`);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TerminalPage.useEffect": ()=>{
            let xterm;
            let fitAddon;
            let mounted = true;
            const initTerminal = {
                "TerminalPage.useEffect.initTerminal": async ()=>{
                    try {
                        logClient('Initializing terminal...');
                        // Dynamically import xterm to avoid SSR issues
                        logClient('Importing xterm modules...');
                        const [{ Terminal }, { FitAddon }] = await Promise.all([
                            __turbopack_context__.A("[project]/node_modules/@xterm/xterm/lib/xterm.mjs [app-client] (ecmascript, async loader)"),
                            __turbopack_context__.A("[project]/node_modules/@xterm/addon-fit/lib/addon-fit.mjs [app-client] (ecmascript, async loader)")
                        ]);
                        logClient('xterm modules imported successfully');
                        if (!mounted) {
                            logClient('Component unmounted, aborting terminal init', 'WARN');
                            return;
                        }
                        // Create terminal instance
                        logClient('Creating terminal instance...');
                        xterm = new Terminal({
                            cols: 100,
                            rows: 30,
                            fontSize: fontSize,
                            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                            cursorBlink: true,
                            theme: {
                                background: '#1e1e1e',
                                foreground: '#d4d4d4',
                                cursor: '#d4d4d4',
                                cursorAccent: '#1e1e1e',
                                selectionBackground: 'rgba(255, 255, 255, 0.3)'
                            }
                        });
                        fitAddon = new FitAddon();
                        xterm.loadAddon(fitAddon);
                        fitAddonRef.current = fitAddon;
                        // Mount terminal
                        if (terminalRef.current) {
                            logClient('Mounting terminal to DOM...');
                            xterm.open(terminalRef.current);
                            fitAddon.fit();
                            xtermRef.current = xterm;
                            logClient('Terminal mounted successfully');
                        } else {
                            logClient('Terminal ref is null, cannot mount', 'ERROR');
                        }
                        // Connect to Socket.IO - use droplet IP if provided, otherwise local
                        const protocol = ("TURBOPACK compile-time value", "object") !== 'undefined' && window.location.protocol === 'https:' ? 'https' : 'http';
                        const socketUrl = dropletIp ? `http://${dropletIp}:3005` // Connect to droplet
                         : ("TURBOPACK compile-time truthy", 1) ? `${protocol}://${window.location.hostname}:3005` // Local with explicit port
                         : "TURBOPACK unreachable";
                        logClient(`Socket.IO connecting to: ${socketUrl} (${dropletIp ? 'droplet' : 'local'})`);
                        const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(socketUrl, {
                            transports: [
                                'websocket',
                                'polling'
                            ],
                            path: '/socket.io' // Explicit path
                        });
                        socketRef.current = socket;
                        logClient('Socket.IO client created');
                        socket.on('connect', {
                            "TerminalPage.useEffect.initTerminal": ()=>{
                                logClient('Socket.IO connected successfully');
                                setIsConnected(true);
                                setError(null);
                                // Create terminal session (server will default to HOME directory)
                                logClient(`Emitting terminal:create event for session: ${sessionId}`);
                                socket.emit('terminal:create', sessionId);
                            }
                        }["TerminalPage.useEffect.initTerminal"]);
                        socket.on('disconnect', {
                            "TerminalPage.useEffect.initTerminal": ()=>{
                                logClient('Socket.IO disconnected', 'WARN');
                                setIsConnected(false);
                            }
                        }["TerminalPage.useEffect.initTerminal"]);
                        socket.on('connect_error', {
                            "TerminalPage.useEffect.initTerminal": (err)=>{
                                logClient(`Socket.IO connect_error: ${err.message}`, 'ERROR');
                                setError(`Connection error: ${err.message}`);
                            }
                        }["TerminalPage.useEffect.initTerminal"]);
                        socket.on('terminal:ready', {
                            "TerminalPage.useEffect.initTerminal": (sid)=>{
                                logClient(`Terminal ready event received for session: ${sid}`);
                                xterm.write('\r\n\x1b[1;32mTerminal connected!\x1b[0m\r\n');
                            }
                        }["TerminalPage.useEffect.initTerminal"]);
                        socket.on('terminal:output', {
                            "TerminalPage.useEffect.initTerminal": (sid, data)=>{
                                if (sid === sessionId) {
                                    // Don't log every output - too spammy
                                    xterm.write(data);
                                } else {
                                    logClient(`Received output for wrong session: ${sid} (expected: ${sessionId})`, 'WARN');
                                }
                            }
                        }["TerminalPage.useEffect.initTerminal"]);
                        socket.on('terminal:exit', {
                            "TerminalPage.useEffect.initTerminal": (sid, { exitCode })=>{
                                logClient(`Terminal process exited with code ${exitCode} for session: ${sid}`, 'WARN');
                                xterm.write(`\r\n\r\n\x1b[1;31mProcess exited with code ${exitCode}\x1b[0m\r\n`);
                            }
                        }["TerminalPage.useEffect.initTerminal"]);
                        socket.on('terminal:error', {
                            "TerminalPage.useEffect.initTerminal": (sid, message)=>{
                                logClient(`Terminal error for session ${sid}: ${message}`, 'ERROR');
                                setError(message);
                                xterm.write(`\r\n\x1b[1;31mError: ${message}\x1b[0m\r\n`);
                            }
                        }["TerminalPage.useEffect.initTerminal"]);
                        // Handle user input
                        xterm.onData({
                            "TerminalPage.useEffect.initTerminal": (data)=>{
                                socket.emit('terminal:input', sessionId, data);
                            }
                        }["TerminalPage.useEffect.initTerminal"]);
                        // Handle resize
                        xterm.onResize({
                            "TerminalPage.useEffect.initTerminal": ({ cols, rows })=>{
                                socket.emit('terminal:resize', sessionId, cols, rows);
                            }
                        }["TerminalPage.useEffect.initTerminal"]);
                        // Handle window resize
                        const handleResize = {
                            "TerminalPage.useEffect.initTerminal.handleResize": ()=>{
                                if (fitAddon) {
                                    fitAddon.fit();
                                }
                            }
                        }["TerminalPage.useEffect.initTerminal.handleResize"];
                        window.addEventListener('resize', handleResize);
                        return ({
                            "TerminalPage.useEffect.initTerminal": ()=>{
                                logClient('Cleaning up terminal...');
                                window.removeEventListener('resize', handleResize);
                                if (socket) {
                                    logClient(`Emitting terminal:kill for session: ${sessionId}`);
                                    socket.emit('terminal:kill', sessionId);
                                    socket.disconnect();
                                    logClient('Socket.IO disconnected');
                                }
                                if (xterm) {
                                    xterm.dispose();
                                    logClient('Terminal disposed');
                                }
                            }
                        })["TerminalPage.useEffect.initTerminal"];
                    } catch (err) {
                        logClient(`Terminal init error: ${err instanceof Error ? err.message : String(err)}`, 'ERROR');
                        if (err instanceof Error) {
                            logClient(`Error stack: ${err.stack}`, 'ERROR');
                        }
                        setError(err instanceof Error ? err.message : 'Failed to initialize terminal');
                    }
                }
            }["TerminalPage.useEffect.initTerminal"];
            initTerminal();
            return ({
                "TerminalPage.useEffect": ()=>{
                    logClient('Component unmounting');
                    mounted = false;
                }
            })["TerminalPage.useEffect"];
        }
    }["TerminalPage.useEffect"], [
        sessionId
    ]); // Removed fontSize from dependencies
    // Handle font size change - update without reinitializing
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TerminalPage.useEffect": ()=>{
            if (xtermRef.current && fitAddonRef.current) {
                xtermRef.current.options.fontSize = fontSize;
                // Refit terminal to adjust layout after font size change
                setTimeout({
                    "TerminalPage.useEffect": ()=>{
                        if (fitAddonRef.current) {
                            fitAddonRef.current.fit();
                        }
                    }
                }["TerminalPage.useEffect"], 100);
            }
        }
    }["TerminalPage.useEffect"], [
        fontSize
    ]);
    // Handle sending messages from voice recorder
    const handleSendMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TerminalPage.useCallback[handleSendMessage]": (message)=>{
            if (socketRef.current && message.trim()) {
                // Send each character individually to simulate typing
                message.split('').forEach({
                    "TerminalPage.useCallback[handleSendMessage]": (char, index)=>{
                        setTimeout({
                            "TerminalPage.useCallback[handleSendMessage]": ()=>{
                                socketRef.current?.emit('terminal:input', sessionId, char);
                            }
                        }["TerminalPage.useCallback[handleSendMessage]"], index * 10);
                    }
                }["TerminalPage.useCallback[handleSendMessage]"]);
                // Send enter key after the message
                setTimeout({
                    "TerminalPage.useCallback[handleSendMessage]": ()=>{
                        socketRef.current?.emit('terminal:input', sessionId, '\r');
                    }
                }["TerminalPage.useCallback[handleSendMessage]"], message.length * 10 + 100);
            }
        }
    }["TerminalPage.useCallback[handleSendMessage]"], [
        sessionId
    ]);
    // Handle restart dev server
    const handleRestartDevServer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TerminalPage.useCallback[handleRestartDevServer]": async ()=>{
            if (!socketRef.current || !isConnected) {
                logClient('Cannot restart - socket not connected', 'WARN');
                return;
            }
            setIsRestarting(true);
            logClient('Restarting dev server...');
            // Send PM2 restart command through terminal
            const command = 'export HOME=/root && pm2 restart dev-server\n';
            socketRef.current.emit('terminal:input', sessionId, command);
            // Reset restarting state after 2 seconds
            setTimeout({
                "TerminalPage.useCallback[handleRestartDevServer]": ()=>{
                    setIsRestarting(false);
                    logClient('Dev server restart command sent');
                }
            }["TerminalPage.useCallback[handleRestartDevServer]"], 2000);
        }
    }["TerminalPage.useCallback[handleRestartDevServer]"], [
        sessionId,
        isConnected
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 w-screen h-screen bg-black flex flex-col overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-shrink-0 bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: 'VT323, monospace'
                                },
                                className: "text-xl text-white",
                                children: [
                                    "TERMINAL: ",
                                    sessionId
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`
                                    }, void 0, false, {
                                        fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                        lineNumber: 261,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-gray-400",
                                        children: isConnected ? 'Connected' : 'Disconnected'
                                    }, void 0, false, {
                                        fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                        lineNumber: 262,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 260,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push('/'),
                                className: "px-3 py-1.5 bg-gray-800 text-white font-bold rounded hover:bg-[#FF6600] transition-colors text-sm flex items-center gap-1",
                                title: "Back to Home",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$house$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Home$3e$__["Home"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                        lineNumber: 274,
                                        columnNumber: 13
                                    }, this),
                                    "HOME"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 269,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push(`/chat/${sessionId}?ip=${dropletIp || 'localhost'}`),
                                className: "px-3 py-1.5 bg-[#FFCC00] text-black font-bold rounded hover:bg-[#00FF66] transition-colors text-sm flex items-center gap-1",
                                title: "Switch to Chat View",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                        lineNumber: 284,
                                        columnNumber: 13
                                    }, this),
                                    "CHAT"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleRestartDevServer,
                                disabled: !isConnected || isRestarting,
                                className: `px-3 py-1.5 font-bold rounded transition-colors text-sm flex items-center gap-1 ${isRestarting ? 'bg-gray-600 text-gray-400 cursor-wait' : 'bg-[#FF6600] text-white hover:bg-[#FF3333]'}`,
                                title: "Restart Next.js dev server",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                        size: 14,
                                        className: isRestarting ? 'animate-spin' : ''
                                    }, void 0, false, {
                                        fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                        lineNumber: 299,
                                        columnNumber: 13
                                    }, this),
                                    isRestarting ? 'RESTARTING...' : 'RESTART'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 289,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowPreview(!showPreview),
                                className: "px-3 py-1.5 bg-[#00FF66] text-black font-bold rounded hover:bg-[#FFCC00] transition-colors text-sm",
                                children: showPreview ? 'TERMINAL' : 'PREVIEW'
                            }, void 0, false, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 304,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setFontSize((prev)=>Math.max(10, prev - 2)),
                                className: "p-2 rounded bg-gray-800 hover:bg-gray-700 text-white active:scale-95 transition-transform",
                                title: "Decrease font size",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__["ZoomOut"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                    lineNumber: 317,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 312,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-gray-400 min-w-[3ch] text-center",
                                children: fontSize
                            }, void 0, false, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 319,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setFontSize((prev)=>Math.min(32, prev + 2)),
                                className: "p-2 rounded bg-gray-800 hover:bg-gray-700 text-white active:scale-95 transition-transform",
                                title: "Increase font size",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__["ZoomIn"], {
                                    size: 16
                                }, void 0, false, {
                                    fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                    lineNumber: 325,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 320,
                                columnNumber: 11
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-red-400 ml-4",
                                children: [
                                    "Error: ",
                                    error
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 328,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                lineNumber: 255,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: terminalRef,
                className: "flex-1 p-2 overflow-auto",
                style: {
                    width: '100%',
                    display: showPreview ? 'none' : 'block'
                }
            }, void 0, false, {
                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                lineNumber: 334,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 relative bg-white",
                style: {
                    display: showPreview ? 'block' : 'none'
                },
                children: dropletIp ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                    src: `http://${dropletIp}:${previewPort}`,
                    className: "absolute inset-0 w-full h-full border-0 bg-white",
                    title: "App Preview"
                }, void 0, false, {
                    fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                    lineNumber: 346,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-gray-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl font-bold mb-2",
                                children: "No Preview Available"
                            }, void 0, false, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 354,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "No droplet IP provided"
                            }, void 0, false, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 355,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm mt-4",
                                children: "Add ?port=XXXX to URL to specify port (default: 3000)"
                            }, void 0, false, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 356,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                        lineNumber: 353,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                    lineNumber: 352,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                lineNumber: 344,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/terminal/[sessionId]/page.tsx",
        lineNumber: 253,
        columnNumber: 5
    }, this);
}
_s(TerminalPage, "yHxdce/GU597xI+AnDf0XElg/bY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = TerminalPage;
var _c;
__turbopack_context__.k.register(_c, "TerminalPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_terminal_%5BsessionId%5D_page_tsx_09908f54._.js.map