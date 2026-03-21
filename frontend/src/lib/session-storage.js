/**
 * Session-scoped persistence — survives page refreshes but not explicit resets.
 * Stores: tasks, timer state, available task claims, session stats.
 * Separate from guest-storage (which handles long-term progress like XP/Pokemon).
 */

const KEY = "pomopet_session";

export function loadSessionData() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSessionData(data) {
  if (typeof window === "undefined") return;
  try {
    const prev = loadSessionData() ?? {};
    localStorage.setItem(KEY, JSON.stringify({ ...prev, ...data }));
  } catch {}
}
