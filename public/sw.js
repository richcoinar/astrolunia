const CACHE_NAME = 'astrolunia-static-v1';
const ASSETS = ['/offline.html','/icons/icon-192.png','/icons/icon-512.png'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key))))); self.clients.claim(); });
self.addEventListener('fetch', event => {
 const request=event.request;
 if(request.method !== 'GET'|| new URL(request.url).origin !== self.location.origin) return;
 if(request.mode === 'navigate') {
   event.respondWith(fetch(request).catch(()=>caches.match('/offline.html')));
 }
});
