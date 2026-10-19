/* 仅缓存本站的页面文件；缓存按 GitHub Pages 项目路径隔离。 */
const PREFIX = 'our-little-days:' + new URL(self.registration.scope).pathname + ':';
const CACHE = PREFIX + '20261019-2';
const CORE = ['./', './index.html', './styles.css?v=20261019-2', './app.js?v=20261019-2'];
const OPTIONAL = ['./manifest.webmanifest', './icon-192.png', './icon-512.png'];
const FILES = CORE.concat(OPTIONAL).map(function (p) { return new URL(p, self.registration.scope).pathname; });

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE).then(function (cache) {
    return Promise.all(CORE.map(function (p) {
      return cache.add(new Request(new URL(p, self.registration.scope), { cache: 'reload' }));
    })).then(function () {
      return Promise.all(OPTIONAL.map(function (p) {
        return cache.add(new Request(new URL(p, self.registration.scope), { cache: 'reload' })).catch(function () {});
      }));
    });
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) {
      return k.indexOf(PREFIX) === 0 && k !== CACHE;
    }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin || FILES.indexOf(url.pathname) < 0) return;
  if (Array.from(url.searchParams.keys()).some(function (k) { return k !== 'v'; })) return;

  event.respondWith(caches.open(CACHE).then(async function (cache) {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 5000);
    try {
      var res = await fetch(new Request(req, { cache: 'no-cache', signal: controller.signal }));
      if (res.status >= 500) throw new Error('server unavailable');
      if (res.ok) {
        try { await cache.put(req, res.clone()); } catch (e) { /* 缓存空间不足 */ }
      }
      return res;
    } catch (err) {
      var hit = await cache.match(req);
      if (!hit && req.mode === 'navigate') hit = await cache.match(new URL('./index.html', self.registration.scope));
      return hit || new Response('暂时离线，请联网后重新打开。', {
        status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    } finally {
      clearTimeout(timer);
    }
  }));
});
