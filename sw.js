const CACHE_NAME = 'nuudesk-v1.5';

// Install Event: Skip waiting to activate immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate Event: Claim clients so we can control the page immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Helper to show notification from the SW context
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, icon } = event.data.payload;
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            vibrate: [200, 100, 200],
            tag: 'nuudesk-alert',
            data: { dateOfArrival: Date.now() }
        });
    }
});

// Handle Notification Clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Focus the open window if available, or open a new one
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus();
            }
            return clients.openWindow('./index.html');
        })
    );
});
