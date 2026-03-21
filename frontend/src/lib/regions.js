const SPRITE_ROOT =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions";
const CRY_ROOT =
  "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest";

export const SPRITE_PRESETS = {
  kanto:  { base: `${SPRITE_ROOT}/generation-iii/firered-leafgreen`,      ext: "png" },
  johto:  { base: `${SPRITE_ROOT}/generation-iv/heartgold-soulsilver`,    ext: "png" },
  hoenn:  { base: `${SPRITE_ROOT}/generation-iii/emerald`,                ext: "png" },
  sinnoh: { base: `${SPRITE_ROOT}/generation-iv/platinum`,                ext: "png" },
  unova:  { base: `${SPRITE_ROOT}/generation-v/black-white/animated`,     ext: "gif" },
};

export function getSpriteUrl(pokemonId, regionId) {
  const preset = SPRITE_PRESETS[regionId] ?? SPRITE_PRESETS.unova;
  return `${preset.base}/${pokemonId}.${preset.ext}`;
}

function makeStarter(regionId, key, id, label) {
  return {
    key,
    speciesName: key,
    pokemonId: id,
    label,
    sprite: getSpriteUrl(id, regionId),
    cry: `${CRY_ROOT}/${id}.ogg`,
  };
}

export const REGIONS = [
  {
    regionId: "kanto",
    label: "Kanto",
    pokedexName: "updated-kanto",
    starters: [
      makeStarter("kanto", "bulbasaur",  1, "Bulbasaur"),
      makeStarter("kanto", "charmander", 4, "Charmander"),
      makeStarter("kanto", "squirtle",   7, "Squirtle"),
    ],
  },
  {
    regionId: "johto",
    label: "Johto",
    pokedexName: "updated-johto",
    starters: [
      makeStarter("johto", "chikorita", 152, "Chikorita"),
      makeStarter("johto", "cyndaquil", 155, "Cyndaquil"),
      makeStarter("johto", "totodile",  158, "Totodile"),
    ],
  },
  {
    regionId: "hoenn",
    label: "Hoenn",
    pokedexName: "updated-hoenn",
    starters: [
      makeStarter("hoenn", "treecko", 252, "Treecko"),
      makeStarter("hoenn", "torchic", 255, "Torchic"),
      makeStarter("hoenn", "mudkip",  258, "Mudkip"),
    ],
  },
  {
    regionId: "sinnoh",
    label: "Sinnoh",
    pokedexName: "updated-sinnoh",
    starters: [
      makeStarter("sinnoh", "turtwig", 387, "Turtwig"),
      makeStarter("sinnoh", "chimchar", 390, "Chimchar"),
      makeStarter("sinnoh", "piplup",   393, "Piplup"),
    ],
  },
  {
    regionId: "unova",
    label: "Unova",
    pokedexName: "updated-unova",
    starters: [
      makeStarter("unova", "snivy",    495, "Snivy"),
      makeStarter("unova", "tepig",    498, "Tepig"),
      makeStarter("unova", "oshawott", 501, "Oshawott"),
    ],
  },
];

// Small fallback pools used when the PokeAPI pokedex fetch fails.
export const WILD_FALLBACKS = {
  kanto: [
    { key: "pidgey",     speciesName: "pidgey",     pokemonId: 16  },
    { key: "rattata",    speciesName: "rattata",     pokemonId: 19  },
    { key: "geodude",    speciesName: "geodude",     pokemonId: 74  },
    { key: "gastly",     speciesName: "gastly",      pokemonId: 92  },
    { key: "magikarp",   speciesName: "magikarp",    pokemonId: 129 },
    { key: "eevee",      speciesName: "eevee",       pokemonId: 133 },
    { key: "psyduck",    speciesName: "psyduck",     pokemonId: 54  },
    { key: "meowth",     speciesName: "meowth",      pokemonId: 52  },
    { key: "abra",       speciesName: "abra",        pokemonId: 63  },
    { key: "machop",     speciesName: "machop",      pokemonId: 66  },
  ],
  johto: [
    { key: "hoothoot",   speciesName: "hoothoot",    pokemonId: 163 },
    { key: "sentret",    speciesName: "sentret",     pokemonId: 161 },
    { key: "hoppip",     speciesName: "hoppip",      pokemonId: 187 },
    { key: "marill",     speciesName: "marill",      pokemonId: 183 },
    { key: "wooper",     speciesName: "wooper",      pokemonId: 194 },
    { key: "slugma",     speciesName: "slugma",      pokemonId: 218 },
    { key: "swinub",     speciesName: "swinub",      pokemonId: 220 },
    { key: "snubbull",   speciesName: "snubbull",    pokemonId: 209 },
    { key: "teddiursa",  speciesName: "teddiursa",   pokemonId: 216 },
    { key: "aipom",      speciesName: "aipom",       pokemonId: 190 },
  ],
  hoenn: [
    { key: "zigzagoon",  speciesName: "zigzagoon",   pokemonId: 263 },
    { key: "wurmple",    speciesName: "wurmple",     pokemonId: 265 },
    { key: "lotad",      speciesName: "lotad",       pokemonId: 270 },
    { key: "seedot",     speciesName: "seedot",      pokemonId: 273 },
    { key: "taillow",    speciesName: "taillow",     pokemonId: 276 },
    { key: "ralts",      speciesName: "ralts",       pokemonId: 280 },
    { key: "shroomish",  speciesName: "shroomish",   pokemonId: 285 },
    { key: "aron",       speciesName: "aron",        pokemonId: 304 },
    { key: "electrike",  speciesName: "electrike",   pokemonId: 309 },
    { key: "roselia",    speciesName: "roselia",     pokemonId: 315 },
  ],
  sinnoh: [
    { key: "starly",     speciesName: "starly",      pokemonId: 396 },
    { key: "bidoof",     speciesName: "bidoof",      pokemonId: 399 },
    { key: "kricketot",  speciesName: "kricketot",   pokemonId: 401 },
    { key: "shinx",      speciesName: "shinx",       pokemonId: 403 },
    { key: "budew",      speciesName: "budew",       pokemonId: 406 },
    { key: "cranidos",   speciesName: "cranidos",    pokemonId: 408 },
    { key: "burmy",      speciesName: "burmy",       pokemonId: 412 },
    { key: "combee",     speciesName: "combee",      pokemonId: 415 },
    { key: "buizel",     speciesName: "buizel",      pokemonId: 418 },
    { key: "gastrodon",  speciesName: "gastrodon",   pokemonId: 422 },
  ],
  unova: [
    { key: "patrat",     speciesName: "patrat",      pokemonId: 504 },
    { key: "lillipup",   speciesName: "lillipup",    pokemonId: 506 },
    { key: "purrloin",   speciesName: "purrloin",    pokemonId: 509 },
    { key: "pidove",     speciesName: "pidove",      pokemonId: 519 },
    { key: "blitzle",    speciesName: "blitzle",     pokemonId: 522 },
    { key: "drilbur",    speciesName: "drilbur",     pokemonId: 529 },
    { key: "foongus",    speciesName: "foongus",     pokemonId: 590 },
    { key: "joltik",     speciesName: "joltik",      pokemonId: 595 },
    { key: "litwick",    speciesName: "litwick",     pokemonId: 607 },
    { key: "axew",       speciesName: "axew",        pokemonId: 610 },
  ],
};
