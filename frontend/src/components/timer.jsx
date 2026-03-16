"use client";

import { useEffect, useMemo, useState } from "react";

const FOCUS_SECONDS_TOTAL = 10;
const BREAK_SECONDS_TOTAL = 2;

export default function TimerComp({ onPomodoroStart, onPomodoroComplete }) {
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_SECONDS_TOTAL);
  const [isRunning, setIsRunning] = useState(false);
  const [canStartBreak, setCanStartBreak] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (mode === "focus") {
            setCanStartBreak(true);
            if (onPomodoroComplete) {
              onPomodoroComplete();
            }
            return 0;
          }

          setMode("focus");
          setCanStartBreak(false);
          return FOCUS_SECONDS_TOTAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, onPomodoroComplete]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const totalForMode = mode === "focus" ? FOCUS_SECONDS_TOTAL : BREAK_SECONDS_TOTAL;
  const progress = useMemo(() => {
    const elapsed = totalForMode - secondsLeft;
    return (elapsed / totalForMode) * 100;
  }, [secondsLeft, totalForMode]);

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }

    if (mode === "focus" && canStartBreak) {
      setMode("break");
      setSecondsLeft(BREAK_SECONDS_TOTAL);
      setCanStartBreak(false);
      setIsRunning(true);
      return;
    }

    if (mode === "focus" && (secondsLeft === FOCUS_SECONDS_TOTAL || secondsLeft === 0)) {
      if (onPomodoroStart) {
        onPomodoroStart();
      }
    }

    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode("focus");
    setCanStartBreak(false);
    setSecondsLeft(FOCUS_SECONDS_TOTAL);
  };

  const primaryLabel = () => {
    if (isRunning) {
      return mode === "focus" ? "Pause" : "Pause Break";
    }

    if (mode === "focus" && canStartBreak) {
      return "Start Break";
    }

    if (mode === "break") {
      return "Resume Break";
    }

    return secondsLeft === FOCUS_SECONDS_TOTAL ? "Start" : "Resume";
  };

  const modeDescription =
    mode === "focus"
      ? "Battle in progress! Keep your focus on the target."
      : "Potion time! Rest up and come back stronger.";

  return (
    <div className={`pokemon-window-inner ${isRunning ? "timer-active" : ""}`}>
      <p className="pixel-heading-sm" style={{ textTransform: "uppercase", letterSpacing: "2px" }}>
        {mode === "focus" ? "Focus Battle" : "Potion Break"}
      </p>
      <p className="pixel-text-sm mt-2 text-muted">{modeDescription}</p>
      <p className="timer-display mt-4">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </p>
      <div className={`pokemon-bar-container ${mode === "focus" ? "pokemon-bar-hp" : "pokemon-bar-xp"} mt-4`}>
        <div className="pokemon-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex gap-3 mt-4">
        <button
          className="pokemon-btn pokemon-btn-red"
          onClick={toggleTimer}
          style={{ minWidth: "160px" }}
        >
          {primaryLabel()}
        </button>
        <button className="pokemon-btn" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
}
