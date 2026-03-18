/**
 * Guest progress — persisted in localStorage.
 * Stores: activePokemon, totalXp, pomodorosCompleted, timerSettings.
 * All reads/writes are wrapped in try/catch so storage errors never crash the app.
 */

const KEY = "pomopet_guest";

export function loadGuestData() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveGuestData(data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage quota exceeded or private-browsing restriction — silently ignore
  }
}

export function clearGuestData() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {}
}
