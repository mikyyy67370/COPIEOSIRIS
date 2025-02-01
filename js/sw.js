const CACHE_NAME = 'osiris-cache-v1';
const IMAGES_CACHE = 'osiris-images-v1';

// Assets à mettre en cache immédiatement
const PRECACHE_ASSETS = [
    './images/collection4.jpg',
    './images/anubis-detail1.jpg',
    './images/anubis-detail2.jpg',
    './images/anubis-detail3.jpg',
    './images/anubis-packaging.jpg'
];

// Service Worker pour la mise en cache
const ASSETS_TO_CACHE = [
    '/',
    '/css/style.css',
    '/css/mobile.css',
    '/js/main.js',
    '/fonts/Marcellus-Regular.woff2',
    // ... autres ressources ...
];

// Installation du Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME),
            caches.open(IMAGES_CACHE)
        ]).then(([cache]) => {
            // Tenter de mettre en cache les assets, mais ne pas bloquer si ça échoue
            cache.addAll(PRECACHE_ASSETS).catch(() => {
                console.log('Certains assets n\'ont pas pu être mis en cache');
            });
        })
    );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName.startsWith('osiris-') &&
                                   cacheName !== CACHE_NAME &&
                                   cacheName !== IMAGES_CACHE;
                        })
                        .map(cacheName => caches.delete(cacheName))
                );
            })
            .catch(() => {
                // Ignorer les erreurs de nettoyage du cache
            })
    );
});

// Stratégie de cache pour les requêtes
self.addEventListener('fetch', event => {
    // Ne pas intercepter les requêtes non GET
    if (event.request.method !== 'GET') return;

    // Ne pas intercepter les requêtes vers d'autres domaines
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(response => {
                        // Ne mettre en cache que les réponses valides
                        if (!response || response.status !== 200) {
                            return response;
                        }

                        // Cloner la réponse avant de la mettre en cache
                        const responseToCache = response.clone();

                        // Tenter de mettre en cache, mais ne pas bloquer si ça échoue
                        const cacheStorage = event.request.destination === 'image' ? IMAGES_CACHE : CACHE_NAME;
                        caches.open(cacheStorage)
                            .then(cache => cache.put(event.request, responseToCache))
                            .catch(() => {
                                // Ignorer les erreurs de mise en cache
                            });

                        return response;
                    })
                    .catch(() => {
                        // En cas d'erreur réseau, essayer de servir une version en cache
                        return caches.match(event.request);
                    });
            })
    );
});
