const GEN5_SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated";

export const STARTERS = [
  {
    key: "bulbasaur",
    speciesName: "bulbasaur",
    pokemonId: 1,
    label: "Bulbasaur",
    sprite: `${GEN5_SPRITE_BASE}/1.gif`,
    cry: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1.ogg",
  },
  {
    key: "charmander",
    speciesName: "charmander",
    pokemonId: 4,
    label: "Charmander",
    sprite: `${GEN5_SPRITE_BASE}/4.gif`,
    cry: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/4.ogg",
  },
  {
    key: "squirtle",
    speciesName: "squirtle",
    pokemonId: 7,
    label: "Squirtle",
    sprite: `${GEN5_SPRITE_BASE}/7.gif`,
    cry: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/7.ogg",
  },
];

export const START_LEVEL = 5;
export const MAX_LEVEL = 100;
export const FALLBACK_XP_PER_LEVEL = 100;
export const XP_PER_TASK = 40;

export const createTaskId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const getPokemonAssets = (pokemonId) => ({
  sprite: `${GEN5_SPRITE_BASE}/${pokemonId}.gif`,
  cry: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`,
});

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
