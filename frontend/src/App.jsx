"use client";

import { useEffect, useMemo, useState } from "react";
import StarterSelection from "@/components/starter-selection";
import StudyDashboard from "@/components/study-dashboard";
import StudyShell from "@/components/study-shell";
import { useAuth } from "@/context/auth-context";
import { usePokemonProgress } from "@/hooks/use-pokemon-progress";
import { useSessionState } from "@/hooks/use-session-state";
import { useStarterSelection } from "@/hooks/use-starter-selection";
import { loadGuestData, saveGuestData } from "@/lib/guest-storage";
import { loadUserProgress, saveUserProgress } from "@/lib/user-progress";
import {
  MAX_LEVEL,
  STARTERS,
  START_LEVEL,
  XP_PER_TASK,
  getPokemonAssets,
} from "@/lib/pokemon";

export default function App() {
  const { user, loading: authLoading } = useAuth();

  const [activePokemon, setActivePokemon] = useState(null);
  const [progressLoaded, setProgressLoaded] = useState(false);

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
    setPomodorosCompleted,
    tasksCompleted,
    availableTaskClaims,
    totalXp,
    setTotalXp,
    statusMessage,
    setWelcomeMessage,
    updateStatusMessage,
    handlePomodoroStart,
    handlePomodoroComplete,
    handleTaskCreate,
    handleTaskComplete,
  } = useSessionState();

  // Load progress once auth resolves, resetting state first on every change
  useEffect(() => {
    if (authLoading) return;

    // Always reset to a clean slate before loading (handles logout correctly)
    setActivePokemon(null);
    setTotalXp(0);
    setPomodorosCompleted(0);
    setProgressLoaded(false);

    if (user) {
      loadUserProgress().then(({ activePokemon: ap, totalXp: xp, pomodorosCompleted: pc }) => {
        if (ap) setActivePokemon(ap);
        setTotalXp(xp);
        setPomodorosCompleted(pc);
        setProgressLoaded(true);
      });
    } else {
      const saved = loadGuestData();
      if (saved?.activePokemon) setActivePokemon(saved.activePokemon);
      if (saved?.totalXp) setTotalXp(saved.totalXp);
      if (saved?.pomodorosCompleted) setPomodorosCompleted(saved.pomodorosCompleted);
      setProgressLoaded(true);
    }
  }, [user, authLoading]);

  // Persist progress whenever it changes
  useEffect(() => {
    if (!progressLoaded) return;

    if (user) {
      saveUserProgress({ activePokemon, totalXp, pomodorosCompleted });
    } else {
      saveGuestData({ activePokemon, totalXp, pomodorosCompleted });
    }
  }, [activePokemon, totalXp, pomodorosCompleted, user, progressLoaded]);

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
    if (hour < 12) return "Morning Momentum";
    if (hour < 18) return "Afternoon Flow";
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
    if (!nextEvolution) return;

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

  // Wait for auth + progress before rendering
  if (authLoading || !progressLoaded) {
    return null;
  }

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
