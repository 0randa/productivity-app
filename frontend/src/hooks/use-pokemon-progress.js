import { useEffect, useMemo, useState } from "react";
import {
  FALLBACK_XP_PER_LEVEL,
  MAX_LEVEL,
  START_LEVEL,
  calculateLevelFromExperience,
  formatPokemonName,
  getExperienceForLevel,
  getNextEvolutionEntry,
  getPokemonIdFromResourceUrl,
} from "@/lib/pokemon";

export function usePokemonProgress({ activePokemon, totalXp }) {
  const [growthLevels, setGrowthLevels] = useState([]);
  const [isGrowthDataLoading, setIsGrowthDataLoading] = useState(false);
  const [growthDataError, setGrowthDataError] = useState("");
  const [nextEvolution, setNextEvolution] = useState(null);

  useEffect(() => {
    if (!activePokemon) {
      setGrowthLevels([]);
      setGrowthDataError("");
      setIsGrowthDataLoading(false);
      setNextEvolution(null);
      return;
    }

    let isActive = true;
    const abortController = new AbortController();

    const loadGrowthData = async () => {
      setIsGrowthDataLoading(true);
      setGrowthDataError("");
      setNextEvolution(null);

      try {
        const speciesResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${activePokemon.pokemonId}`,
          { signal: abortController.signal },
        );
        if (!speciesResponse.ok) {
          throw new Error(`Species request failed: ${speciesResponse.status}`);
        }

        const speciesData = await speciesResponse.json();
        const growthRateUrl = speciesData.growth_rate?.url;
        if (!growthRateUrl) {
          throw new Error("Growth rate URL is missing from species response.");
        }

        const evolutionChainUrl = speciesData.evolution_chain?.url;
        if (!evolutionChainUrl) {
          throw new Error("Evolution chain URL is missing from species response.");
        }

        const [growthRateResponse, evolutionChainResponse] = await Promise.all([
          fetch(growthRateUrl, {
            signal: abortController.signal,
          }),
          fetch(evolutionChainUrl, {
            signal: abortController.signal,
          }),
        ]);

        if (!growthRateResponse.ok) {
          throw new Error(`Growth rate request failed: ${growthRateResponse.status}`);
        }
        if (!evolutionChainResponse.ok) {
          throw new Error(`Evolution chain request failed: ${evolutionChainResponse.status}`);
        }

        const [growthRateData, evolutionChainData] = await Promise.all([
          growthRateResponse.json(),
          evolutionChainResponse.json(),
        ]);

        const normalizedLevels = (growthRateData.levels ?? [])
          .map((levelEntry) => ({
            level: levelEntry.level,
            experience: levelEntry.experience,
          }))
          .sort((left, right) => left.level - right.level);

        if (!normalizedLevels.length) {
          throw new Error("Growth rate table is empty.");
        }

        if (!isActive) {
          return;
        }

        setGrowthLevels(normalizedLevels);

        const nextEvolutionEntry = getNextEvolutionEntry(
          evolutionChainData.chain,
          speciesData.name,
        );
        if (!nextEvolutionEntry) {
          setNextEvolution(null);
          return;
        }

        const pokemonId = getPokemonIdFromResourceUrl(
          nextEvolutionEntry.candidate.species?.url,
        );
        if (!pokemonId) {
          setNextEvolution(null);
          return;
        }

        setNextEvolution({
          pokemonId,
          speciesName: nextEvolutionEntry.candidate.species.name,
          label: formatPokemonName(nextEvolutionEntry.candidate.species.name),
          minLevel: nextEvolutionEntry.minLevel,
        });
      } catch (error) {
        if (!isActive || error.name === "AbortError") {
          return;
        }

        console.error("Could not load growth data from PokeAPI:", error);
        setGrowthLevels([]);
        setNextEvolution(null);
        setGrowthDataError("Could not load PokeAPI growth data. Using fallback leveling.");
      } finally {
        if (isActive) {
          setIsGrowthDataLoading(false);
        }
      }
    };

    loadGrowthData();

    return () => {
      isActive = false;
      abortController.abort();
    };
  }, [activePokemon]);

  const baseExperienceAtStartLevel = useMemo(() => {
    if (!growthLevels.length) {
      return START_LEVEL * FALLBACK_XP_PER_LEVEL;
    }
    return getExperienceForLevel(growthLevels, START_LEVEL);
  }, [growthLevels]);

  const totalExperience = baseExperienceAtStartLevel + totalXp;

  const level = useMemo(() => {
    if (!growthLevels.length) {
      return Math.min(
        MAX_LEVEL,
        START_LEVEL + Math.floor(totalXp / FALLBACK_XP_PER_LEVEL),
      );
    }

    return calculateLevelFromExperience(
      growthLevels,
      baseExperienceAtStartLevel + totalXp,
    );
  }, [baseExperienceAtStartLevel, growthLevels, totalXp]);

  const getLevelForEarnedXp = (earnedXp) => {
    if (!growthLevels.length) {
      return Math.min(
        MAX_LEVEL,
        START_LEVEL + Math.floor(earnedXp / FALLBACK_XP_PER_LEVEL),
      );
    }

    return calculateLevelFromExperience(
      growthLevels,
      baseExperienceAtStartLevel + earnedXp,
    );
  };

  const { xpInCurrentLevel, xpNeededForNextLevel, xpProgress, nextLevel } = useMemo(() => {
    if (!growthLevels.length) {
      const fallbackXpInCurrentLevel = totalXp % FALLBACK_XP_PER_LEVEL;
      return {
        xpInCurrentLevel: fallbackXpInCurrentLevel,
        xpNeededForNextLevel: FALLBACK_XP_PER_LEVEL,
        xpProgress: (fallbackXpInCurrentLevel / FALLBACK_XP_PER_LEVEL) * 100,
        nextLevel: Math.min(level + 1, MAX_LEVEL),
      };
    }

    const currentLevelExperience = getExperienceForLevel(growthLevels, level);
    if (level >= MAX_LEVEL) {
      return {
        xpInCurrentLevel: totalExperience - currentLevelExperience,
        xpNeededForNextLevel: 0,
        xpProgress: 100,
        nextLevel: MAX_LEVEL,
      };
    }

    const targetNextLevel = level + 1;
    const nextLevelExperience = getExperienceForLevel(
      growthLevels,
      targetNextLevel,
    );
    const xpNeeded = Math.max(nextLevelExperience - currentLevelExperience, 1);
    const xpInLevel = Math.max(totalExperience - currentLevelExperience, 0);

    return {
      xpInCurrentLevel: xpInLevel,
      xpNeededForNextLevel: xpNeeded,
      xpProgress: Math.min((xpInLevel / xpNeeded) * 100, 100),
      nextLevel: targetNextLevel,
    };
  }, [growthLevels, level, totalExperience, totalXp]);

  return {
    level,
    nextLevel,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    xpProgress,
    nextEvolution,
    isGrowthDataLoading,
    growthDataError,
    getLevelForEarnedXp,
  };
}
