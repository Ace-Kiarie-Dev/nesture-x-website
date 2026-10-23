// Offline support. The page is network-first (so a new release shows up straight away);
// everything else is cache-first. Bump CACHE when shipping changes so old caches get cleared.
const CACHE_PREFIX = "nx-flappy-horror:";
const CACHE = CACHE_PREFIX + "v1";
// The scope is the page URL itself (with or without a trailing slash, depending on the host),
// so the page is cached under the exact URL it's opened from rather than a redirect.
// og.png is left out (it's only for link previews) and so is the music: see MUSIC below.
const ASSETS = [
    self.registration.scope, "index.html", "style.css", "main.js", "manifest.webmanifest",
    "ghost.webp", "toppipe.webp", "bottompipe.webp", "flappybirdbg2.webp", "bg2.jpg",
    "fonts/rubik-wet-paint-latin.woff2", "fonts/space-grotesk-latin.woff2", "fonts/jetbrains-mono-latin.woff2",
    "favicon.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png",
];
// ~2.4 MB, so it isn't precached; it's cached the first time it plays.
const MUSIC = new URL("df.mp3", self.registration.scope.replace(/\/?$/, "/")).href;

self.addEventListener("install", (e) => {
    e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    // Only clear this game's old versions: other games on nesturex.com share the same
    // Cache Storage (one per origin), so deleting every other cache would wipe theirs.
    e.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (e) => {
    const req = e.request;
    if (req.method !== "GET") return;
    const url = new URL(req.url);

    if (req.mode === "navigate") e.respondWith(networkFirst(e));
    else if (url.href.split(/[?#]/)[0] === MUSIC) e.respondWith(music(e));
    else if (url.origin === location.origin) e.respondWith(cacheFirst(e));
});

async function networkFirst(e) {
    const cache = await caches.open(CACHE);
    try {
        const res = await fetch(e.request);
        if (res.ok) e.waitUntil(cache.put(e.request, res.clone()));
        return res;
    } catch {
        return (await cache.match(e.request, { ignoreSearch: true }))
            || (await cache.match(self.registration.scope))
            || Response.error();
    }
}

async function cacheFirst(e) {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(e.request, { ignoreSearch: true });
    if (cached) return cached;
    const res = await fetch(e.request);
    if (res.ok || res.type === "opaque") e.waitUntil(cache.put(e.request, res.clone()));
    return res;
}

// <audio> asks for byte ranges, and the Cache API can't store partial (206) responses.
// Serve ranges from the cached file when we have it. Otherwise pass the request through
// unchanged (so playback streams as normal) and, when that response turns out to be the
// whole file, keep a copy, so the track is only downloaded once.
async function music(e) {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(MUSIC);
    const range = e.request.headers.get("range");
    if (cached) return range ? sliceRange(cached, range) : cached;

    // A fresh request (same URL and Range) rather than e.request: <audio> aborts its request once
    // it has buffered enough, and that abort would also cut off the copy being saved to the cache.
    const res = await fetch(MUSIC, { headers: range ? { Range: range } : {} });
    const whole = res.status === 200 || (res.status === 206 && isWholeFile(res.headers.get("content-range")));
    if (!whole) return res;

    const [forPage, forCache] = res.body.tee();
    const headers = { "Content-Type": res.headers.get("content-type") || "audio/mpeg" };
    e.waitUntil(cache.put(MUSIC, new Response(forCache, { status: 200, headers })).catch(() => {}));
    return new Response(forPage, { status: res.status, statusText: res.statusText, headers: res.headers });
}

// "bytes 0-2527537/2527538" means the response holds the entire file.
function isWholeFile(contentRange) {
    const m = /^bytes 0-(\d+)\/(\d+)$/.exec(contentRange || "");
    return m !== null && Number(m[1]) === Number(m[2]) - 1;
}

async function sliceRange(cached, range) {
    const buf = await cached.arrayBuffer();
    const size = buf.byteLength;
    const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!m || (m[1] === "" && m[2] === "")) {
        return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    let start, end;
    if (m[1] === "") { // suffix range: the last N bytes
        start = Math.max(0, size - Number(m[2]));
        end = size - 1;
    } else {
        start = Number(m[1]);
        end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1);
    }
    if (start >= size || start > end) {
        return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    return new Response(buf.slice(start, end + 1), {
        status: 206,
        headers: {
            "Content-Type": cached.headers.get("content-type") || "audio/mpeg",
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Content-Length": String(end - start + 1),
            "Accept-Ranges": "bytes",
        },
    });
}
