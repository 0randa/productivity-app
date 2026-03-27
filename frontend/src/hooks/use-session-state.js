import { useState, useEffect, useRef } from "react";
import { createTaskId } from "@/lib/pokemon";
import { loadSessionData, saveSessionData } from "@/lib/session-storage";
import {
  computeXp,
  buildXpLabel,
  pomodoroQuality,
  pomodoroSkipQuality,
  flowQuality,
} from "@/lib/xp";

function today() {
  return new Date().toISOString().split("T")[0];
}

function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function normalizeTask(raw) {
  const done = "done" in raw ? raw.done === true : raw.completed === true;
  return {
    ...raw,
    done,
    difficulty: raw.difficulty ?? "medium",
  };
}

export function useSessionState({ initialStreak = 0 } = {}) {
  const saved = () => loadSessionData() ?? {};

  const [tasks, setTasks] = useState(() => (saved().tasks ?? []).map(normalizeTask));
  const [pomodorosStarted,  setPomodorosStarted]  = useState(() => saved().pomodorosStarted  ?? 0);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [tasksCompleted,    setTasksCompleted]    = useState(() => saved().tasksCompleted    ?? 0);
  const [availableTaskClaims, setAvailableTaskClaims] = useState(() => saved().availableTaskClaims ?? 0);
  const [totalXp,   setTotalXp]   = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  // EXP v2 session/daily state
  const [lastSessionQuality, setLastSessionQuality] = useState(() => saved().lastSessionQuality ?? 1.0);
  const [dailyXpEarned,      setDailyXpEarned]      = useState(() => saved().dailyXpEarned      ?? 0);
  const [dailyXpDate,        setDailyXpDate]        = useState(() => saved().dailyXpDate        ?? null);
  const [streak,             setStreak]             = useState(initialStreak);
  const [lastStreakDate,     setLastStreakDate]     = useState(null);

  // Sync streak when CheckinContext resolves its Supabase load after mount
  useEffect(() => {
    if (initialStreak > 0) setStreak(initialStreak);
  }, [initialStreak]);

  // Ref mirrors availableTaskClaims for synchronous guard checks — prevents
  // rapid clicks from bypassing the claim gate before re-render.
  const claimsRef = useRef(saved().availableTaskClaims ?? 0);

  // Persist session-scoped data across page refreshes
  useEffect(() => {
    saveSessionData({
      tasks,
      pomodorosStarted,
      tasksCompleted,
      availableTaskClaims,
      lastSessionQuality,
      dailyXpEarned,
      dailyXpDate,
    });
  }, [tasks, pomodorosStarted, tasksCompleted, availableTaskClaims,
      lastSessionQuality, dailyXpEarned, dailyXpDate]);

  const setWelcomeMessage = ({ starterLabel, startLevel }) => {
    setStatusMessage(
      `Welcome in. You chose ${starterLabel} at level ${startLevel}. Complete pomodoros and tasks to gain XP.`,
    );
  };

  const updateStatusMessage = (message) => setStatusMessage(message);

  const handlePomodoroStart = () => setPomodorosStarted((prev) => prev + 1);

  const handlePomodoroComplete = () => {
    claimsRef.current = 1;
    setAvailableTaskClaims(1);
    setLastSessionQuality(pomodoroQuality());
    setPomodorosCompleted((prev) => prev + 1);
    setStatusMessage("Pomodoro complete. You can now claim XP from all queued tasks.");
  };

  const handlePomodoroSkip = (ratio) => {
    claimsRef.current = 1;
    setAvailableTaskClaims(1);
    setLastSessionQuality(pomodoroSkipQuality(ratio));
    setPomodorosCompleted((prev) => prev + 1);
    setStatusMessage("Focus session skipped. You can now claim XP from all queued tasks.");
  };

  const handleFlowComplete = (studiedSecs) => {
    const minutes = Math.floor(studiedSecs / 60);
    claimsRef.current = 1;
    setAvailableTaskClaims(1);
    setLastSessionQuality(flowQuality(studiedSecs));
    setStatusMessage(`Flow session complete — ${minutes}m of deep work. You can now claim XP from all queued tasks.`);
  };

  const handleTaskCreate = (taskName, difficulty = "medium") => {
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
        difficulty: ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "medium",
        done: false,
      },
    ]);

    if (availableTaskClaims > 0) {
      setStatusMessage(`Task added: ${normalizedTaskName}. You can complete it now to claim XP.`);
    } else {
      setStatusMessage(`Task added: ${normalizedTaskName}. Complete a pomodoro to unlock completion.`);
    }

    return true;
  };

  const handleTaskComplete = ({
    taskId,
    activePokemonLabel,
    currentLevel,
    resolveLevelForEarnedXp,
  }) => {
    const taskToComplete = tasks.find((task) => task.id === taskId && !task.done);
    if (!taskToComplete) return;

    if (claimsRef.current <= 0) {
      setStatusMessage("Complete a pomodoro first, then claim XP by finishing a task.");
      return;
    }

    // Compute XP using v2 formula
    const todayStr  = today();
    const todayXp   = dailyXpDate === todayStr ? dailyXpEarned : 0;
    const difficulty = taskToComplete.difficulty ?? "medium";
    const earned = computeXp({
      difficulty,
      sessionQuality: lastSessionQuality,
      streak,
      dailyXpEarned:  todayXp,
    });

    // Update daily XP
    const newDailyXp = todayXp + earned;
    setDailyXpEarned(newDailyXp);
    setDailyXpDate(todayStr);

    // Update streak
    let newStreak = streak;
    if (lastStreakDate !== todayStr) {
      newStreak = lastStreakDate === yesterday() ? streak + 1 : 1;
      setStreak(newStreak);
      setLastStreakDate(todayStr);
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, done: true, xpAwarded: earned } : task,
      ),
    );

    const nextTotalXp = totalXp + earned;
    const nextLevel   =
      typeof resolveLevelForEarnedXp === "function"
        ? resolveLevelForEarnedXp(nextTotalXp)
        : currentLevel;
    const didLevelUp  = nextLevel > currentLevel;

    setTasksCompleted((prev) => prev + 1);
    setTotalXp((prev) => prev + earned);

    const label     = activePokemonLabel ?? "Starter";
    const breakdown = buildXpLabel({ difficulty, sessionQuality: lastSessionQuality, streak: newStreak, dailyXpEarned: todayXp });
    const xpPart    = `+${earned} XP${breakdown ? ` ${breakdown}` : ""}`;
    setStatusMessage(
      didLevelUp
        ? `${taskToComplete.name} complete. ${label} gained ${xpPart} and reached level ${nextLevel}.`
        : `${taskToComplete.name} complete. ${label} gained ${xpPart}.`,
    );
  };

  const handleClearBoard = () => {
    setTasks([]);
    setStatusMessage("Quest board cleared.");
  };

  return {
    tasks,
    pomodorosStarted,
    pomodorosCompleted,
    setPomodorosCompleted,
    tasksCompleted,
    availableTaskClaims,
    totalXp,
    setTotalXp,
    statusMessage,
    streak,
    dailyXpEarned,
    dailyXpDate,
    setWelcomeMessage,
    updateStatusMessage,
    handlePomodoroStart,
    handlePomodoroComplete,
    handlePomodoroSkip,
    handleFlowComplete,
    handleTaskCreate,
    handleTaskComplete,
    handleClearBoard,
  };
}
