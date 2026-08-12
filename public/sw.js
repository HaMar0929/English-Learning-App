const CACHE_NAME = "easy-english-v2";
const APP_BASE = new URL("./", self.registration.scope);
const appUrl = (path = "") => new URL(path, APP_BASE).pathname;
const APP_HOME = appUrl();
const APP_SHELL = [
  APP_HOME,
  appUrl("manifest.json"),
  appUrl("icon-192.png"),
  appUrl("icon-512.png"),
  appUrl("apple-touch-icon.png"),
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("easy-english-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_URLS" || !Array.isArray(event.data.urls)) {
    return;
  }

  const localUrls = event.data.urls
    .map((value) => {
      try {
        const url = new URL(value, self.location.origin);
        return url.origin === self.location.origin
          ? `${url.pathname}${url.search}`
          : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(localUrls.map((url) => cache.add(url))),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(APP_HOME, copy));
          }
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          return cachedPage || caches.match(APP_HOME);
        }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    }),
  );
});
