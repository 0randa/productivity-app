// Starters and wild pool are now region-specific — see src/lib/regions.js.

export const WILD_ENCOUNTER_CHANCE = 0.4; // 40% chance per pomodoro
export const CATCH_RATE = 0.7;            // 70% base catch rate
export const MAX_PARTY_SIZE = 6;

export const START_LEVEL = 5;
export const MAX_LEVEL = 100;
export const FALLBACK_XP_PER_LEVEL = 100;
export const XP_PER_TASK = 40;

export const createTaskId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const getPokemonAssets = (pokemonId, regionId) => {
  // Import inline to avoid a circular dep — regions.js is a pure data file.
  // Dynamic require not available in ESM; use a lazy import map instead.
  const SPRITE_ROOT =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions";
  const PRESETS = {
    kanto:  { base: `${SPRITE_ROOT}/generation-iii/firered-leafgreen`,   ext: "png" },
    johto:  { base: `${SPRITE_ROOT}/generation-iv/heartgold-soulsilver`, ext: "png" },
    hoenn:  { base: `${SPRITE_ROOT}/generation-iii/emerald`,             ext: "png" },
    sinnoh: { base: `${SPRITE_ROOT}/generation-iv/platinum`,             ext: "png" },
    unova:  { base: `${SPRITE_ROOT}/generation-v/black-white/animated`,  ext: "gif" },
  };
  const { base, ext } = PRESETS[regionId] ?? PRESETS.unova;
  return {
    sprite: `${base}/${pokemonId}.${ext}`,
    cry: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`,
  };
};

export const getPokemonIdFromResourceUrl = (resourceUrl) => {
  const idMatch = resourceUrl?.match(/\/(\d+)\/?$/);
  return idMatch ? Number(idMatch[1]) : null;
};

export const formatPokemonName = (speciesName) =>
  speciesName
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

export const getExperienceForLevel = (levels, targetLevel) =>
  levels.find((entry) => entry.level === targetLevel)?.experience ?? 0;

export const calculateLevelFromExperience = (levels, totalExperience) => {
  let resolvedLevel = 1;
  for (const entry of levels) {
    if (entry.experience > totalExperience) {
      break;
    }
    resolvedLevel = entry.level;
  }
  return resolvedLevel;
};

export const getNextEvolutionEntry = (chainNode, currentSpeciesName) => {
  if (!chainNode) {
    return null;
  }

  if (chainNode.species?.name === currentSpeciesName) {
    if (!chainNode.evolves_to?.length) {
      return null;
    }

    const sortedCandidates = chainNode.evolves_to
      .map((candidate) => {
        const minLevel = candidate.evolution_details?.find(
          (detail) => typeof detail.min_level === "number",
        )?.min_level;

        return {
          candidate,
          minLevel: typeof minLevel === "number" ? minLevel : null,
        };
      })
      .sort(
        (left, right) =>
          (left.minLevel ?? Number.MAX_SAFE_INTEGER) -
          (right.minLevel ?? Number.MAX_SAFE_INTEGER),
      );

    return sortedCandidates[0] ?? null;
  }

  for (const childNode of chainNode.evolves_to ?? []) {
    const result = getNextEvolutionEntry(childNode, currentSpeciesName);
    if (result) {
      return result;
    }
  }

  return null;
};
