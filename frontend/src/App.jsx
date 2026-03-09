"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Progress,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import TimerComp from "@/components/timer";
import Tasks from "@/components/tasks";
import { NavbarComp } from "@/components/navbar";

const STARTERS = [
  {
    key: "bulbasaur",
    speciesName: "bulbasaur",
    pokemonId: 1,
    label: "Bulbasaur",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    cry: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/1.ogg",
  },
  {
    key: "charmander",
    speciesName: "charmander",
    pokemonId: 4,
    label: "Charmander",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
    cry: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/4.ogg",
  },
  {
    key: "squirtle",
    speciesName: "squirtle",
    pokemonId: 7,
    label: "Squirtle",
    sprite:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
    cry: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/7.ogg",
  },
];

const INITIAL_TASKS = [];

const START_LEVEL = 5;
const MAX_LEVEL = 100;
const FALLBACK_XP_PER_LEVEL = 100;
const XP_PER_TASK = 40;
const createTaskId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const getPokemonAssets = (pokemonId) => ({
  sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
  cry: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`,
});
const getPokemonIdFromResourceUrl = (resourceUrl) => {
  const idMatch = resourceUrl?.match(/\/(\d+)\/?$/);
  return idMatch ? Number(idMatch[1]) : null;
};
const formatPokemonName = (speciesName) =>
  speciesName
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
const getExperienceForLevel = (levels, targetLevel) =>
  levels.find((entry) => entry.level === targetLevel)?.experience ?? 0;
const calculateLevelFromExperience = (levels, totalExperience) => {
  let resolvedLevel = 1;
  for (const entry of levels) {
    if (entry.experience > totalExperience) {
      break;
    }
    resolvedLevel = entry.level;
  }
  return resolvedLevel;
};
const getNextEvolutionEntry = (chainNode, currentSpeciesName) => {
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

export default function App() {
  const [activePokemon, setActivePokemon] = useState(null);
  const [previewStarter, setPreviewStarter] = useState(STARTERS[0].key);
  const [playingStarter, setPlayingStarter] = useState("");
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [pomodorosStarted, setPomodorosStarted] = useState(0);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [availableTaskClaims, setAvailableTaskClaims] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [growthLevels, setGrowthLevels] = useState([]);
  const [isGrowthDataLoading, setIsGrowthDataLoading] = useState(false);
  const [growthDataError, setGrowthDataError] = useState("");
  const [nextEvolution, setNextEvolution] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const previewStarterData = useMemo(
    () =>
      STARTERS.find((starter) => starter.key === previewStarter) ?? STARTERS[0],
    [previewStarter],
  );

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
          throw new Error(
            "Evolution chain URL is missing from species response.",
          );
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
          throw new Error(
            `Growth rate request failed: ${growthRateResponse.status}`,
          );
        }
        if (!evolutionChainResponse.ok) {
          throw new Error(
            `Evolution chain request failed: ${evolutionChainResponse.status}`,
          );
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
          .sort((a, b) => a.level - b.level);

        if (!normalizedLevels.length) {
          throw new Error("Growth rate table is empty.");
        }

        if (isActive) {
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
        }
      } catch (error) {
        if (!isActive || error.name === "AbortError") {
          return;
        }

        console.error("Could not load growth data from PokeAPI:", error);
        setGrowthLevels([]);
        setNextEvolution(null);
        setGrowthDataError(
          "Could not load PokeAPI growth data. Using fallback leveling.",
        );
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

    return calculateLevelFromExperience(growthLevels, totalExperience);
  }, [growthLevels, totalExperience, totalXp]);

  const { xpInCurrentLevel, xpNeededForNextLevel, xpProgress, nextLevel } =
    useMemo(() => {
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
      const xpNeeded = Math.max(
        nextLevelExperience - currentLevelExperience,
        1,
      );
      const xpInLevel = Math.max(totalExperience - currentLevelExperience, 0);

      return {
        xpInCurrentLevel: xpInLevel,
        xpNeededForNextLevel: xpNeeded,
        xpProgress: Math.min((xpInLevel / xpNeeded) * 100, 100),
        nextLevel: targetNextLevel,
      };
    }, [growthLevels, level, totalExperience, totalXp]);

  const playStarterCry = async (starterChoice) => {
    setPreviewStarter(starterChoice.key);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const cryAudio = new Audio(starterChoice.cry);
    cryAudio.volume = 0.75;
    audioRef.current = cryAudio;

    cryAudio.onended = () => {
      setPlayingStarter((current) =>
        current === starterChoice.key ? "" : current,
      );
    };

    try {
      await cryAudio.play();
      setPlayingStarter(starterChoice.key);
    } catch (error) {
      setPlayingStarter("");
      console.error("Could not play starter cry:", error);
    }
  };

  const beginSession = () => {
    setActivePokemon(previewStarterData);
    setStatusMessage(
      `Welcome in. You chose ${previewStarterData.label} at level ${START_LEVEL}. Complete pomodoros and tasks to gain XP.`,
    );
  };

  const handlePomodoroStart = () => {
    setPomodorosStarted((prev) => prev + 1);
  };

  const handlePomodoroComplete = () => {
    setPomodorosCompleted((prev) => prev + 1);
    setAvailableTaskClaims((prev) => prev + 1);
    setStatusMessage("Pomodoro complete. Mark one task done to claim XP.");
  };

  const handleTaskCreate = (taskName) => {
    const normalizedTaskName = taskName.trim();
    if (!normalizedTaskName) {
      setStatusMessage("Add a task name before creating it.");
      return false;
    }

    setTasks((prev) => [
      ...prev,
      {
        id: createTaskId(),
        name: normalizedTaskName,
        points: XP_PER_TASK,
        done: false,
      },
    ]);

    if (availableTaskClaims > 0) {
      setStatusMessage(
        `Task added: ${normalizedTaskName}. You can complete it now to claim XP.`,
      );
    } else {
      setStatusMessage(
        `Task added: ${normalizedTaskName}. Complete a pomodoro to unlock completion.`,
      );
    }

    return true;
  };

  const handleTaskComplete = (taskId) => {
    const taskToComplete = tasks.find(
      (task) => task.id === taskId && !task.done,
    );
    if (!taskToComplete) {
      return;
    }

    if (availableTaskClaims <= 0) {
      setStatusMessage(
        "Complete a pomodoro first, then claim XP by finishing a task.",
      );
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              done: true,
            }
          : task,
      ),
    );

    const nextTotalXp = totalXp + XP_PER_TASK;
    const nextLevel = growthLevels.length
      ? calculateLevelFromExperience(
          growthLevels,
          baseExperienceAtStartLevel + nextTotalXp,
        )
      : Math.min(
          MAX_LEVEL,
          START_LEVEL + Math.floor(nextTotalXp / FALLBACK_XP_PER_LEVEL),
        );
    const didLevelUp = nextLevel > level;

    setAvailableTaskClaims((prev) => prev - 1);
    setTasksCompleted((prev) => prev + 1);
    setTotalXp((prev) => prev + XP_PER_TASK);
    setStatusMessage(
      didLevelUp
        ? `${taskToComplete.name} complete. ${activePokemon?.label ?? "Starter"} gained ${XP_PER_TASK} XP and reached level ${nextLevel}.`
        : `${taskToComplete.name} complete. ${activePokemon?.label ?? "Starter"} gained ${XP_PER_TASK} XP.`,
    );
  };

  const canEvolveByLevel =
    Boolean(nextEvolution) &&
    typeof nextEvolution.minLevel === "number" &&
    level >= nextEvolution.minLevel;

  const handleEvolve = () => {
    if (!nextEvolution) {
      return;
    }

    if (typeof nextEvolution.minLevel !== "number") {
      setStatusMessage(
        `${activePokemon?.label ?? "Your Pokemon"} cannot evolve by level in this line.`,
      );
      return;
    }

    if (level < nextEvolution.minLevel) {
      setStatusMessage(
        `${activePokemon?.label ?? "Your Pokemon"} evolves at level ${nextEvolution.minLevel}.`,
      );
      return;
    }

    const evolvedPokemon = {
      key: nextEvolution.speciesName,
      speciesName: nextEvolution.speciesName,
      pokemonId: nextEvolution.pokemonId,
      label: nextEvolution.label,
      ...getPokemonAssets(nextEvolution.pokemonId),
    };

    setActivePokemon(evolvedPokemon);
    setStatusMessage(
      `${activePokemon?.label ?? "Your Pokemon"} evolved into ${nextEvolution.label}!`,
    );
  };

  if (!activePokemon) {
    return (
      <Box
        minH="100vh"
        bgGradient="linear(to-b, #0f172a, #172554 35%, #111827)"
      >
        <NavbarComp />
        <Container maxW="6xl" py={{ base: 8, md: 12 }}>
          <Box
            p={{ base: 6, md: 8 }}
            borderRadius="2xl"
            bg="rgba(15, 23, 42, 0.72)"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <Badge colorScheme="orange" borderRadius="full" px={3} py={1}>
              First Session Setup
            </Badge>
            <Heading mt={4} size="xl">
              Choose your starter Pokémon
            </Heading>
            <Text color="whiteAlpha.800" mt={2} mb={6}>
              This choice is session-only for now. Refreshing the page will
              reset progress.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {STARTERS.map((starter) => {
                const isSelected = starter.key === previewStarter;
                const isPlaying = starter.key === playingStarter;

                return (
                  <Box
                    key={starter.key}
                    as="button"
                    type="button"
                    onClick={() => playStarterCry(starter)}
                    textAlign="left"
                    borderRadius="xl"
                    p={4}
                    border="1px solid"
                    borderColor={isSelected ? "orange.300" : "whiteAlpha.300"}
                    bg={isSelected ? "orange.400" : "rgba(30, 41, 59, 0.7)"}
                    color={isSelected ? "gray.900" : "white"}
                    transition="all 0.2s ease"
                    transform={isSelected ? "translateY(-3px)" : "none"}
                    boxShadow={
                      isSelected
                        ? "0 12px 28px rgba(251, 146, 60, 0.35)"
                        : "none"
                    }
                    _hover={{ transform: "translateY(-3px)" }}
                  >
                    <VStack align="start" spacing={2}>
                      <Box
                        w="full"
                        h="100px"
                        borderRadius="lg"
                        bg={isSelected ? "orange.300" : "whiteAlpha.200"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Image
                          src={starter.sprite}
                          alt={starter.label}
                          maxH="92px"
                          objectFit="contain"
                        />
                      </Box>
                      <Text fontWeight="bold">{starter.label}</Text>
                      <Text fontSize="xs" opacity={0.85}>
                        {isPlaying ? "Playing cry..." : "Click to hear cry"}
                      </Text>
                    </VStack>
                  </Box>
                );
              })}
            </SimpleGrid>

            <Button
              mt={6}
              colorScheme="orange"
              size="lg"
              onClick={beginSession}
            >
              Start with {previewStarterData.label}
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bgGradient="linear(to-b, #0f172a, #172554 35%, #111827)">
      <NavbarComp />
      <Container maxW="6xl" py={{ base: 8, md: 12 }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
          <Box
            p={7}
            borderRadius="2xl"
            bg="rgba(15, 23, 42, 0.65)"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <Badge colorScheme="orange" borderRadius="full" px={3} py={1}>
              Pomodoro RPG
            </Badge>
            <Heading mt={4} size="2xl" lineHeight="1.1">
              Build momentum one focused sprint at a time.
            </Heading>
            <Text mt={4} color="whiteAlpha.800" maxW="lg">
              Complete a pomodoro, then complete a task to claim XP for your
              companion.
            </Text>
            <Box mt={8}>
              <TimerComp
                onPomodoroStart={handlePomodoroStart}
                onPomodoroComplete={handlePomodoroComplete}
              />
            </Box>
            {statusMessage ? (
              <Text mt={4} fontSize="sm" color="orange.200">
                {statusMessage}
              </Text>
            ) : null}
          </Box>

          <Box
            p={7}
            borderRadius="2xl"
            bg="rgba(30, 41, 59, 0.72)"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <Flex align="center" gap={4}>
              <Box
                w="92px"
                h="92px"
                borderRadius="xl"
                bg="whiteAlpha.200"
                border="1px solid"
                borderColor="whiteAlpha.300"
                p={2}
              >
                <Image
                  src={activePokemon.sprite}
                  alt={activePokemon.label}
                  w="full"
                  h="full"
                  objectFit="contain"
                />
              </Box>
              <Box>
                <Heading size="lg">{activePokemon.label}</Heading>
                <Text color="whiteAlpha.800">
                  Level {level} Focus Companion
                </Text>
              </Box>
            </Flex>

            <Box mt={8}>
              <Text fontWeight="semibold">Experience</Text>
              <Text color="whiteAlpha.700" fontSize="sm" mb={2}>
                {level >= MAX_LEVEL
                  ? "Max level reached"
                  : `${xpInCurrentLevel} / ${xpNeededForNextLevel} XP toward level ${nextLevel}`}
              </Text>
              <Progress
                value={xpProgress}
                colorScheme="green"
                borderRadius="full"
                bg="whiteAlpha.300"
              />
              {isGrowthDataLoading ? (
                <Text mt={2} fontSize="xs" color="whiteAlpha.700">
                  Loading growth data from PokeAPI...
                </Text>
              ) : null}
              {growthDataError ? (
                <Text mt={2} fontSize="xs" color="yellow.200">
                  {growthDataError}
                </Text>
              ) : null}
            </Box>

            {nextEvolution ? (
              <Box mt={5}>
                <Text fontSize="sm" color="whiteAlpha.800">
                  Next evolution: {nextEvolution.label}
                  {typeof nextEvolution.minLevel === "number"
                    ? ` at level ${nextEvolution.minLevel}`
                    : " (special condition)"}
                </Text>
                <Button
                  mt={3}
                  size="sm"
                  colorScheme="orange"
                  onClick={handleEvolve}
                  isDisabled={!canEvolveByLevel}
                >
                  Evolve
                </Button>
              </Box>
            ) : null}

            <SimpleGrid columns={3} spacing={3} mt={8}>
              <StatCard label="XP / Task" value={XP_PER_TASK} />
              <StatCard label="Pomodoro Claims" value={availableTaskClaims} />
              <StatCard label="Earned XP" value={totalXp} />
            </SimpleGrid>
          </Box>
        </SimpleGrid>

        <Tasks
          tasks={tasks}
          onAddTask={handleTaskCreate}
          onCompleteTask={handleTaskComplete}
          canCompleteTask={availableTaskClaims > 0}
          stats={{
            sessionsStarted: pomodorosStarted,
            sessionsCompleted: pomodorosCompleted,
            tasksCompleted,
            currentLevel: level,
          }}
        />
      </Container>
    </Box>
  );
}

function StatCard({ label, value }) {
  return (
    <Box
      p={3}
      borderRadius="lg"
      bg="rgba(15, 23, 42, 0.7)"
      border="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Text
        fontSize="xs"
        textTransform="uppercase"
        letterSpacing="wide"
        color="whiteAlpha.700"
      >
        {label}
      </Text>
      <Text mt={1} fontWeight="bold" fontSize="lg">
        {value}
      </Text>
    </Box>
  );
}
