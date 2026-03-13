// The Belt Hub CRM Service Worker
const CACHE_NAME = "belthub-crm-v1";

const ASSETS = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/css/styles.css",
  "/js/api.js",
  "/js/auth.js",
  "/icons/belt-hub.png",
  "/icons/hub.png",
  "/manifest.json"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate (clear old caches)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Never cache API calls to your Worker
  if (url.includes(".workers.dev") || url.includes("api.thebelthub.com")) {
    return;
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => caches.match("/index.html"))
      );
    })
  );
});
