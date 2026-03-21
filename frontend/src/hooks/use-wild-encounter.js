import { useState } from "react";
import {
  WILD_ENCOUNTER_CHANCE,
  CATCH_RATE,
  getPokemonAssets,
  formatPokemonName,
} from "@/lib/pokemon";

function pickRandomWild(wildPool, regionId) {
  if (!wildPool?.length) return null;
  const entry = wildPool[Math.floor(Math.random() * wildPool.length)];
  return {
    ...entry,
    label: formatPokemonName(entry.speciesName),
    ...getPokemonAssets(entry.pokemonId, regionId),
  };
}

export function useWildEncounter({
  testingMode = false,
  partySize: _partySize,
  wildPool,
  regionId,
} = {}) {
  void _partySize;
  const [wildPokemon, setWildPokemon] = useState(null);
  const [catchResult, setCatchResult] = useState(null); // null | "success" | "fail"

  const triggerEncounterChance = () => {
    if (!wildPool?.length) return; // skip if pool not loaded yet
    if (testingMode || Math.random() < WILD_ENCOUNTER_CHANCE) {
      setWildPokemon(pickRandomWild(wildPool, regionId));
      setCatchResult(null);
    }
  };

  // Returns the caught pokemon on success, null on fail
  const attemptCatch = () => {
    const success = testingMode ? true : Math.random() < CATCH_RATE;
    setCatchResult(success ? "success" : "fail");
    return success ? wildPokemon : null;
  };

  const dismissEncounter = () => {
    setWildPokemon(null);
    setCatchResult(null);
  };

  return {
    wildPokemon,
    catchResult,
    triggerEncounterChance,
    attemptCatch,
    dismissEncounter,
  };
}
