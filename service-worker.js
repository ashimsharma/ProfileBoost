// Service Worker for ResumeGenius.AI
// Version 1.0.0

const CACHE_NAME = 'resume-genius-v1';
const STATIC_CACHE = 'resume-genius-static-v1';
const DYNAMIC_CACHE = 'resume-genius-dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/main.js',
    '/js/modules/resumeBuilder.js',
    '/js/modules/preview.js',
    '/js/modules/optimizer.js',
    '/js/modules/aiIntegrations.js',
    '/js/modules/export.js',
    '/js/modules/storage.js',
    '/js/modules/templates.js',
    '/manifest.json',
    'https://cdn.tailwindcss.com'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[Service Worker] Caching static assets');
                return cache.addAll(STATIC_ASSETS.filter(url => !url.startsWith('http')));
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip Chrome extension and non-http(s) requests
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // Network-first strategy for AI API calls (Chrome Built-in AI)
    if (request.url.includes('ai.') || request.url.includes('chrome://')) {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    return new Response(
                        JSON.stringify({ error: 'AI feature unavailable offline' }),
                        { headers: { 'Content-Type': 'application/json' } }
                    );
                })
        );
        return;
    }

    // Cache-first strategy for static assets
    if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(request)
                        .then((response) => {
                            return caches.open(STATIC_CACHE)
                                .then((cache) => {
                                    cache.put(request, response.clone());
                                    return response;
                                });
                        });
                })
                .catch(() => {
                    // Return offline page if available
                    if (request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                })
        );
        return;
    }

    // Network-first strategy for dynamic content
    event.respondWith(
        fetch(request)
            .then((response) => {
                return caches.open(DYNAMIC_CACHE)
                    .then((cache) => {
                        cache.put(request, response.clone());
                        return response;
                    });
            })
            .catch(() => {
                return caches.match(request);
            })
    );
});

// Background sync for saving resumes
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-resumes') {
        console.log('[Service Worker] Syncing resumes...');
        event.waitUntil(
            // Placeholder for future sync logic
            Promise.resolve()
        );
    }
});

// Push notification support (for future features)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Resume optimization complete!',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-72x72.png',
        vibrate: [200, 100, 200]
    };

    event.waitUntil(
        self.registration.showNotification('ResumeGenius.AI', options)
    );
});

// Message handler for cache updates
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});
