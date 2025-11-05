const CACHE_NAME = 'gift-of-hope-v1';
const RUNTIME_CACHE = 'gift-of-hope-runtime';

// Critical assets to cache immediately
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/logo.webp',
  '/images/aid-worker-delivery.webp',
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first for API, cache first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only cache GET requests - Cache API doesn't support other methods
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    // For PayPal and external APIs, just fetch
    if (url.hostname.includes('paypal') || url.hostname.includes('api')) {
      return;
    }
  }

  // API GET requests - network first, cache fallback (for read-only endpoints)
  if (url.pathname.startsWith('/api/campaigns') || 
      url.pathname.startsWith('/api/stats') || 
      url.pathname.startsWith('/api/recent-donations') ||
      url.pathname.startsWith('/paypal-client-id')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clonedResponse = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Skip caching for mutation endpoints (orders, contact, admin)
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/order')) {
    return;
  }

  // Static assets - cache first, network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      });
    })
  );
});
