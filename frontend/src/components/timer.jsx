"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { playVictorySound, stopVictorySound, playBreakMusic, stopBreakMusic, stopAllAudio, playHealSound } from "@/lib/victory-sound";

// ─── TEST MODE ────────────────────────────────────────────────────────────────
// Set to true for quick iteration; overrides the settings-panel values.
const TESTING = false;
const TEST_FOCUS_SECS = 10;
const TEST_BREAK_SECS = 2;
// ─────────────────────────────────────────────────────────────────────────────

export default function TimerComp({
  focusMinutes = 25,
  shortBreakMinutes = 5,
  longBreakMinutes = 15,
  onPomodoroStart,
  onPomodoroComplete,
  onPomodoroSkip,
}) {
  const focusSecs      = TESTING ? TEST_FOCUS_SECS : focusMinutes * 60;
  const shortBreakSecs = TESTING ? TEST_BREAK_SECS : shortBreakMinutes * 60;
  const longBreakSecs  = TESTING ? TEST_BREAK_SECS : longBreakMinutes * 60;

  const [mode, setMode]               = useState("focus"); // "focus" | "shortBreak" | "longBreak"
  const [secondsLeft, setSecondsLeft] = useState(focusSecs);
  const [isRunning, setIsRunning]     = useState(false);
  const [canStartBreak, setCanStartBreak] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0); // resets to 0 after long break

  // Prevent the completion effect from firing more than once per countdown
  const completionFired = useRef(false);

  // ── Reset when settings (or test mode) change ──────────────────────────────
  useEffect(() => {
    setIsRunning(false);
    setMode("focus");
    setCanStartBreak(false);
    setSecondsLeft(focusSecs);
    setPomodoroCount(0);
    completionFired.current = false;
  }, [focusSecs, shortBreakSecs, longBreakSecs]);

  // ── Countdown tick — ONLY decrements secondsLeft ───────────────────────────
  // No other setState calls here, which avoids the React "setState during
  // render of another component" warning.
  useEffect(() => {
    if (!isRunning) return undefined;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // ── Completion handler — fires when secondsLeft reaches 0 ──────────────────
  useEffect(() => {
    // Reset the guard whenever the clock is ticking above 0
    if (secondsLeft > 0) {
      completionFired.current = false;
      return;
    }

    // Only act once per countdown-to-zero, and only while the timer was running
    if (!isRunning || completionFired.current) return;
    completionFired.current = true;

    setIsRunning(false);

    if (mode === "focus") {
      playVictorySound();
      setPomodoroCount((c) => c + 1);
      setCanStartBreak(true);
      onPomodoroComplete?.();
    } else {
      stopBreakMusic();
      playHealSound();
      if (mode === "longBreak") setPomodoroCount(0);
      setMode("focus");
      setCanStartBreak(false);
      setSecondsLeft(focusSecs);
    }
  }, [secondsLeft, isRunning, mode, focusSecs, onPomodoroComplete]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const totalForMode =
    mode === "focus" ? focusSecs : mode === "longBreak" ? longBreakSecs : shortBreakSecs;

  const progress = useMemo(() => {
    const elapsed = totalForMode - secondsLeft;
    return (elapsed / totalForMode) * 100;
  }, [secondsLeft, totalForMode]);

  const isLongBreakDue = pomodoroCount > 0 && pomodoroCount % 4 === 0;

  const startBreak = (type) => {
    stopVictorySound();
    const breakMode = type === "long" ? "longBreak" : "shortBreak";
    setMode(breakMode);
    setSecondsLeft(type === "long" ? longBreakSecs : shortBreakSecs);
    setCanStartBreak(false);
    completionFired.current = false;
    playBreakMusic(breakMode);
    setIsRunning(true);
  };

  const toggleTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }

    if (mode === "focus" && canStartBreak) {
      startBreak(isLongBreakDue ? "long" : "short");
      return;
    }

    if (mode === "focus" && (secondsLeft === focusSecs || secondsLeft === 0)) {
      onPomodoroStart?.();
    }

    setIsRunning(true);
  };

  const skipTimer = () => {
    stopAllAudio();
    setIsRunning(false);
    completionFired.current = true;

    if (mode === "focus") {
      // Proportional XP: how much of the session was completed (0–1)
      const elapsed = focusSecs - secondsLeft;
      const ratio = focusSecs > 0 ? elapsed / focusSecs : 0;

      setPomodoroCount((c) => c + 1);
      setCanStartBreak(true);
      setSecondsLeft(0);
      onPomodoroSkip?.(ratio);
    } else {
      // Skipping a break — no penalty, just return to focus
      playHealSound();
      if (mode === "longBreak") setPomodoroCount(0);
      setMode("focus");
      setCanStartBreak(false);
      setSecondsLeft(focusSecs);
    }
  };

  const resetTimer = () => {
    stopAllAudio();
    setIsRunning(false);
    setMode("focus");
    setCanStartBreak(false);
    setSecondsLeft(focusSecs);
    setPomodoroCount(0);
    completionFired.current = false;
  };

  const primaryLabel = () => {
    if (isRunning) return mode === "focus" ? "Pause" : "Pause Break";
    if (mode === "focus" && canStartBreak) return isLongBreakDue ? "Long Break" : "Short Break";
    if (mode !== "focus") return "Resume Break";
    return secondsLeft === focusSecs ? "Start" : "Resume";
  };

  const modeLabel =
    mode === "focus" ? "Focus Battle" : mode === "longBreak" ? "Camp Rest" : "Potion Break";

  const modeDescription =
    mode === "focus"
      ? "Battle in progress! Keep your focus on the target."
      : mode === "longBreak"
      ? "Long rest! Recover fully before the next challenge."
      : "Potion time! Rest up and come back stronger.";

  const countInCycle = pomodoroCount % 4;

  return (
    <div className={`pokemon-window-inner ${isRunning ? "timer-active" : ""}`}>
      <div className="flex items-center justify-between">
        <p className="pixel-heading-sm" style={{ textTransform: "uppercase", letterSpacing: "2px" }}>
          {modeLabel}
        </p>
        {/* Pomodoro progress dots — fill red as each session completes */}
        <div className="flex gap-2" style={{ alignItems: "center" }}>
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                border: "2px solid var(--poke-red)",
                background: i < countInCycle ? "var(--poke-red)" : "transparent",
                display: "inline-block",
              }}
            />
          ))}
        </div>
      </div>

      <p className="pixel-text-sm mt-2 text-muted">{modeDescription}</p>

      <p className="timer-display mt-4">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </p>

      <div className={`pokemon-bar-container ${mode === "focus" ? "pokemon-bar-hp" : "pokemon-bar-xp"} mt-4`}>
        <div className="pokemon-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          className="pokemon-btn pokemon-btn-red"
          onClick={toggleTimer}
          style={{ minWidth: "130px" }}
        >
          {primaryLabel()}
        </button>
        {(isRunning || mode !== "focus") && (
          <button className="pokemon-btn pokemon-btn-blue" onClick={skipTimer}>
            Skip ▸▸
          </button>
        )}
        <button className="pokemon-btn" onClick={resetTimer}>
          Reset
        </button>
      </div>

      {TESTING && (
        <p className="pixel-text-sm mt-3" style={{ color: "var(--poke-blue)", opacity: 0.7 }}>
          ⚠ TEST MODE: {TEST_FOCUS_SECS}s focus / {TEST_BREAK_SECS}s breaks
        </p>
      )}
    </div>
  );
}
