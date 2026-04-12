/** ═══════════════════════════════════════════════════════════════
 * 📦 Service Worker - Basic Caching for Offline Support
 * ═══════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'clinic-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/variables.css',
  './css/base.css',
  './css/animations.css',
  './css/components.css',
  './css/responsive.css',
  './css/utilities.css',
  './css/custom-select.css',
  './images/logo.png',
  './images/doctor-1.jpg',
  './images/doctor-2.jpg',
  './images/doctor-3.jpg',
  './images/doctor-4.jpg',
  './images/doctor-5.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.warn('📦 Service Worker: Cache failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('📦 Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200) {
              return response;
            }
            // Clone and cache the response
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone));
            return response;
          })
          .catch(() => {
            // Return offline fallback for HTML requests
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});
