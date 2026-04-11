"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTimerTabTitle } from "@/hooks/use-timer-tab-title";
import {
  playVictorySound,
  stopVictorySound,
  playBreakMusic,
  stopBreakMusic,
  playHealSound,
  stopAllAudio,
  getMuted,
  setMuted,
} from "@/lib/victory-sound";
import { requestNotificationPermission, sendTimerNotification } from "@/lib/notifications";
import { loadSessionData, saveSessionData } from "@/lib/session-storage";

export default function FlowTimerComp({
  breakRatio = 5,
  testingMode = false,
  onFlowStart,
  onFlowComplete,
}) {
  // In testing mode, time runs 30x faster (2s per minute)
  const timeScale = testingMode ? 2 / 60 : 1;

  const savedRef = useRef(undefined);
  if (savedRef.current === undefined) {
    const t = loadSessionData()?.flowTimer;
    savedRef.current = t ?? null;
  }
  const _st = savedRef.current;

  const [phase, setPhase]               = useState(_st?.phase ?? "focus");
  const [secondsElapsed, setSecondsElapsed] = useState(_st?.secondsElapsed ?? 0);
  const [isRunning, setIsRunning]       = useState(false); // never auto-resume on refresh
  const [breakSecsTotal, setBreakSecsTotal] = useState(_st?.breakSecsTotal ?? 0);
  const [breakSecsLeft, setBreakSecsLeft]   = useState(_st?.breakSecsLeft ?? 0);
  const [isMuted, setIsMuted]           = useState(() => getMuted());

  const startedAtRef    = useRef(null); // Date.now() when this running stint started
  const elapsedAtPause  = useRef(_st?.secondsElapsed ?? 0); // accumulated before current stint
  const breakDeadline   = useRef(null);
  const completionFired = useRef(false);

  const toggleMute = () => {
    const next = !isMuted;
    setMuted(next);
    setIsMuted(next);
  };

  // Focus phase: count up
  useEffect(() => {
    if (!isRunning || phase !== "focus") return;
    startedAtRef.current = Date.now();
    const interval = setInterval(() => {
      const delta = Math.floor((Date.now() - startedAtRef.current) / 1000 / timeScale);
      setSecondsElapsed(elapsedAtPause.current + delta);
    }, 500);
    return () => clearInterval(interval);
  }, [isRunning, phase, timeScale]);

  // Break phase: count down
  useEffect(() => {
    if (!isRunning || phase !== "break") return;
    breakDeadline.current = Date.now() + breakSecsLeft * 1000;
    const interval = setInterval(() => {
      const remaining = Math.round((breakDeadline.current - Date.now()) / 1000);
      setBreakSecsLeft(remaining <= 0 ? 0 : remaining);
    }, 500);
    return () => clearInterval(interval);
  }, [isRunning, phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const mm = String(Math.floor((phase === "focus" ? secondsElapsed : breakSecsLeft) / 60)).padStart(2, "0");
  const ss = String((phase === "focus" ? secondsElapsed : breakSecsLeft) % 60).padStart(2, "0");
  const activeTitle = isRunning
    ? `${mm}:${ss} — ${phase === "focus" ? "Flow" : "Recovery"} | PomoPet`
    : null;
  const { showCompletionTitle } = useTimerTabTitle(activeTitle);

  // Break completion
  useEffect(() => {
    if (phase !== "break" || breakSecsLeft > 0 || !isRunning || completionFired.current) return;
    completionFired.current = true;
    setIsRunning(false);
    stopBreakMusic();
    playHealSound();
    sendTimerNotification("Recovery complete!", "You're recharged — dive back in when ready.");
    showCompletionTitle("Recovery complete! | PomoPet");
    onFlowComplete?.(secondsElapsed);
    // Reset for next session
    setPhase("focus");
    setSecondsElapsed(0);
    elapsedAtPause.current = 0;
    setBreakSecsTotal(0);
    setBreakSecsLeft(0);
    breakDeadline.current = null;
  }, [phase, breakSecsLeft, isRunning, secondsElapsed, onFlowComplete, showCompletionTitle]);

  // Persist state
  useEffect(() => {
    saveSessionData({
      flowTimer: { phase, secondsElapsed, breakSecsTotal, breakSecsLeft },
    });
  }, [phase, secondsElapsed, breakSecsTotal, breakSecsLeft]);

  const startFocus = () => {
    requestNotificationPermission();
    onFlowStart?.();
    setIsRunning(true);
  };

  const pauseFocus = () => {
    elapsedAtPause.current = secondsElapsed;
    setIsRunning(false);
  };

  const stopFlow = () => {
    const studied = secondsElapsed;
    if (studied < 60 * timeScale) return; // less than 1 scaled-minute worked
    elapsedAtPause.current = studied;
    setIsRunning(false);
    stopVictorySound();
    stopAllAudio();
    playVictorySound();
    sendTimerNotification(
      "Flow session done!",
      `${Math.floor(studied / 60)} min of deep work. Time to recover.`,
    );

    const scaledBreakSecs = Math.max(
      Math.floor(60 * timeScale),
      Math.floor(studied / breakRatio),
    );
    setBreakSecsTotal(scaledBreakSecs);
    setBreakSecsLeft(scaledBreakSecs);
    completionFired.current = false;
    setPhase("break");
  };

  const startBreak = () => {
    if (phase !== "break" || breakSecsLeft <= 0) return;
    requestNotificationPermission();
    stopVictorySound();
    playBreakMusic("shortBreak");
    setIsRunning(true);
  };

  const skipBreak = () => {
    stopAllAudio();
    playHealSound();
    setIsRunning(false);
    completionFired.current = true;
    onFlowComplete?.(secondsElapsed);
    setPhase("focus");
    setSecondsElapsed(0);
    elapsedAtPause.current = 0;
    setBreakSecsTotal(0);
    setBreakSecsLeft(0);
    breakDeadline.current = null;
  };

  const resetFlow = () => {
    stopAllAudio();
    setIsRunning(false);
    setPhase("focus");
    setSecondsElapsed(0);
    elapsedAtPause.current = 0;
    setBreakSecsTotal(0);
    setBreakSecsLeft(0);
    startedAtRef.current = null;
    breakDeadline.current = null;
    completionFired.current = false;
  };

  const fmtElapsed = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const breakProgress = breakSecsTotal > 0
    ? ((breakSecsTotal - breakSecsLeft) / breakSecsTotal) * 100
    : 0;

  const hasEnoughToStop = secondsElapsed >= 60 * timeScale;

  return (
    <div
      className={[
        "bg-[var(--window-bg)] border-[2px] border-[var(--window-border)]",
        "shadow-[inset_1px_1px_0_var(--window-highlight),inset_-1px_-1px_0_var(--window-shadow)] p-5",
        isRunning
          ? "shadow-[inset_2px_2px_0_var(--window-highlight),inset_-2px_-2px_0_var(--window-shadow),8px_8px_0_rgba(0,0,0,0.25)] -translate-x-0.5 -translate-y-0.5"
          : "",
        "transition-all duration-200",
      ].join(" ")}
    >
      {/* Mode label */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant={phase === "focus" ? "green" : "blue"}>
          {phase === "focus" ? "Flow State" : "Recovery"}
        </Badge>
        {phase === "break" && breakSecsTotal > 0 && (
          <span className="font-pixel-body text-[16px] text-[var(--text-muted)]">
            {Math.floor(secondsElapsed / 60)}m studied
          </span>
        )}
      </div>

      <p className="font-pixel-body text-[18px] text-[var(--text-muted)] mb-5">
        {phase === "focus"
          ? isRunning
            ? "In the zone. Stop when you're done."
            : secondsElapsed > 0
            ? "Paused. Resume when ready."
            : "Go until you can't. No timer, no pressure."
          : isRunning
          ? "Recharge. You've earned it."
          : "Recovery is ready. Start your break whenever you want."}
      </p>

      {/* Timer display */}
      <p
        className="font-pixel text-center leading-none tracking-widest text-[var(--text-dark)]"
        style={{
          fontSize: "clamp(48px, 8vw, 72px)",
          textShadow: "4px 4px 0 rgba(0,0,0,0.08)",
          fontVariantNumeric: "tabular-nums",
        }}
        aria-live="off"
        role="timer"
      >
        {phase === "focus" ? fmtElapsed(secondsElapsed) : fmtElapsed(breakSecsLeft)}
      </p>

      <Progress
        value={phase === "break" ? breakProgress : 0}
        className="mt-5"
        indicatorClassName="bg-[var(--xp-blue)]"
        style={{ opacity: phase === "break" ? 1 : 0.15 }}
      />

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mt-5">
        {phase === "focus" && (
          <>
            <Button
              variant="primary"
              size="lg"
              onClick={isRunning ? pauseFocus : startFocus}
              className="flex-1 min-w-[120px]"
            >
              {isRunning ? "Pause" : secondsElapsed > 0 ? "Resume" : "Start"}
            </Button>
            {(isRunning || secondsElapsed > 0) && (
              <Button
                variant="secondary"
                size="lg"
                onClick={stopFlow}
                disabled={!hasEnoughToStop}
              >
                Stop
              </Button>
            )}
          </>
        )}

        {phase === "break" && (
          <>
            <Button
              variant="primary"
              size="lg"
              className="flex-1 min-w-[120px]"
              onClick={startBreak}
              disabled={isRunning}
            >
              {isRunning ? "Recovering…" : "Start Break"}
            </Button>
            <Button variant="secondary" onClick={skipBreak}>
              Skip ▸▸
            </Button>
          </>
        )}

        <Button variant="ghost" onClick={resetFlow}>
          Reset
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={16} aria-hidden="true" /> : <Volume2 size={16} aria-hidden="true" />}
        </Button>
      </div>

      {testingMode && (
        <p className="font-pixel-body text-[16px] mt-3" style={{ color: "var(--poke-blue)", opacity: 0.7 }}>
          TEST MODE: 2s per minute
        </p>
      )}
    </div>
  );
}
