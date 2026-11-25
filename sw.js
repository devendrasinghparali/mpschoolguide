
const CACHE_NAME = "mpsg-cache-v1";

const OFFLINE_FILES = [
  "/",
  "/index.html"
];

// Install: जरूरी पेज कैश करें
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_FILES);
    })
  );

  self.skipWaiting();
});

// Activate: पुराने कैश हटाएं
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_NAME &&
            cacheName.startsWith("mpsg-cache-")
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// Fetch: नेटवर्क पहले, कैश से बैकअप
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // केवल GET requests
  if (request.method !== "GET") return;

  // केवल अपनी वेबसाइट के अनुरोध
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // HTML पेज: नेटवर्क पहले
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, copy);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match("/index.html");
          });
        })
    );
    return;
  }

  // CSS, JS, images आदि: कैश पहले
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, copy);
          });
        }
        return response;
      });
    })
  );
});
