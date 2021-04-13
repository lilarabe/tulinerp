
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.--------------------------------------');
  console.log(event);
  console.log(event.data);
//   if (event.data) {
//     console.log(event.data.text());
//     console.log(event.data);
//     console.log(event); 
//   }
  const title = 'title';
//   const options = {
//     body: event.data.text(),
//   };

  event.waitUntil(self.registration.showNotification(title));
});
