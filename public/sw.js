// public/sw.js
const CACHE_NAME = "habit-tracker-cache-v3";
const ASSETS_TO_CACHE = [
  "/",
  "/login",
  "/signup",
  "/dashboard",
  // Removed '/globals.css' as it's a bundled asset, not a public one
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/desktop.png",
  "/icons/mobile.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting(); // Force the waiting service worker to become active
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim()); // Become the controller for all clients immediately
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  // Bypass cache for Next.js App Router RSC payloads
  if (url.searchParams.has("_rsc")) {
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      return fetch(event.request);
    })
  );
});
