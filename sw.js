var CACHE_NAME = 'hextris-v3';

// install service worker on first install and load cache assets.
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      fetch('js/assets.json').then(function(response) {
        return response.json();
      }).catch(function(err) {
        console.log('json fetch err:', err);
      }).then(function(assetManifest) { 
        let cacheFiles = assetManifest.cache;
        cache.addAll(cacheFiles);
      }).catch(function(err) {
        console.log('problem adding to cache:', err);
      })
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
    
      if(request.cache === 'only-if-cached') {
        return fetch(request, {mode: "same-origin"}).then(networkResponse => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        })      
      } else {
        return fetch(request).then(networkResponse => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        })      
      }
    });
  });
};

// Delete any unused old caches when a new service worker is activated
self.addEventListener('activate', function(event) {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then(function(cacheNames) {
        cacheNames.filter(function(cacheName) {
          if(cacheName.startsWith('hextris') && cacheName !== CACHE_NAME) {
          caches.delete(cacheName);
          }
        })
      })
     ]
    )
  )
});

// listen to messages and skip waiting state of service worker
// this basically activates service worker when notification recieved.
self.addEventListener('message', function(event) {
  if(event.data.activate == 'true');
    self.skipWaiting();
});