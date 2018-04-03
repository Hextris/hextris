var CACHE_NAME = 'hextris-v1';
var urlsToCache = [
    'index.html',
    'vendor/hammer.min.js',
    'vendor/js.cookie.js',
    'vendor/jsonfn.min.js',
    'vendor/keypress.min.js',
    'vendor/jquery.js',
    'js/save-state.js',
    'js/view.js',
    'js/wavegen.js',
    'js/math.js',
    'js/Block.js',
    'js/Hex.js',
    'js/Text.js',
    'js/comboTimer.js',
    'js/checking.js',
    'js/update.js',
    'js/render.js',
    'js/input.js',
    'js/main.js',
    'js/initialization.js',
    'http://fonts.googleapis.com/css?family=Exo+2',
    'style/fa/css/font-awesome.min.css',
    'style/style.css',
    'style/rrssb.css',
    'vendor/rrssb.min.js',
    'vendor/sweet-alert.min.js'    
];

// install service worker on first install and load cache assets.
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// respond to fetch requests by browser using service worker.
self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);
    
  if (requestUrl.origin === location.origin) {
    event.respondWith(getNetworkResponse(event.request));
    return;
  }
    
  event.respondWith(fetch(event.request));
});

// If asset exists in cache, respond with cache, 
// otherwise respond from network after putting asset in cache.
function getNetworkResponse(request) {  
  return caches.open(CACHE_NAME).then(cache => {
    return cache.match(request).then(response => {
      if (response) return response;

      return fetch(request).then(networkResponse => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      })
    });
  });
};