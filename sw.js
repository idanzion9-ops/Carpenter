/* Carpenter — offline cache and update channel.
   Strategy: network-first for the app's own files, so a push to GitHub reaches
   installed phones on the next launch. The cache is only the offline fallback.
   Nothing here touches localStorage, so tools, sizes, notes and personal
   projects survive every update. */

var VERSION = '2026.08.25.1';
var CACHE = 'carpenter-' + VERSION;

var CORE = [
  './', 'index.html', 'manifest.webmanifest', 'version.json',
  'assets/css/style.css',
  'assets/js/version.js', 'assets/js/icons.js',
  'assets/js/art-tools.js', 'assets/js/art-projects.js', 'assets/js/art-steps.js',
  'assets/js/tools.js', 'assets/js/projects.js', 'assets/js/calc.js',
  'assets/js/store.js', 'assets/js/app.js',
  'assets/logo.svg', 'assets/icon-192.png', 'assets/icon-512.png',
  'data/community-projects.json'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // A single missing file must not abort the whole install.
      return Promise.all(CORE.map(function (url) {
        return c.add(new Request(url, { cache: 'reload' })).catch(function () {});
      }));
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

/* The page asks for the new version to take over when the user taps Update. */
self.addEventListener('message', function (e) {
  if (e.data === 'skip-waiting') self.skipWaiting();
  if (e.data === 'version' && e.source) e.source.postMessage({ version: VERSION });
});

function fresh(request) {
  return fetch(request).then(function (res) {
    if (res && res.status === 200 && res.type === 'basic') {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(request, copy); });
    }
    return res;
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var sameOrigin = new URL(req.url).origin === self.location.origin;

  if (req.mode === 'navigate') {
    // Always try the network first so a new index.html is picked up immediately.
    e.respondWith(fresh(req).catch(function () {
      return caches.match(req).then(function (hit) { return hit || caches.match('index.html'); });
    }));
    return;
  }

  if (sameOrigin) {
    e.respondWith(fresh(req).catch(function () { return caches.match(req); }));
    return;
  }

  // Fonts and other third-party assets: cache first, they rarely change.
  e.respondWith(
    caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return hit; });
    })
  );
});
