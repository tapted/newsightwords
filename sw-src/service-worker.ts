import {
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';

// Used for filtering matches based on status code, header, or both
import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {registerRoute} from 'workbox-routing';

registerRoute(
    new RegExp('/.*'),
    // Use a Network First caching strategy
    new NetworkFirst({
    // Put all cached files in a cache named 'pages'
      cacheName: 'pages',
      plugins: [
      // Ensure that only requests that result in a 200 status are cached
        new CacheableResponsePlugin({
          statuses: [200],
        }),
      ],
    }),
);

registerRoute(
    new RegExp('https://cdn.jsdelivr.net/.*'),
    new StaleWhileRevalidate({}),
);

registerRoute(
    new RegExp('https://fonts.googleapis.com/.*'),
    new StaleWhileRevalidate({}),
);

registerRoute(
    new RegExp('https://fonts.gstatic.com/.*'),
    new StaleWhileRevalidate({}),
);
