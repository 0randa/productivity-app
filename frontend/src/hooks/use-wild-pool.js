import { useEffect, useState } from "react";
import { REGIONS, WILD_FALLBACKS } from "@/lib/regions";
import { getPokemonIdFromResourceUrl } from "@/lib/pokemon";

// Module-level cache: regionId → wild pool array (persists across re-renders)
const poolCache = {};

async function fetchWildPool(regionId) {
  const region = REGIONS.find((r) => r.regionId === regionId);
  if (!region) throw new Error(`Unknown region: ${regionId}`);

  const res = await fetch(
    `https://pokeapi.co/api/v2/pokedex/${region.pokedexName}/`,
  );
  if (!res.ok) throw new Error(`Pokedex fetch failed: ${res.status}`);

  const data = await res.json();
  return (data.pokemon_entries ?? []).map((entry) => {
    const id = getPokemonIdFromResourceUrl(entry.pokemon_species.url);
    return {
      key: entry.pokemon_species.name,
      speciesName: entry.pokemon_species.name,
      pokemonId: id,
    };
  }).filter((e) => e.pokemonId !== null);
}

export function useWildPool(regionId) {
  const [wildPool, setWildPool] = useState(() =>
    regionId ? (poolCache[regionId] ?? null) : null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!regionId) return;

    if (poolCache[regionId]) {
      setWildPool(poolCache[regionId]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchWildPool(regionId)
      .then((pool) => {
        if (cancelled) return;
        poolCache[regionId] = pool;
        setWildPool(pool);
      })
      .catch(() => {
        if (cancelled) return;
        const fallback = WILD_FALLBACKS[regionId] ?? [];
        poolCache[regionId] = fallback;
        setWildPool(fallback);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [regionId]);

  return { wildPool, loading };
}
