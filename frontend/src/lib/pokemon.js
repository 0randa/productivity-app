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

// Wild Pokemon that can appear in encounters (curated Gen 1 common Pokemon)
export const WILD_POKEMON = [
  { key: "pidgey",     speciesName: "pidgey",     pokemonId: 16  },
  { key: "rattata",    speciesName: "rattata",     pokemonId: 19  },
  { key: "geodude",    speciesName: "geodude",     pokemonId: 74  },
  { key: "gastly",     speciesName: "gastly",      pokemonId: 92  },
  { key: "magikarp",   speciesName: "magikarp",    pokemonId: 129 },
  { key: "eevee",      speciesName: "eevee",       pokemonId: 133 },
  { key: "snorlax",    speciesName: "snorlax",     pokemonId: 143 },
  { key: "ditto",      speciesName: "ditto",       pokemonId: 132 },
  { key: "psyduck",    speciesName: "psyduck",     pokemonId: 54  },
  { key: "meowth",     speciesName: "meowth",      pokemonId: 52  },
  { key: "growlithe",  speciesName: "growlithe",   pokemonId: 58  },
  { key: "abra",       speciesName: "abra",        pokemonId: 63  },
  { key: "machop",     speciesName: "machop",      pokemonId: 66  },
  { key: "ponyta",     speciesName: "ponyta",      pokemonId: 77  },
  { key: "slowpoke",   speciesName: "slowpoke",    pokemonId: 79  },
  { key: "magnemite",  speciesName: "magnemite",   pokemonId: 81  },
  { key: "haunter",    speciesName: "haunter",     pokemonId: 93  },
  { key: "jigglypuff", speciesName: "jigglypuff",  pokemonId: 39  },
  { key: "clefairy",   speciesName: "clefairy",    pokemonId: 35  },
  { key: "vulpix",     speciesName: "vulpix",      pokemonId: 37  },
];

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
