const CACHE_NAME = "iowidgets-v1";
const STATIC_CACHE = "iowidgets-static-v1";
const DYNAMIC_CACHE = "iowidgets-dynamic-v1";

// Files to cache immediately
const STATIC_FILES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/calculator.html",
  "/timer.html",
  "/todo.html",
  "/notes.html",
  "/weather.html",
  "/qr.html",
  "/unit-converter.html",
  "/password.html",
  "/color-picker.html",
  "/stopwatch.html",
  "/expense.html",
  "/habit.html",
  "/assets/shared.css",
];

// Install event - cache static files
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static files");
        return cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.log("Service Worker: Cache failed", error);
      })
  );

  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log("Service Worker: Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Ensure the service worker takes control of all pages immediately
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip external requests
  if (!request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log("Service Worker: Serving from cache:", request.url);
        return cachedResponse;
      }

      // Otherwise fetch from network and cache dynamically
      return fetch(request)
        .then((networkResponse) => {
          // Check if response is valid
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          // Clone the response
          const responseToCache = networkResponse.clone();

          // Cache dynamic content
          caches.open(DYNAMIC_CACHE).then((cache) => {
            console.log("Service Worker: Caching dynamic:", request.url);
            cache.put(request, responseToCache);
          });

          return networkResponse;
        })
        .catch((error) => {
          console.log("Service Worker: Fetch failed:", error);

          // Return offline fallback for HTML pages
          if (request.headers.get("Accept").includes("text/html")) {
            return caches.match("/index.html");
          }

          // For other resources, return a basic offline response
          return new Response("Offline content not available", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          });
        });
    })
  );
});

// Background sync for offline actions (if supported)
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync:", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(
      // Handle offline data synchronization here
      Promise.resolve()
    );
  }
});

// Push notifications (if needed in future)
self.addEventListener("push", (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: "/icon-192.png",
      badge: "/badge-72.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
      actions: [
        {
          action: "explore",
          title: "Open App",
          icon: "/icon-192.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/icon-192.png",
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification("iowidgets Notification", options)
    );
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Message handling for cache updates
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Periodic background sync (if supported)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "content-sync") {
    event.waitUntil(
      // Update cache with fresh content
      updateCache()
    );
  }
});

async function updateCache() {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const promises = STATIC_FILES.map((url) =>
      fetch(url)
        .then((response) => {
          if (response.ok) {
            cache.put(url, response.clone());
          }
          return response;
        })
        .catch((error) => {
          console.log("Cache update failed for:", url, error);
        })
    );

    await Promise.all(promises);
    console.log("Service Worker: Cache updated");
  } catch (error) {
    console.log("Service Worker: Cache update failed:", error);
  }
}
