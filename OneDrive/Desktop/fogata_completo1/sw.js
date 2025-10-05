
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('fogata-cache').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/style.css',
        '/js/app.js',
        '/js/audio-recorder.js',
        '/favicon.ico',
        '/fondo.jpg'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
