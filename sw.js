const CACHE_NAME = 'pwa-install-demo-v1';
const urlsToCache = [
    'PWA/',
    'PWA/index.html',
    'PWA/styles.css',
    'PWA/app.js',
    'PWA/manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});
