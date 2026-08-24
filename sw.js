/* Carpenter — a small offline cache so the app works in a workshop with no signal. */
var CACHE = 'carpenter-v1';
var ASSETS = [
  './', 'index.html', 'manifest.webmanifest',
  'assets/css/style.css',
  'assets/js/icons.js', 'assets/js/tools.js', 'assets/js/projects.js',
  'assets/js/calc.js', 'assets/js/store.js', 'assets/js/app.js'
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return res;
      }).catch(function () { return caches.match('index.html'); });
    })
  );
});
