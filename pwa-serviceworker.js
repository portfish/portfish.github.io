const cacheName = 'PortFish-cache-v1';
self.addEventListener('install', function(event) {
	// Perform install steps
	event.waitUntil(
		caches.open(cacheName).then(function(cache) {
			return cache.addAll(
				[
					'/'
				]).then(() => self.skipWaiting());
		})
	);
});
self.addEventListener('activate', event => {
	event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', function(event) {
	// console.log('Fetching:', event.request.url);
	var regex = /https://portfish.net\/.*/;  // var regex = /https:\/\/www.googleapis.com\/youtube\/v3\/playlistItems/;
	if (event.request.url.match(regex)) {
		// console.log('Worker Fetching:', event.request.url);
		event.respondWith(
			caches.open(cacheName).then(function(cache) {
				return cache.match(event.request, {ignoreSearch: true}).then(function (response) {
					return response || fetch(event.request).then(function(response) {
					cache.put(event.request, response.clone());
						return response;
					});
				});
			})
		);
	}
});

