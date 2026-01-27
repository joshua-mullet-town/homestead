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
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function TerminalPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const sessionId = params.sessionId;
    const terminalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const xtermRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fitAddonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const socketRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [fontSize, setFontSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(14);
    const [showPreview, setShowPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TerminalPage.useEffect": ()=>{
            let xterm;
            let fitAddon;
            let mounted = true;
            const initTerminal = {
                "TerminalPage.useEffect.initTerminal": async ()=>{
                    try {
                        // Dynamically import xterm to avoid SSR issues
                        const [{ Terminal }, { FitAddon }] = await Promise.all([
                            __turbopack_context__.A("[project]/node_modules/@xterm/xterm/lib/xterm.mjs [app-client] (ecmascript, async loader)"),
                            __turbopack_context__.A("[project]/node_modules/@xterm/addon-fit/lib/addon-fit.mjs [app-client] (ecmascript, async loader)")
                        ]);
                        if (!mounted) return;
                        // Create terminal instance
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
                            xterm.open(terminalRef.current);
                            fitAddon.fit();
                            xtermRef.current = xterm;
                        }
                        // Connect to Socket.IO - use current URL (for cloudflare tunnel) or local with port
                        const isCloudflare = ("TURBOPACK compile-time value", "object") !== 'undefined' && window.location.hostname.includes('trycloudflare.com');
                        const protocol = ("TURBOPACK compile-time value", "object") !== 'undefined' && window.location.protocol === 'https:' ? 'https' : 'http';
                        const socketUrl = isCloudflare ? `${protocol}://${window.location.host}` // Use same host for cloudflare (no port)
                         : ("TURBOPACK compile-time truthy", 1) ? `${protocol}://${window.location.hostname}:3005` // Local with explicit port
                         : "TURBOPACK unreachable";
                        console.log('[Socket] Connecting to:', socketUrl);
                        const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(socketUrl, {
                            transports: [
                                'websocket',
                                'polling'
                            ],
                            path: '/socket.io' // Explicit path
                        });
                        socketRef.current = socket;
                        socket.on('connect', {
                            "TerminalPage.useEffect.initTerminal": ()=>{
                                console.log('[Socket] Connected');
                                setIsConnected(true);
                                setError(null);
                                // Create terminal session (server will default to HOME directory)
                                socket.emit('terminal:create', sessionId);
                            }
                        }["TerminalPage.useEffect.initTerminal"]);
                        socket.on('disconnect', {
                            "TerminalPage.useEffect.initTerminal": ()=>{
                                console.log('[Socket] Disconnected');
                                setIsConnected(false);
                            }
                        }["TerminalPage.useEffect.initTerminal"]);
                        socket.on('terminal:ready', {
                            "TerminalPage.useEffect.initTerminal": (sid)=>{
                                console.log('[Terminal] Ready:', sid);
                                xterm.write('\r\n\x1b[1;32mTerminal connected!\x1b[0m\r\n');
                            }
                        }["TerminalPage.useEffect.initTerminal"]);
                        socket.on('terminal:output', {
                            "TerminalPage.useEffect.initTerminal": (sid, data)=>{
                                if (sid === sessionId) {
                                    xterm.write(data);
                                }
                            }
                        }["TerminalPage.useEffect.initTerminal"]);
                        socket.on('terminal:exit', {
                            "TerminalPage.useEffect.initTerminal": (sid, { exitCode })=>{
                                console.log(`[Terminal] Exited with code ${exitCode}`);
                                xterm.write(`\r\n\r\n\x1b[1;31mProcess exited with code ${exitCode}\x1b[0m\r\n`);
                            }
                        }["TerminalPage.useEffect.initTerminal"]);
                        socket.on('terminal:error', {
                            "TerminalPage.useEffect.initTerminal": (sid, message)=>{
                                console.error('[Terminal] Error:', message);
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
                                window.removeEventListener('resize', handleResize);
                                if (socket) {
                                    socket.emit('terminal:kill', sessionId);
                                    socket.disconnect();
                                }
                                if (xterm) {
                                    xterm.dispose();
                                }
                            }
                        })["TerminalPage.useEffect.initTerminal"];
                    } catch (err) {
                        console.error('[Terminal] Init error:', err);
                        setError(err instanceof Error ? err.message : 'Failed to initialize terminal');
                    }
                }
            }["TerminalPage.useEffect.initTerminal"];
            initTerminal();
            return ({
                "TerminalPage.useEffect": ()=>{
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
                                lineNumber: 193,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`
                                    }, void 0, false, {
                                        fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                        lineNumber: 197,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-gray-400",
                                        children: isConnected ? 'Connected' : 'Disconnected'
                                    }, void 0, false, {
                                        fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                        lineNumber: 198,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowPreview(!showPreview),
                                className: "px-3 py-1.5 bg-[#00FF66] text-black font-bold rounded hover:bg-[#FFCC00] transition-colors text-sm",
                                children: showPreview ? 'TERMINAL' : 'PREVIEW'
                            }, void 0, false, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 205,
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
                                    lineNumber: 218,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 213,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-gray-400 min-w-[3ch] text-center",
                                children: fontSize
                            }, void 0, false, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 220,
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
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                                lineNumber: 221,
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
                                lineNumber: 229,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                lineNumber: 191,
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
                lineNumber: 235,
                columnNumber: 7
            }, this),
            showPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 relative bg-white",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                    src: "http://localhost:3001",
                    className: "absolute inset-0 w-full h-full border-0 bg-white",
                    title: "App Preview"
                }, void 0, false, {
                    fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                    lineNumber: 247,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/terminal/[sessionId]/page.tsx",
                lineNumber: 246,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/terminal/[sessionId]/page.tsx",
        lineNumber: 189,
        columnNumber: 5
    }, this);
}
_s(TerminalPage, "jCWJUOvy9R3fRAUAUwsnVlSmt3s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"]
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