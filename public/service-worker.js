// service-worker.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

// Rota para a API de capítulos
workbox.routing.registerRoute(
  new RegExp('https://api-cartilha-teste2.onrender.com/api/capitulos?populate=*'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-capitulos-cache',
  })
);

// Rota para a API de autores
workbox.routing.registerRoute(
  new RegExp('https://api-cartilha-teste2.onrender.com/api/autors?populate=*'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-autores-cache',
  })
);

// Rota para a coleção de pesticidas e abelhas
workbox.routing.registerRoute(
  new RegExp('https://api-cartilha-teste2.onrender.com/api/pesticida-abelhas?populate=*'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-pesticida-abelhas-cache',
  })
);

// Rota para a coleção de boas práticas agroes
workbox.routing.registerRoute(
  new RegExp('https://api-cartilha-teste2.onrender.com/api/boa-pratica-agroes?populate=*'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-boa-pratica-agroes-cache',
  })
);

// Rota para a coleção de boas práticas apícolas
workbox.routing.registerRoute(
  new RegExp('https://api-cartilha-teste2.onrender.com/api/boa-pratica-apicolas?populate=*'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-boa-pratica-apicolas-cache',
  })
);

// Rota para a coleção de boas práticas de comunicação
workbox.routing.registerRoute(
  new RegExp('https://api-cartilha-teste2.onrender.com/api/boa-pratica-comunicacaos?populate=*'),
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-boa-pratica-comunicacaos-cache',
  })
);

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/capitulos') || event.request.url.includes('/api/autors')) {
    const promiseChain = fetch(event.request.clone())
      .catch(() => {
        return self.registration.sync.register('syncData');
      });
    event.waitUntil(promiseChain);
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'syncData') {
    event.waitUntil(syncData());
  }
});

function syncData() {
  return workbox.precaching.cleanupOutdatedCaches()
    .then(() => {
      return workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
    });
}

// Rotas para arquivos estáticos
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|ico|css)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'static-cache',
  })
);

// Rota para o arquivo de manifest
workbox.routing.registerRoute(
  /manifest.json$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'manifest-cache',
  })
);

// Rota para outras rotas (página principal, etc.)
workbox.routing.registerRoute(
  ({ url }) => url.origin === self.location.origin,
  new workbox.strategies.StaleWhileRevalidate()
);
