const CACHE_NAME = 'birthday-app-v4';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.svg',
  '/icon-512.svg'
];
const CDN_ASSETS = [
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

// Install: 정적 파일 + CDN 파일 모두 캐싱
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      const staticPromise = cache.addAll(STATIC_ASSETS);
      const cdnPromise = Promise.allSettled(
        CDN_ASSETS.map(url => fetch(url).then(r => {
          if (r.ok) return cache.put(url, r);
        }))
      );
      return Promise.all([staticPromise, cdnPromise]);
    })
  );
  // skipWaiting은 사용자 확인 후 message로 호출됨
});

// Activate: 이전 캐시 삭제
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: HTML(네비게이션)은 Network-First, 나머지는 Cache-First
self.addEventListener('fetch', event => {
  const request = event.request;

  // HTML 페이지 요청 (네비게이션) → Network First
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then(response => {
        // 네트워크 성공 → 캐시 갱신 후 응답
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // 오프라인 → 캐시에서 서빙
        return caches.match('/index.html');
      })
    );
    return;
  }

  // 그 외 (JS, CSS, 이미지, CDN) → Cache First
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok && request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => new Response('Offline', { status: 503 }));
    })
  );
});

// Message: 클라이언트에서 skipWaiting 요청 시 즉시 활성화
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
