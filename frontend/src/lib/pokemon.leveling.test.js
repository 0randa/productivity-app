import { describe, expect, test } from "vitest";
import {
  calculateLevelFromExperience,
  getExperienceForLevel,
} from "@/lib/pokemon";

const makeLevels = (maxLevel, step) =>
  Array.from({ length: maxLevel }, (_, idx) => ({
    level: idx + 1,
    experience: idx * step,
  }));

describe("pokemon leveling utilities (many blackbox cases)", () => {
  test("getExperienceForLevel: table lookup across many levels", () => {
    const levels = makeLevels(100, 100);
    let asserts = 0;
    for (let lvl = 1; lvl <= 100; lvl++) {
      expect(getExperienceForLevel(levels, lvl)).toBe((lvl - 1) * 100);
      asserts++;
    }
    // missing levels should be 0 by implementation
    expect(getExperienceForLevel(levels, 999)).toBe(0);
    expect(getExperienceForLevel([], 1)).toBe(0);
    asserts += 2;
    expect(asserts).toBe(102);
  });

  test("calculateLevelFromExperience: monotonic behavior across many experience values", () => {
    const levels = makeLevels(50, 75);
    let asserts = 0;

    // For each threshold, check just-below, at, and just-above.
    for (let lvl = 1; lvl <= 50; lvl++) {
      const xp = (lvl - 1) * 75;
      const below = xp - 1;
      const above = xp + 1;

      if (below >= 0) {
        expect(calculateLevelFromExperience(levels, below)).toBe(lvl - 1);
        asserts++;
      }
      expect(calculateLevelFromExperience(levels, xp)).toBe(lvl);
      expect(calculateLevelFromExperience(levels, above)).toBe(lvl);
      asserts += 2;
    }

    // very large XP should resolve to max table level
    expect(calculateLevelFromExperience(levels, 999999)).toBe(50);
    asserts++;

    expect(asserts).toBe(150);
  });
});

