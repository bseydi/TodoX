/* eslint-disable no-undef */
// Cache versionné (changer en cas de déploiement)
const CACHE_NAME = "todox-pwa-v1";
// Liste minimale pour l'app-shell; les assets Vite hashés seront gérés en runtime
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  // icônes
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-192.png",
  "/icons/maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
      await self.clients.claim();
    })()
  );
});

// Stratégies:
// 1) HTML (navigations): Network-first avec fallback cache/offline
// 2) Assets statiques (vite build, images, css, js): Cache-first
// 3) Autres (API GET): Stale-while-revalidate simple
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignorer cross-origin non GET
  if (req.method !== "GET") return;

  // HTML navigations
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put("/", fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match("/") || await cache.match("/index.html");
          return cached || new Response("Offline", { status: 503, statusText: "Offline" });
        }
      })()
    );
    return;
  }

  // Même origine: distinguer assets vs autres
  if (url.origin === self.location.origin) {
    // Assets (vite génère /assets/...) et fichiers publics
    if (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/icons/")) {
      event.respondWith(cacheFirst(req));
      return;
    }
  }

  // Par défaut: stale-while-revalidate
  event.respondWith(staleWhileRevalidate(req));
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const fresh = await fetch(request);
    cache.put(request, fresh.clone());
    return fresh;
  } catch {
    return cached || new Response("Offline", { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((res) => {
      cache.put(request, res.clone());
      return res;
    })
    .catch(() => undefined);
  return cached || networkPromise || new Response("Offline", { status: 503 });
}