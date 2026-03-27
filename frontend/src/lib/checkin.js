export const CHECKIN_XP = 25;
export const CHECKIN_POKEDOLLARS = 10;

/** Returns today's date as 'YYYY-MM-DD' in local time. */
export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Returns yesterday's date as 'YYYY-MM-DD' in local time. */
export function yesterdayStr() {
  const d = new Date(Date.now() - 86_400_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Returns the ISO week number (1–53) for a 'YYYY-MM-DD' date string.
 * Uses ISO 8601: weeks start on Monday.
 */
export function isoWeek(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Shift to nearest Thursday; make Sunday = 7
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / 86_400_000 + 1) / 7);
}

/**
 * Computes the new streak and longest_streak after a check-in claim.
 * @param {number} currentStreak
 * @param {string|null} lastStreakDate - 'YYYY-MM-DD' or null
 * @param {string} today - 'YYYY-MM-DD'
 * @param {number} [longestStreak=currentStreak]
 * @returns {{ streak: number, longest: number }}
 */
export function computeNextStreak(currentStreak, lastStreakDate, today, longestStreak = currentStreak) {
  if (lastStreakDate === today) {
    return { streak: currentStreak, longest: longestStreak };
  }
  const d = new Date(today + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  const yStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const newStreak = lastStreakDate === yStr ? currentStreak + 1 : 1;
  return { streak: newStreak, longest: Math.max(longestStreak, newStreak) };
}

/**
 * Returns true if a new weekly shield should be granted on this check-in.
 * @param {string|null} lastCheckinDate - previous last_checkin_date
 * @param {string} today - 'YYYY-MM-DD'
 */
export function shouldGrantShield(lastCheckinDate, today) {
  if (!lastCheckinDate) return true;
  return isoWeek(lastCheckinDate) !== isoWeek(today);
}

/**
 * Returns true if the user can activate a streak shield right now.
 * Requires: ≥1 shield AND last_streak_date is exactly 2 days ago.
 * @param {number} shieldsAvailable
 * @param {string|null} lastStreakDate - 'YYYY-MM-DD' or null
 * @param {string} today - 'YYYY-MM-DD'
 */
export function canActivateShield(shieldsAvailable, lastStreakDate, today) {
  if (shieldsAvailable < 1 || !lastStreakDate) return false;
  const last = new Date(lastStreakDate + 'T00:00:00');
  const now  = new Date(today + 'T00:00:00');
  const diffDays = Math.round((now - last) / 86_400_000);
  return diffDays === 2;
}
