document.addEventListener('DOMContentLoaded', () => {
    // Helper to safe set text content
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    // --- Identity & System ---
    const userAgent = navigator.userAgent;
    let os = "Unknown OS";
    if (userAgent.indexOf("Win") !== -1) os = "Windows";
    if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
    if (userAgent.indexOf("X11") !== -1) os = "UNIX";
    if (userAgent.indexOf("Linux") !== -1) os = "Linux";
    if (userAgent.indexOf("Android") !== -1) os = "Android";
    if (userAgent.indexOf("iPhone") !== -1) os = "iOS";

    setVal('os-val', os);
    setVal('browser-val', navigator.appName + " (" + navigator.appVersion.split(" ")[0] + ")");
    setVal('platform-val', navigator.platform || 'Unknown');
    setVal('ua-val', userAgent);

    // --- Screen & Window ---
    setVal('res-val', `${window.screen.width}x${window.screen.height}`);
    setVal('avail-res-val', `${window.screen.availWidth}x${window.screen.availHeight}`);
    setVal('win-size-val', `${window.innerWidth}x${window.innerHeight}`);
    setVal('color-depth-val', `${window.screen.colorDepth}-bit`);
    setVal('pixel-ratio-val', window.devicePixelRatio || '1');

    // --- Locale & Time ---
    const lang = navigator.language;
    setVal('lang-val', lang);

    try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setVal('timezone-val', timeZone);
    } catch (e) {
        setVal('timezone-val', 'Unknown');
    }

    const offset = new Date().getTimezoneOffset();
    setVal('timezone-offset-val', `${offset} mins (${offset / -60} hrs)`);

    // --- Hardware & Graphics ---
    const cores = navigator.hardwareConcurrency || 'Unknown';
    setVal('cores-val', cores);

    const mem = navigator.deviceMemory ? `~${navigator.deviceMemory}GB` : 'Unknown/Hidden';
    setVal('mem-val', mem);

    // WebGL Fingerprinting
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                setVal('gpu-vendor-val', vendor);
                setVal('gpu-renderer-val', renderer);
            } else {
                setVal('gpu-vendor-val', 'Blocked');
                setVal('gpu-renderer-val', 'Blocked');
            }
        } else {
            setVal('gpu-vendor-val', 'Not Supported');
            setVal('gpu-renderer-val', 'Not Supported');
        }
    } catch (e) {
        setVal('gpu-vendor-val', 'Error');
        setVal('gpu-renderer-val', 'Error');
    }

    // --- Browser Features ---
    setVal('cookies-val', navigator.cookieEnabled ? 'Yes' : 'No');
    setVal('dnt-val', navigator.doNotTrack || 'Unspecified');
    setVal('touch-val', navigator.maxTouchPoints || '0');
    setVal('pdf-val', navigator.pdfViewerEnabled ? 'Yes' : 'No');

    // --- Connection ---
    if (navigator.connection) {
        setVal('connection-val', navigator.connection.effectiveType || 'Unknown');
    } else {
        setVal('connection-val', 'API Not Supported');
    }

    // --- Canvas Fingerprinting (Basic Demo) ---
    try {
        const canvas = document.getElementById('fingerprint-canvas');
        const ctx = canvas.getContext('2d');

        // Text with mixed properties to provoke rendering differences
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText("mjnb_fingerprint", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("mjnb_fingerprint", 4, 17);

        // Generate a simple hash from the data URL
        const dataURI = canvas.toDataURL();
        let hash = 0;
        for (let i = 0; i < dataURI.length; i++) {
            const char = dataURI.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }

        setVal('canvas-val', `Hash: ${Math.abs(hash).toString(16)}`);
    } catch (e) {
        setVal('canvas-val', 'Blocked/Error');
    }
});
