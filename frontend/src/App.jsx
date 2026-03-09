"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import CompanionPanel from "@/components/companion-panel";
import FocusPanel from "@/components/focus-panel";
import { NavbarComp } from "@/components/navbar";
import StarterSelection from "@/components/starter-selection";
import Tasks from "@/components/tasks";
import { usePokemonProgress } from "@/hooks/use-pokemon-progress";
import {
  MAX_LEVEL,
  STARTERS,
  START_LEVEL,
  XP_PER_TASK,
  createTaskId,
  getPokemonAssets,
} from "@/lib/pokemon";

const INITIAL_TASKS = [];

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
  const audioRef = useRef(null);

  const {
    level,
    nextLevel,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    xpProgress,
    nextEvolution,
    isGrowthDataLoading,
    growthDataError,
    getLevelForEarnedXp,
  } = usePokemonProgress({ activePokemon, totalXp });

  const previewStarterData = useMemo(
    () =>
      STARTERS.find((starter) => starter.key === previewStarter) ?? STARTERS[0],
    [previewStarter],
  );

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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
    const nextLevelAfterGain = getLevelForEarnedXp(nextTotalXp);
    const didLevelUp = nextLevelAfterGain > level;

    setAvailableTaskClaims((prev) => prev - 1);
    setTasksCompleted((prev) => prev + 1);
    setTotalXp((prev) => prev + XP_PER_TASK);
    setStatusMessage(
      didLevelUp
        ? `${taskToComplete.name} complete. ${activePokemon?.label ?? "Starter"} gained ${XP_PER_TASK} XP and reached level ${nextLevelAfterGain}.`
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
          <StarterSelection
            starters={STARTERS}
            previewStarterKey={previewStarter}
            playingStarterKey={playingStarter}
            onPreviewStarter={playStarterCry}
            onBeginSession={beginSession}
            previewStarterLabel={previewStarterData.label}
          />
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bgGradient="linear(to-b, #0f172a, #172554 35%, #111827)">
      <NavbarComp />
      <Container maxW="6xl" py={{ base: 8, md: 12 }}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={6}>
          <FocusPanel
            statusMessage={statusMessage}
            onPomodoroStart={handlePomodoroStart}
            onPomodoroComplete={handlePomodoroComplete}
          />
          <CompanionPanel
            activePokemon={activePokemon}
            level={level}
            xpInCurrentLevel={xpInCurrentLevel}
            xpNeededForNextLevel={xpNeededForNextLevel}
            xpProgress={xpProgress}
            nextLevel={nextLevel}
            maxLevel={MAX_LEVEL}
            isGrowthDataLoading={isGrowthDataLoading}
            growthDataError={growthDataError}
            nextEvolution={nextEvolution}
            canEvolveByLevel={canEvolveByLevel}
            onEvolve={handleEvolve}
            xpPerTask={XP_PER_TASK}
            availableTaskClaims={availableTaskClaims}
            totalXp={totalXp}
          />
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
