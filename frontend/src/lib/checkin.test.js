import { describe, test, expect } from 'vitest';
import {
  todayStr,
  yesterdayStr,
  isoWeek,
  computeNextStreak,
  shouldGrantShield,
  canActivateShield,
  CHECKIN_XP,
  CHECKIN_POKEDOLLARS,
} from './checkin.js';

describe('todayStr / yesterdayStr', () => {
  test('todayStr returns YYYY-MM-DD format', () => {
    expect(todayStr()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  test('yesterdayStr is one calendar day before todayStr', () => {
    const t = new Date(todayStr() + 'T12:00:00');
    const y = new Date(yesterdayStr() + 'T12:00:00');
    const diffMs = t - y;
    // Should be roughly 1 day (allow for DST: 23h to 25h)
    expect(diffMs).toBeGreaterThan(22 * 60 * 60 * 1000);
    expect(diffMs).toBeLessThan(26 * 60 * 60 * 1000);
  });
});

describe('isoWeek', () => {
  test('returns a number 1–53', () => {
    const w = isoWeek('2026-03-27');
    expect(w).toBeGreaterThanOrEqual(1);
    expect(w).toBeLessThanOrEqual(53);
  });
  test('different weeks for consecutive Mondays', () => {
    expect(isoWeek('2026-03-23')).not.toBe(isoWeek('2026-03-30'));
  });
  test('same week for Mon and Sun of same ISO week', () => {
    // 2026-03-23 (Mon) and 2026-03-29 (Sun) are the same ISO week
    expect(isoWeek('2026-03-23')).toBe(isoWeek('2026-03-29'));
  });
});

describe('computeNextStreak', () => {
  test('null lastStreakDate → streak resets to 1', () => {
    expect(computeNextStreak(5, null, '2026-03-27')).toEqual({ streak: 1, longest: 5 });
  });
  test('lastStreakDate is today → no change', () => {
    expect(computeNextStreak(5, '2026-03-27', '2026-03-27')).toEqual({ streak: 5, longest: 5 });
  });
  test('lastStreakDate is yesterday → increments', () => {
    expect(computeNextStreak(5, '2026-03-26', '2026-03-27')).toEqual({ streak: 6, longest: 6 });
  });
  test('lastStreakDate is 2 days ago → resets to 1', () => {
    expect(computeNextStreak(5, '2026-03-25', '2026-03-27')).toEqual({ streak: 1, longest: 5 });
  });
  test('increment updates longest when new streak exceeds it', () => {
    expect(computeNextStreak(9, '2026-03-26', '2026-03-27')).toEqual({ streak: 10, longest: 10 });
  });
  test('increment does not lower longest when longestStreak param exceeds new streak', () => {
    // longest was 20, current is 5 incremented to 6 — longest stays 20
    expect(computeNextStreak(5, '2026-03-26', '2026-03-27', 20)).toEqual({ streak: 6, longest: 20 });
  });
});

describe('shouldGrantShield', () => {
  test('null lastCheckinDate → grant shield (first ever check-in)', () => {
    expect(shouldGrantShield(null, '2026-03-27')).toBe(true);
  });
  test('same ISO week → do not grant', () => {
    // 2026-03-23 (Mon) and 2026-03-27 (Fri) are same ISO week
    expect(shouldGrantShield('2026-03-23', '2026-03-27')).toBe(false);
  });
  test('different ISO week → grant', () => {
    // 2026-03-27 (Fri week 13) → 2026-03-30 (Mon week 14)
    expect(shouldGrantShield('2026-03-27', '2026-03-30')).toBe(true);
  });
});

describe('canActivateShield', () => {
  test('no shields → false', () => {
    expect(canActivateShield(0, '2026-03-25', '2026-03-27')).toBe(false);
  });
  test('shield available, lastStreakDate yesterday → streak intact, cannot activate', () => {
    expect(canActivateShield(1, '2026-03-26', '2026-03-27')).toBe(false);
  });
  test('shield available, lastStreakDate today → streak intact, cannot activate', () => {
    expect(canActivateShield(1, '2026-03-27', '2026-03-27')).toBe(false);
  });
  test('shield available, lastStreakDate exactly 2 days ago → can activate', () => {
    expect(canActivateShield(1, '2026-03-25', '2026-03-27')).toBe(true);
  });
  test('shield available, lastStreakDate 3+ days ago → gap too large, cannot activate', () => {
    expect(canActivateShield(1, '2026-03-20', '2026-03-27')).toBe(false);
  });
  test('shield available, null lastStreakDate → cannot activate (no streak to protect)', () => {
    expect(canActivateShield(1, null, '2026-03-27')).toBe(false);
  });
});

describe('constants', () => {
  test('CHECKIN_XP is 25', () => expect(CHECKIN_XP).toBe(25));
  test('CHECKIN_POKEDOLLARS is 10', () => expect(CHECKIN_POKEDOLLARS).toBe(10));
});
