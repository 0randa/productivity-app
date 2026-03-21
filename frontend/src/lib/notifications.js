/**
 * Browser Notification helpers for timer completion.
 * Falls back silently when the Notifications API is unavailable or denied.
 */

let permissionGranted = typeof Notification !== "undefined" && Notification.permission === "granted";

export function requestNotificationPermission() {
  if (typeof Notification === "undefined") return;
  if (Notification.permission === "granted") {
    permissionGranted = true;
    return;
  }
  if (Notification.permission === "denied") return;

  Notification.requestPermission().then((result) => {
    permissionGranted = result === "granted";
  });
}

export function sendTimerNotification(title, body) {
  if (!permissionGranted) return;

  try {
    const n = new Notification(title, {
      body,
      // Add icon: "/icon.png" once an app icon exists in public/
      tag: "pomopet-timer",
      renotify: true,
    });
    // Auto-close after 8 seconds
    setTimeout(() => n.close(), 8000);
  } catch {
    // Notification constructor can throw in some environments (e.g. Android WebView)
  }
}
