const CACHE_NAME = 'habitudes-shell-v6';
const APP_SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './fonts/calendar-extrabold.ttf'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (new URL(event.request.url).pathname.endsWith('/sw.js')) return;

	  event.respondWith(
	    caches.match(event.request).then((cached) => {
	      if (cached) return cached;
	      return fetch(event.request).then((response) => {
	        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
	          const clone = response.clone();
	          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
	        }
	        return response;
	      }).catch(() => caches.match('./index.html'));
	    })
	  );
});
