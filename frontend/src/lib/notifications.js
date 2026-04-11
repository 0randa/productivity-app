/**
 * Browser Notification helpers for timer completion.
 * Falls back silently when the Notifications API is unavailable or denied.
 */

export async function requestNotificationPermission() {
  if (typeof Notification === "undefined") return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  try {
    const result = await Notification.requestPermission();
    return result === "granted";
  } catch {
    return false;
  }
}

export function sendTimerNotification(title, body) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") {
    return false;
  }

  try {
    const n = new Notification(title, {
      body,
      // Add icon: "/icon.png" once an app icon exists in public/
      tag: "pomopet-timer",
      renotify: true,
    });
    // Auto-close after 8 seconds
    setTimeout(() => n.close(), 8000);
    return true;
  } catch {
    // Notification constructor can throw in some environments (e.g. Android WebView)
    return false;
  }
}
