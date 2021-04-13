





  // importScripts('workbox-sw.prod.v2.1.2.js');

  // const workboxSW = new self.WorkboxSW({
  //   skipWaiting: true,
  //   clientsClaim: true
  // });

  // /* 数据缓存策略 */
  // const dataStrategy = workboxSW.strategies.networkFirst({
  //   cacheName: 'data',
  //   cacheExpiration: {
  //     maxEntries: 1000,
  //     maxAgeSeconds: 1 * 24 * 60 * 60,
  //   },
  //   cacheableResponse: {statuses: [0, 200]},
  //   networkTimeoutSeconds: 10
  // });

  // /* 动态图片缓存策略 */
  // const imagesStrategy = workboxSW.strategies.cacheFirst({
  //   cacheName: 'images',
  //   cacheExpiration: {
  //     maxEntries: 1000,
  //     maxAgeSeconds: 7 * 24 * 60 * 60,
  //   },
  //   cacheableResponse: {statuses: [0, 200]}
  // });

  // /* 字体缓存策略 */
  // const fontStrategy = workboxSW.strategies.cacheFirst({
  //   cacheName: 'font',
  //   cacheExpiration: {
  //     maxEntries: 100,
  //     maxAgeSeconds: 10 * 365 * 24 * 60 * 60,
  //   },
  //   cacheableResponse: {statuses: [0, 200]}
  // });

  // const matchDataFunction = ({url, event}) => {
  //   // return new RegExp("php").test(url.href);
  // };

  // const matchImagesFunction = ({url, event}) => {
  //   return new RegExp(".*\.(?:png|jpg|jpeg|gif)").test(url.href);
  // };

  // const matchFontFunction = ({url, event}) => {
  //   return new RegExp(".*\.(?:eot|svg|ttf|woff|woff2)").test(url.href);
  // };

  // /* 数据缓存 */
  // workboxSW.router.registerRoute(
  //   matchDataFunction,
  //   dataStrategy
  // );

  // /* 图片缓存 */
  // workboxSW.router.registerRoute(
  //   matchImagesFunction,
  //   imagesStrategy
  // );

  // /* 字体缓存 */
  // workboxSW.router.registerRoute(
  //   matchFontFunction,
  //   fontStrategy
  // );

  // workboxSW.precache([]);


  // self.addEventListener('notificationclick', function(event) {
  //   console.log('[Service Worker] Notification click Received.');

  //   event.notification.close();

  //   event.waitUntil(
  //     clients.openWindow('http://localhost:8100')
  //   );
  // });
