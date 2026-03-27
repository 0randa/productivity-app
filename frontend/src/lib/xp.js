/**
 * EXP v2 — dynamic XP computation.
 *
 * Formula:
 *   earnedXp = round(XP_BASE * difficultyMult * sessionQualityMult * streakMult * fatigueMult)
 * Clamped to [XP_MIN, XP_MAX].
 */

export const XP_BASE = 10;
export const XP_MIN  = 5;
export const XP_MAX  = 45;

export const DIFFICULTY_MULTIPLIERS = {
  easy:   1.0,
  medium: 1.25,
  hard:   1.5,
};

/** streakMultiplier(streak: number) */
export function streakMultiplier(streak) {
  if (streak >= 7) return 1.15;
  if (streak >= 4) return 1.1;
  if (streak >= 2) return 1.05;
  return 1.0;
}

/** fatigueMultiplier(dailyXpEarned: number) */
export function fatigueMultiplier(dailyXpEarned) {
  if (dailyXpEarned > 500) return 0.75;
  if (dailyXpEarned > 300) return 0.9;
  return 1.0;
}

/** Session quality for a natural (full) pomodoro completion. */
export function pomodoroQuality() {
  return 1.15;
}

/** Session quality for a pomodoro skip. ratio = elapsed/total (0–1). */
export function pomodoroSkipQuality(ratio) {
  return ratio >= 0.8 ? 1.0 : 0.85;
}

/** Session quality for a flow session. studiedSecs = seconds of focus. */
export function flowQuality(studiedSecs) {
  const minutes = studiedSecs / 60;
  if (minutes >= 45) return 1.3;
  if (minutes >= 25) return 1.15;
  if (minutes >= 10) return 1.0;
  return 0.9;
}

/**
 * Compute XP earned for completing one task.
 * @param {{ difficulty?: string, sessionQuality?: number, streak?: number, dailyXpEarned?: number }} params
 */
export function computeXp({ difficulty = 'medium', sessionQuality = 1.0, streak = 0, dailyXpEarned = 0 } = {}) {
  const diffMult    = DIFFICULTY_MULTIPLIERS[difficulty] ?? DIFFICULTY_MULTIPLIERS.medium;
  const streakMult  = streakMultiplier(streak);
  const fatigueMult = fatigueMultiplier(dailyXpEarned);
  const raw         = XP_BASE * diffMult * sessionQuality * streakMult * fatigueMult;
  return Math.max(XP_MIN, Math.min(XP_MAX, Math.round(raw)));
}

/**
 * Build a short label like "(Hard + Strong Focus + Streak)" for the status message.
 * Returns empty string when no notable factors exist.
 * @param {{ difficulty?: string, sessionQuality?: number, streak?: number, dailyXpEarned?: number }} params
 */
export function buildXpLabel({ difficulty = 'medium', sessionQuality = 1.0, streak = 0, dailyXpEarned = 0 } = {}) {
  const parts = [];
  if (difficulty === 'easy') parts.push('Easy');
  if (difficulty === 'hard') parts.push('Hard');
  if (sessionQuality >= 1.3)       parts.push('Peak Focus');
  else if (sessionQuality >= 1.15) parts.push('Strong Focus');
  else if (sessionQuality <= 0.85) parts.push('Weak Session');
  else if (sessionQuality < 1.0)   parts.push('Short Flow');
  if (streak >= 2) parts.push('Streak');
  if (dailyXpEarned > 300) parts.push('Taper');
  return parts.length > 0 ? `(${parts.join(' + ')})` : '';
}
