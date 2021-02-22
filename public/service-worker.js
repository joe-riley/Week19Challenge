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

// Install the service worker
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Files are pre-cached succesfully!');
      return cache.addAll(FILES_TO_CACHE);
    })
  )

  self.skipWaiting();
})

// Activate the service worker and remove old data from the cache
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('removing old cache data', key);
            return caches.delete(key);
          }
        })
      )
    })
  )
  self.clients.claim();
})

// Intercept fetch requests
self.addEventListener('fetch', evt => {
  console.log('Fetching items from: ' + evt.request.url);
  evt.respondWith(
    caches.match(evt.request).then(req => {
      if (req) {
        console.log('Responding with cache' + evt.request.url);
        return req;
      } else {
        console.log('File is not cached, fetching: ' + evt.request.url);
        return await fetch(evt.request);
      }
    })  
  )

  return;
})
