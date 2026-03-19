import { describe, expect, test, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWildEncounter } from "@/hooks/use-wild-encounter";
import { CATCH_RATE, MAX_PARTY_SIZE, WILD_ENCOUNTER_CHANCE } from "@/lib/pokemon";

describe("useWildEncounter integration (many blackbox cases)", () => {
  test("does not trigger encounter when party is full", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { result } = renderHook(() => useWildEncounter({ partySize: MAX_PARTY_SIZE }));
    act(() => result.current.triggerEncounterChance());
    expect(result.current.wildPokemon).toBe(null);
    vi.restoreAllMocks();
  });

  test("encounter trigger probability boundary cases across many random values", () => {
    // ~120 cases
    const values = Array.from({ length: 120 }, (_, i) => i / 120);
    let asserts = 0;

    for (const r of values) {
      vi.spyOn(Math, "random").mockReturnValueOnce(r);
      const { result, unmount } = renderHook(() => useWildEncounter({ partySize: 0 }));
      act(() => result.current.triggerEncounterChance());
      const shouldTrigger = r < WILD_ENCOUNTER_CHANCE;
      expect(Boolean(result.current.wildPokemon)).toBe(shouldTrigger);
      asserts++;
      unmount();
      vi.restoreAllMocks();
    }

    expect(asserts).toBe(120);
  });

  test("catch success/fail boundary cases across many random values", () => {
    // Ensure an encounter exists first by forcing random < WILD_ENCOUNTER_CHANCE
    const catchValues = Array.from({ length: 120 }, (_, i) => i / 120);
    let asserts = 0;

    for (const r of catchValues) {
      vi.spyOn(Math, "random")
        .mockReturnValueOnce(0) // trigger encounter
        .mockReturnValueOnce(0) // pickRandomWild index
        .mockReturnValueOnce(r); // attempt catch

      const { result, unmount } = renderHook(() => useWildEncounter({ partySize: 0 }));
      act(() => result.current.triggerEncounterChance());
      expect(result.current.wildPokemon).not.toBe(null);

      const shouldCatch = r < CATCH_RATE;
      let caught;
      act(() => {
        caught = result.current.attemptCatch();
      });
      expect(Boolean(caught)).toBe(shouldCatch);
      expect(result.current.catchResult).toBe(shouldCatch ? "success" : "fail");
      asserts += 2;

      unmount();
      vi.restoreAllMocks();
    }

    // 120 iterations * 2 expects
    expect(asserts).toBe(240);
  });
});

