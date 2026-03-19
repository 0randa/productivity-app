import { useState } from "react";
import {
  WILD_POKEMON,
  WILD_ENCOUNTER_CHANCE,
  CATCH_RATE,
  getPokemonAssets,
  formatPokemonName,
} from "@/lib/pokemon";

function pickRandomWild() {
  const entry = WILD_POKEMON[Math.floor(Math.random() * WILD_POKEMON.length)];
  return {
    ...entry,
    label: formatPokemonName(entry.speciesName),
    ...getPokemonAssets(entry.pokemonId),
  };
}

export function useWildEncounter({ testingMode = false, partySize: _partySize } = {}) {
  void _partySize;
  const [wildPokemon, setWildPokemon] = useState(null);
  const [catchResult, setCatchResult] = useState(null); // null | "success" | "fail"

  const triggerEncounterChance = () => {
    // In testing mode we force an encounter every time.
    if (testingMode || Math.random() < WILD_ENCOUNTER_CHANCE) {
      setWildPokemon(pickRandomWild());
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
