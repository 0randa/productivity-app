import { describe, expect, test, vi } from "vitest";
import { clearGuestData, loadGuestData, saveGuestData } from "@/lib/guest-storage";

describe("guest-storage (many blackbox cases)", () => {
  test("load/save/clear roundtrip across many payload shapes", () => {
    const store = new Map();

    // minimal localStorage stub
    vi.stubGlobal("localStorage", {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    });

    // Ensure window exists so module logic runs
    vi.stubGlobal("window", {});

    let asserts = 0;
    const payloads = [];
    for (let i = 0; i < 120; i++) {
      payloads.push({
        activePokemon: i % 3 === 0 ? null : { key: `p${i}`, pokemonId: i + 1, label: `P${i}` },
        totalXp: i * 10,
        pomodorosCompleted: i % 9,
        timerSettings: { focusMinutes: 25 + (i % 5), shortBreakMinutes: 5, longBreakMinutes: 15 },
        caughtPokemon: Array.from({ length: i % 4 }, (_, j) => ({ key: `c${i}-${j}` })),
      });
    }

    for (const p of payloads) {
      saveGuestData(p);
      expect(loadGuestData()).toEqual(p);
      clearGuestData();
      expect(loadGuestData()).toBe(null);
      asserts += 2;
    }

    expect(asserts).toBe(240);
    vi.unstubAllGlobals();
  });

  test("loadGuestData returns null on malformed JSON (doesn't throw)", () => {
    const store = new Map();
    vi.stubGlobal("localStorage", {
      getItem: () => "{not-json",
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    });
    vi.stubGlobal("window", {});
    expect(loadGuestData()).toBe(null);
    vi.unstubAllGlobals();
  });

  test("saveGuestData ignores storage exceptions (doesn't throw)", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => null,
      setItem: () => {
        throw new Error("quota");
      },
      removeItem: () => {},
    });
    vi.stubGlobal("window", {});
    expect(() => saveGuestData({ a: 1 })).not.toThrow();
    vi.unstubAllGlobals();
  });
});

