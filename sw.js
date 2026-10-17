/* 两人小日子 · Service Worker
 *
 * 策略：**网络优先，失败才用缓存**。
 *   为什么不用「缓存优先」？因为我们会不断往 GitHub 上传新版本，
 *   缓存优先会导致手机上一直看到旧版。网络优先保证「在线时永远是最新的」，
 *   同时断网时还能打开最后一次成功加载的版本。
 *
 * 只处理同源 GET；Supabase 的接口和图片（跨域）完全不插手。
 */

const CACHE = 'our-little-days-v1';

const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(ASSETS); })
      .catch(function () { /* 有单个文件失败也不阻塞安装 */ })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE; })
          .map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;   // 跨域一律交给浏览器

  event.respondWith(
    fetch(req)
      .then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(req, copy);
          }).catch(function () { /* 配额满了就算了 */ });
        }
        return res;
      })
      .catch(function () {
        return caches.match(req).then(function (hit) {
          if (hit) return hit;
          if (req.mode === 'navigate') return caches.match('./index.html');
          return Response.error();
        });
      })
  );
});
