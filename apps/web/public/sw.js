const CACHE_NAME = "pandharkawda-arogya-emergency-v1";
const OFFLINE_SAFE_URLS = ["/", "/emergency", "/manifest.webmanifest", "/icon.svg", "/emergency-offline.json"];
const NETWORK_ONLY_URL_PREFIXES = [
  "/api/v1/facilities/open-now",
  "/api/v1/search",
  "/api/v1/visiting-sessions",
  "/api/v1/doctors",
  "/api/v1/facilities"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_SAFE_URLS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  if (NETWORK_ONLY_URL_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) return;

  const isEmergencySafe = OFFLINE_SAFE_URLS.includes(url.pathname);
  if (!isEmergencySafe) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
