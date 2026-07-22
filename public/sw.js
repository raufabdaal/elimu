const CACHE_NAME = "elimu-pwa-cache-v3";
const APP_SHELL_ROUTES = ["/", "/subjects/", "/home/", "/module/", "/practice/", "/parent/", "/onboarding/"];
const STATIC_ASSETS = [
  ...APP_SHELL_ROUTES,
  "/manifest.json",
  "/favicon.ico",
  "/favicon.png",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function withTrailingSlash(pathname) {
  if (pathname === "") return "/";
  if (pathname === "/") return "/";
  if (pathname.endsWith("/")) return pathname;
  return `${pathname}/`;
}

function getAppShellPath(requestUrl) {
  const pathname = withTrailingSlash(requestUrl.pathname);
  if (APP_SHELL_ROUTES.includes(pathname)) return pathname;
  return null;
}

function extractNextStaticAssets(html) {
  const matches = html.match(/\/_next\/static\/[^"'\s<>\\)]+/g) || [];
  return Array.from(new Set(matches.map((asset) => asset.replace(/&amp;/g, "&"))));
}

async function cacheResponse(cache, requestOrUrl, response) {
  if (!response || response.status !== 200) return;
  try {
    await cache.put(requestOrUrl, response.clone());
  } catch (error) {
    // Some opaque or partial responses cannot be cached. Ignore safely.
  }
}

async function fetchAndCache(cache, url) {
  const response = await fetch(url, { cache: "reload" });
  await cacheResponse(cache, url, response);

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    const html = await response.clone().text();
    const assets = extractNextStaticAssets(html);
    await Promise.allSettled(
      assets.map(async (assetPath) => {
        const assetUrl = new URL(assetPath, self.location.origin).toString();
        const assetResponse = await fetch(assetUrl, { cache: "reload" });
        await cacheResponse(cache, assetUrl, assetResponse);
      })
    );
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        STATIC_ASSETS.map((asset) => fetchAndCache(cache, new URL(asset, self.location.origin).toString()))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return Promise.resolve(false);
        })
      );
    })
  );
  self.clients.claim();
});

async function handleNavigation(event) {
  const cache = await caches.open(CACHE_NAME);
  const url = new URL(event.request.url);
  const shellPath = getAppShellPath(url);
  const shellUrl = shellPath ? new URL(shellPath, self.location.origin).toString() : new URL("/subjects/", self.location.origin).toString();

  try {
    const networkResponse = await fetch(event.request);
    await cacheResponse(cache, event.request, networkResponse);
    if (shellPath) {
      await cacheResponse(cache, shellUrl, networkResponse);
    }
    return networkResponse;
  } catch (error) {
    return (
      (await cache.match(event.request, { ignoreSearch: true })) ||
      (await cache.match(shellUrl)) ||
      (await cache.match(new URL("/subjects/", self.location.origin).toString())) ||
      (await cache.match(new URL("/", self.location.origin).toString())) ||
      new Response("Elimu is offline. Please reopen the app once after connecting to the internet.", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      })
    );
  }
}

async function handleAsset(event) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(event.request);

  if (cachedResponse) {
    event.waitUntil(
      fetch(event.request)
        .then((networkResponse) => cacheResponse(cache, event.request, networkResponse))
        .catch(() => undefined)
    );
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(event.request);
    await cacheResponse(cache, event.request, networkResponse);
    return networkResponse;
  } catch (error) {
    return (
      cachedResponse ||
      new Response("Offline asset unavailable", {
        status: 503,
        headers: { "Content-Type": "text/plain" },
      })
    );
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (!isSameOrigin(url)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(handleNavigation(event));
    return;
  }

  event.respondWith(handleAsset(event));
});
