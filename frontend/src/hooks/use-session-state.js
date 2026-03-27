import { useState, useEffect, useRef } from "react";
import { XP_PER_TASK, createTaskId } from "@/lib/pokemon";
import { loadSessionData, saveSessionData } from "@/lib/session-storage";

function normalizeTask(raw) {
  const done = "done" in raw
    ? raw.done === true
    : raw.completed === true;
  return { ...raw, done };
}

export function useSessionState() {
  const [tasks, setTasks] = useState(() => (loadSessionData()?.tasks ?? []).map(normalizeTask));
  const [pomodorosStarted, setPomodorosStarted] = useState(() => loadSessionData()?.pomodorosStarted ?? 0);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(() => loadSessionData()?.tasksCompleted ?? 0);
  const [availableTaskClaims, setAvailableTaskClaims] = useState(() => loadSessionData()?.availableTaskClaims ?? 0);
  // Ref mirrors availableTaskClaims for synchronous guard checks — prevents
  // rapid clicks from consuming more claims than earned before re-render.
  const claimsRef = useRef(loadSessionData()?.availableTaskClaims ?? 0);
  const [totalXp, setTotalXp] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  // Persist session-scoped data across page refreshes
  useEffect(() => {
    saveSessionData({ tasks, pomodorosStarted, tasksCompleted, availableTaskClaims });
  }, [tasks, pomodorosStarted, tasksCompleted, availableTaskClaims]);

  const setWelcomeMessage = ({ starterLabel, startLevel }) => {
    setStatusMessage(
      `Welcome in. You chose ${starterLabel} at level ${startLevel}. Complete pomodoros and tasks to gain XP.`,
    );
  };

  const updateStatusMessage = (message) => {
    setStatusMessage(message);
  };

  const handlePomodoroStart = () => {
    setPomodorosStarted((prev) => prev + 1);
  };

  const handlePomodoroComplete = () => {
    claimsRef.current = 1;
    setPomodorosCompleted((prev) => prev + 1);
    setAvailableTaskClaims(1);
    setStatusMessage("Pomodoro complete. You can now claim XP from all queued tasks.");
  };

  const handleFlowComplete = (studiedSecs) => {
    const minutes = Math.floor(studiedSecs / 60);
    claimsRef.current = 1;
    setAvailableTaskClaims(1);
    setStatusMessage(`Flow session complete — ${minutes}m of deep work. You can now claim XP from all queued tasks.`);
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

  const handleTaskComplete = ({
    taskId,
    activePokemonLabel,
    currentLevel,
    resolveLevelForEarnedXp,
  }) => {
    const taskToComplete = tasks.find(
      (task) => task.id === taskId && !task.done,
    );
    if (!taskToComplete) {
      return;
    }

    if (claimsRef.current <= 0) {
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
    const nextLevelAfterGain =
      typeof resolveLevelForEarnedXp === "function"
        ? resolveLevelForEarnedXp(nextTotalXp)
        : currentLevel;
    const didLevelUp = nextLevelAfterGain > currentLevel;

    setTasksCompleted((prev) => prev + 1);
    setTotalXp((prev) => prev + XP_PER_TASK);
    setStatusMessage(
      didLevelUp
        ? `${taskToComplete.name} complete. ${activePokemonLabel ?? "Starter"} gained ${XP_PER_TASK} XP and reached level ${nextLevelAfterGain}.`
        : `${taskToComplete.name} complete. ${activePokemonLabel ?? "Starter"} gained ${XP_PER_TASK} XP.`,
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
    setWelcomeMessage,
    updateStatusMessage,
    handlePomodoroStart,
    handlePomodoroComplete,
    handleFlowComplete,
    handleTaskCreate,
    handleTaskComplete,
    handleClearBoard,
  };
}
