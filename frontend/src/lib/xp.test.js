import { describe, test, expect } from 'vitest';
import {
  computeXp,
  streakMultiplier,
  fatigueMultiplier,
  flowQuality,
  pomodoroSkipQuality,
  buildXpLabel,
  XP_MIN,
  XP_MAX,
} from './xp.js';

describe('streakMultiplier', () => {
  test('0 days → 1.0',  () => expect(streakMultiplier(0)).toBe(1.0));
  test('1 day → 1.0',   () => expect(streakMultiplier(1)).toBe(1.0));
  test('2 days → 1.05', () => expect(streakMultiplier(2)).toBe(1.05));
  test('4 days → 1.1',  () => expect(streakMultiplier(4)).toBe(1.1));
  test('7 days → 1.15', () => expect(streakMultiplier(7)).toBe(1.15));
  test('10 days → 1.15 (cap)', () => expect(streakMultiplier(10)).toBe(1.15));
});

describe('fatigueMultiplier', () => {
  test('0 XP → 1.0',       () => expect(fatigueMultiplier(0)).toBe(1.0));
  test('300 XP → 1.0',     () => expect(fatigueMultiplier(300)).toBe(1.0));
  test('301 XP → 0.9',     () => expect(fatigueMultiplier(301)).toBe(0.9));
  test('500 XP → 0.9',     () => expect(fatigueMultiplier(500)).toBe(0.9));
  test('501 XP → 0.75',    () => expect(fatigueMultiplier(501)).toBe(0.75));
});

describe('pomodoroSkipQuality', () => {
  test('80% ratio → 1.0',  () => expect(pomodoroSkipQuality(0.8)).toBe(1.0));
  test('100% ratio → 1.0', () => expect(pomodoroSkipQuality(1.0)).toBe(1.0));
  test('79% ratio → 0.85', () => expect(pomodoroSkipQuality(0.79)).toBe(0.85));
  test('0% ratio → 0.85',  () => expect(pomodoroSkipQuality(0)).toBe(0.85));
});

describe('flowQuality', () => {
  test('9m → 0.9',  () => expect(flowQuality(9 * 60)).toBe(0.9));
  test('10m → 1.0', () => expect(flowQuality(10 * 60)).toBe(1.0));
  test('25m → 1.15',() => expect(flowQuality(25 * 60)).toBe(1.15));
  test('45m → 1.3', () => expect(flowQuality(45 * 60)).toBe(1.3));
  test('90m → 1.3', () => expect(flowQuality(90 * 60)).toBe(1.3));
});

describe('computeXp', () => {
  test('easy + normal → 10',   () => expect(computeXp({ difficulty: 'easy',   sessionQuality: 1.0 })).toBe(10));
  test('medium + normal → 13', () => expect(computeXp({ difficulty: 'medium', sessionQuality: 1.0 })).toBe(13));
  test('hard + normal → 15',   () => expect(computeXp({ difficulty: 'hard',   sessionQuality: 1.0 })).toBe(15));
  test('hard + peak focus → 20', () => {
    // 10 * 1.5 * 1.3 = 19.5 → 20
    expect(computeXp({ difficulty: 'hard', sessionQuality: 1.3 })).toBe(20);
  });
  test('hard + strong focus + streak 7 → 20', () => {
    // 10 * 1.5 * 1.15 * 1.15 = 19.84 → 20
    expect(computeXp({ difficulty: 'hard', sessionQuality: 1.15, streak: 7 })).toBe(20);
  });
  test('result is always >= XP_MIN', () => {
    expect(computeXp({ difficulty: 'easy', sessionQuality: 0.85, dailyXpEarned: 600 })).toBeGreaterThanOrEqual(XP_MIN);
  });
  test('result is always <= XP_MAX', () => {
    expect(computeXp({ difficulty: 'hard', sessionQuality: 1.3, streak: 10 })).toBeLessThanOrEqual(XP_MAX);
  });
  test('taper at 400 XP reduces output vs 0 XP', () => {
    const base   = computeXp({ difficulty: 'medium', sessionQuality: 1.0, dailyXpEarned: 0 });
    const tapered = computeXp({ difficulty: 'medium', sessionQuality: 1.0, dailyXpEarned: 400 });
    expect(tapered).toBeLessThan(base);
  });
  test('heavy taper at 600 XP reduces further', () => {
    const mid  = computeXp({ difficulty: 'medium', sessionQuality: 1.0, dailyXpEarned: 400 });
    const high = computeXp({ difficulty: 'medium', sessionQuality: 1.0, dailyXpEarned: 600 });
    expect(high).toBeLessThan(mid);
  });
  test('defaults to medium difficulty when omitted', () => {
    expect(computeXp({ sessionQuality: 1.0 })).toBe(13);
  });
});

describe('buildXpLabel', () => {
  test('all defaults → empty string', () => expect(buildXpLabel()).toBe(''));
  test('hard → "(Hard)"',             () => expect(buildXpLabel({ difficulty: 'hard' })).toBe('(Hard)'));
  test('easy → "(Easy)"',             () => expect(buildXpLabel({ difficulty: 'easy' })).toBe('(Easy)'));
  test('medium → empty',              () => expect(buildXpLabel({ difficulty: 'medium' })).toBe(''));
  test('strong focus → "(Strong Focus)"',
    () => expect(buildXpLabel({ sessionQuality: 1.15 })).toBe('(Strong Focus)'));
  test('peak focus → "(Peak Focus)"',
    () => expect(buildXpLabel({ sessionQuality: 1.3 })).toBe('(Peak Focus)'));
  test('weak session → "(Weak Session)"',
    () => expect(buildXpLabel({ sessionQuality: 0.85 })).toBe('(Weak Session)'));
  test('streak ≥ 2 → includes Streak',
    () => expect(buildXpLabel({ streak: 3 })).toContain('Streak'));
  test('streak 1 → no Streak',
    () => expect(buildXpLabel({ streak: 1 })).toBe(''));
  test('taper → includes Taper',
    () => expect(buildXpLabel({ dailyXpEarned: 400 })).toContain('Taper'));
  test('multiple factors combined', () => {
    expect(buildXpLabel({ difficulty: 'hard', sessionQuality: 1.15, streak: 3 }))
      .toBe('(Hard + Strong Focus + Streak)');
  });
});
