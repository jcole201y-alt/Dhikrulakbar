// Offline cache: cache-first for the app shell and fonts. Bump VERSION to push an update.
const VERSION='sufi-v1';
const FILES=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png',
 'fonts/source-serif-4-latin-400-normal.woff2','fonts/source-serif-4-latin-400-italic.woff2','fonts/source-serif-4-latin-600-normal.woff2',
 'fonts/source-serif-4-latin-ext-400-normal.woff2','fonts/source-serif-4-latin-ext-400-italic.woff2','fonts/source-serif-4-latin-ext-600-normal.woff2',
 'fonts/marcellus-latin-400-normal.woff2','fonts/marcellus-latin-ext-400-normal.woff2','fonts/amiri-arabic-400-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{
  if(res&&res.ok&&new URL(e.request.url).origin===location.origin){const cp=res.clone();caches.open(VERSION).then(c=>c.put(e.request,cp))}
  return res}).catch(()=>caches.match('index.html'))));
});
