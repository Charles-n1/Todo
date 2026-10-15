// Service worker: keeps a copy of every file of the app,
// so it also opens WITHOUT network (metro, plane...).
// New name = new box: the old box (with old files inside) is thrown away below.
const CACHE = 'todo-v1';

self.addEventListener('install', () => self.skipWaiting());

// 🔒 Throw away OUR old boxes only (they start with "todo-").
// charles-n1.github.io is shared with your other GitHub Pages sites: we never touch their boxes.
async function deleteOldCaches() {
  for (const name of await caches.keys()) {
    if (name.startsWith('todo-') && name !== CACHE) {
      await caches.delete(name);
    }
  }
  await self.clients.claim();
}
self.addEventListener('activate', (event) => event.waitUntil(deleteOldCaches()));

// Network first (to get the new versions), the saved copy if offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // 🔒 Only our own site's files: anything from another site is not kept.
  if (new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
