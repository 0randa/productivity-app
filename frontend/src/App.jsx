"use client";

import { useMemo, useState } from "react";
import StarterSelection from "@/components/starter-selection";
import StudyDashboard from "@/components/study-dashboard";
import StudyShell from "@/components/study-shell";
import { usePokemonProgress } from "@/hooks/use-pokemon-progress";
import { useSessionState } from "@/hooks/use-session-state";
import { useStarterSelection } from "@/hooks/use-starter-selection";
import {
  MAX_LEVEL,
  STARTERS,
  START_LEVEL,
  XP_PER_TASK,
  getPokemonAssets,
} from "@/lib/pokemon";

export default function App() {
  const [activePokemon, setActivePokemon] = useState(null);
  const {
    previewStarter,
    previewStarterData,
    playingStarter,
    playStarterCry,
  } = useStarterSelection(STARTERS);

  const {
    tasks,
    pomodorosStarted,
    pomodorosCompleted,
    tasksCompleted,
    availableTaskClaims,
    totalXp,
    statusMessage,
    setWelcomeMessage,
    updateStatusMessage,
    handlePomodoroStart,
    handlePomodoroComplete,
    handleTaskCreate,
    handleTaskComplete,
  } = useSessionState();

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

  const greetingLabel = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Morning Momentum";
    }
    if (hour < 18) {
      return "Afternoon Flow";
    }
    return "Evening Deep Focus";
  }, []);

  const beginSession = () => {
    setActivePokemon(previewStarterData);
    setWelcomeMessage({
      starterLabel: previewStarterData.label,
      startLevel: START_LEVEL,
    });
  };

  const completeTask = (taskId) => {
    handleTaskComplete({
      taskId,
      activePokemonLabel: activePokemon?.label,
      currentLevel: level,
      resolveLevelForEarnedXp: getLevelForEarnedXp,
    });
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
      updateStatusMessage(
        `${activePokemon?.label ?? "Your Pokemon"} cannot evolve by level in this line.`,
      );
      return;
    }

    if (level < nextEvolution.minLevel) {
      updateStatusMessage(
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
    updateStatusMessage(
      `${activePokemon?.label ?? "Your Pokemon"} evolved into ${nextEvolution.label}!`,
    );
  };

  if (!activePokemon) {
    return (
      <StudyShell>
        <StarterSelection
          starters={STARTERS}
          previewStarterKey={previewStarter}
          playingStarterKey={playingStarter}
          onPreviewStarter={playStarterCry}
          onBeginSession={beginSession}
          previewStarterLabel={previewStarterData.label}
        />
      </StudyShell>
    );
  }

  return (
    <StudyShell>
      <StudyDashboard
        greetingLabel={greetingLabel}
        activePokemon={activePokemon}
        level={level}
        openTasks={tasks.filter((task) => !task.done).length}
        availableTaskClaims={availableTaskClaims}
        statusMessage={statusMessage}
        onPomodoroStart={handlePomodoroStart}
        onPomodoroComplete={handlePomodoroComplete}
        companionProps={{
          activePokemon,
          level,
          xpInCurrentLevel,
          xpNeededForNextLevel,
          xpProgress,
          nextLevel,
          maxLevel: MAX_LEVEL,
          isGrowthDataLoading,
          growthDataError,
          nextEvolution,
          canEvolveByLevel,
          onEvolve: handleEvolve,
          xpPerTask: XP_PER_TASK,
          availableTaskClaims,
          totalXp,
        }}
        taskBoardProps={{
          tasks,
          onAddTask: handleTaskCreate,
          onCompleteTask: completeTask,
          canCompleteTask: availableTaskClaims > 0,
          stats: {
            sessionsStarted: pomodorosStarted,
            sessionsCompleted: pomodorosCompleted,
            tasksCompleted,
            currentLevel: level,
          },
        }}
      />
    </StudyShell>
  );
}
