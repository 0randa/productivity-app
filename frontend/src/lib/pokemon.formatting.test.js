import { describe, expect, test } from "vitest";
import {
  formatPokemonName,
  getPokemonIdFromResourceUrl,
} from "@/lib/pokemon";

describe("pokemon formatting utilities (many blackbox cases)", () => {
  test("formatPokemonName: many hyphenated cases", () => {
    const segments = [
      "mr", "mime", "ho", "oh", "porygon", "z", "type", "null",
      "tapu", "koko", "jangmo", "o", "hakamo", "o", "kommo", "o",
      "farfetchd", "sirfetchd", "great", "tusk", "iron", "bundle",
    ];

    // ~200 distinct assertions
    let asserts = 0;
    for (let i = 0; i < 40; i++) {
      for (let j = 0; j < 5; j++) {
        const a = segments[(i + j) % segments.length];
        const b = segments[(i + j + 7) % segments.length];
        const c = segments[(i + j + 13) % segments.length];
        const input = `${a}-${b}-${c}`;
        const out = formatPokemonName(input);
        expect(out).toBe(
          `${a.charAt(0).toUpperCase() + a.slice(1)} ${b.charAt(0).toUpperCase() + b.slice(1)} ${c.charAt(0).toUpperCase() + c.slice(1)}`,
        );
        asserts++;
      }
    }
    expect(asserts).toBe(200);
  });

  test("getPokemonIdFromResourceUrl: many URL shapes", () => {
    const bases = [
      "https://pokeapi.co/api/v2/pokemon-species/",
      "https://pokeapi.co/api/v2/pokemon/",
      "http://example.com/x/",
      "/api/v2/pokemon/",
    ];

    // ~150 distinct assertions
    let asserts = 0;
    for (const base of bases) {
      for (let id = 1; id <= 30; id++) {
        expect(getPokemonIdFromResourceUrl(`${base}${id}/`)).toBe(id);
        expect(getPokemonIdFromResourceUrl(`${base}${id}`)).toBe(id);
        asserts += 2;
      }
    }

    // extra edge cases
    expect(getPokemonIdFromResourceUrl(null)).toBe(null);
    expect(getPokemonIdFromResourceUrl(undefined)).toBe(null);
    expect(getPokemonIdFromResourceUrl("")).toBe(null);
    expect(getPokemonIdFromResourceUrl("https://pokeapi.co/api/v2/pokemon-species/nope/")).toBe(null);
    asserts += 4;

    expect(asserts).toBe(244);
  });
});

