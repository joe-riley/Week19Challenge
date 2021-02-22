// Uncomment the lines below to set up the cache files

const CACHE_NAME = 'budget-tracker-cache-v1';
const DATA_CACHE_NAME = 'budget-data-cache-v1';

const FILES_TO_CACHE = [
  '/',
  'manifest.json',
  'css/styles.css',
  'icons/icon-72x72.png',
  'icons/icon-96x96.png',
  'icons/icon-128x128.png',
  'icons/icon-144x144.png',
  'icons/icon-152x152.png',
  'icons/icon-192x192.png',
  'icons/icon-384x384.png',
  'icons/icon-512x512.png',
  'js/index.js',
  'js/idb.js',
  'index.html',
];

// install
self.addEventListener("install", function (evt) {
  evt.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Your files were pre-cached successfully!");
        cache
          .addAll(FILES_TO_CACHE)
          .then((result) => {
            // debugger;
            console.log("result of add all", result);
          })
          .catch((err) => {
            // debugger;
            console.log("Add all error: ", err);
          });
      })
      .catch((err) => {
        console.log(err);
      })
  );

  self.skipWaiting();
});

// activate
self.addEventListener("activate", function (evt) {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});
// Intercept fetch requests
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(evt.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(evt.request, responseToCache);
              });

            return response;
          }
        )
        .catch(err => console.log(err));
      })
    );
});
