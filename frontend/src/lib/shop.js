/**
 * PokéMart — item catalog, pricing, and evolution-matching helpers.
 */

export const POKEDOLLARS_PER_POMODORO = 100;

export const SHOP_ITEMS = [
  // ── Elemental Stones ────────────────────────────────────────────────────────
  {
    id: "fire-stone",
    label: "Fire Stone",
    description: "A peculiar stone that makes certain species of Pokémon evolve.",
    price: 300,
    category: "stone",
    matchesEvolution: (d) => d.item?.name === "fire-stone",
  },
  {
    id: "water-stone",
    label: "Water Stone",
    description: "A peculiar stone that makes certain species of Pokémon evolve.",
    price: 300,
    category: "stone",
    matchesEvolution: (d) => d.item?.name === "water-stone",
  },
  {
    id: "thunder-stone",
    label: "Thunder Stone",
    description: "A peculiar stone that makes certain species of Pokémon evolve.",
    price: 300,
    category: "stone",
    matchesEvolution: (d) => d.item?.name === "thunder-stone",
  },
  {
    id: "leaf-stone",
    label: "Leaf Stone",
    description: "A peculiar stone that makes certain species of Pokémon evolve.",
    price: 300,
    category: "stone",
    matchesEvolution: (d) => d.item?.name === "leaf-stone",
  },
  {
    id: "moon-stone",
    label: "Moon Stone",
    description: "A peculiar stone that makes certain species of Pokémon evolve.",
    price: 300,
    category: "stone",
    matchesEvolution: (d) => d.item?.name === "moon-stone",
  },
  {
    id: "sun-stone",
    label: "Sun Stone",
    description: "A peculiar stone that makes certain species of Pokémon evolve.",
    price: 300,
    category: "stone",
    matchesEvolution: (d) => d.item?.name === "sun-stone",
  },

  // ── Special Stones ──────────────────────────────────────────────────────────
  {
    id: "dusk-stone",
    label: "Dusk Stone",
    description: "A sinister stone that makes certain species of Pokémon evolve.",
    price: 400,
    category: "stone",
    matchesEvolution: (d) => d.item?.name === "dusk-stone",
  },
  {
    id: "dawn-stone",
    label: "Dawn Stone",
    description: "A peculiar stone that gleams like an eye. It makes certain species evolve.",
    price: 400,
    category: "stone",
    matchesEvolution: (d) => d.item?.name === "dawn-stone",
  },
  {
    id: "shiny-stone",
    label: "Shiny Stone",
    description: "A peculiar stone that shines with a dazzling light.",
    price: 400,
    category: "stone",
    matchesEvolution: (d) => d.item?.name === "shiny-stone",
  },

  // ── Trade / Special ─────────────────────────────────────────────────────────
  {
    id: "link-cable",
    label: "Link Cable",
    description: "A cable that makes trade-evolution Pokémon evolve without trading.",
    price: 500,
    category: "trade",
    matchesEvolution: (d) =>
      d.trigger?.name === "trade" && !d.held_item && !d.trade_species,
  },

  // ── Happiness ───────────────────────────────────────────────────────────────
  {
    id: "soothe-bell",
    label: "Soothe Bell",
    description: "A bell with a calming chime that helps Pokémon evolve through friendship.",
    price: 400,
    category: "happiness",
    matchesEvolution: (d) => typeof d.min_happiness === "number",
  },
];

/**
 * Given a PokeAPI `evolution_details` array, return the shop item required
 * for this evolution — or `null` if it's a plain level-up.
 */
export function getRequiredItem(evolutionDetails) {
  if (!Array.isArray(evolutionDetails) || !evolutionDetails.length) return null;

  for (const detail of evolutionDetails) {
    // Skip plain level-up evolutions
    if (detail.trigger?.name === "level-up" && typeof detail.min_level === "number" && !detail.item && !detail.min_happiness) {
      return null;
    }

    for (const shopItem of SHOP_ITEMS) {
      if (shopItem.matchesEvolution(detail)) {
        return shopItem;
      }
    }
  }

  return null;
}

/**
 * Look up a shop item by its ID.
 */
export function getShopItem(itemId) {
  return SHOP_ITEMS.find((item) => item.id === itemId) ?? null;
}
