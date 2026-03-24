"use client";

import { useState } from "react";
import { Settings, X } from "lucide-react";
import FlowTimerComp from "@/components/flow-timer";
import TimerComp from "@/components/timer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { loadGuestData, saveGuestData } from "@/lib/guest-storage";

const POMODORO_DEFAULTS = { focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 };
const FLOW_DEFAULTS = { breakRatio: 5 };

const toStrDraft = (s) => ({
  focusMinutes:      String(s.focusMinutes),
  shortBreakMinutes: String(s.shortBreakMinutes),
  longBreakMinutes:  String(s.longBreakMinutes),
});

const isValidMinutes = (v) => {
  const n = parseInt(v, 10);
  return v !== "" && !isNaN(n) && n >= 1;
};

const isValidRatio = (v) => {
  const n = parseInt(v, 10);
  return v !== "" && !isNaN(n) && n >= 2 && n <= 20;
};

export default function FocusPanel({
  statusMessage,
  onPomodoroStart,
  onPomodoroComplete,
  onFlowStart,
  onFlowComplete,
}) {
  const [timerMode, setTimerMode] = useState(() => loadGuestData()?.timerMode ?? "pomodoro");
  const [settings, setSettings] = useState(() => {
    const saved = loadGuestData();
    return saved?.timerSettings ?? POMODORO_DEFAULTS;
  });
  const [flowSettings, setFlowSettings] = useState(() => {
    const saved = loadGuestData();
    return saved?.flowSettings ?? FLOW_DEFAULTS;
  });
  const [draft, setDraft] = useState(() => toStrDraft(loadGuestData()?.timerSettings ?? POMODORO_DEFAULTS));
  const [flowDraft, setFlowDraft] = useState(() => String(loadGuestData()?.flowSettings?.breakRatio ?? FLOW_DEFAULTS.breakRatio));
  const [testingMode, setTestingMode] = useState(() => Boolean(loadGuestData()?.testingMode));
  const [showSettings, setShowSettings] = useState(false);

  const canSave = isValidMinutes(draft.focusMinutes)
               && isValidMinutes(draft.shortBreakMinutes)
               && isValidMinutes(draft.longBreakMinutes);

  const canSaveFlow = isValidRatio(flowDraft);

  const openSettings = () => {
    setDraft(toStrDraft(settings));
    setFlowDraft(String(flowSettings.breakRatio));
    setShowSettings(true);
  };

  const restoreDefaults = () => {
    setDraft(toStrDraft(POMODORO_DEFAULTS));
    setFlowDraft(String(FLOW_DEFAULTS.breakRatio));
  };

  const saveSettings = (e) => {
    e.preventDefault();
    if (timerMode === "pomodoro" && !canSave) return;
    if (timerMode === "flow" && !canSaveFlow) return;

    const existing = loadGuestData() ?? {};
    if (timerMode === "pomodoro") {
      const newSettings = {
        focusMinutes:      parseInt(draft.focusMinutes, 10),
        shortBreakMinutes: parseInt(draft.shortBreakMinutes, 10),
        longBreakMinutes:  parseInt(draft.longBreakMinutes, 10),
      };
      setSettings(newSettings);
      saveGuestData({ ...existing, timerSettings: newSettings });
    } else {
      const newFlow = { breakRatio: parseInt(flowDraft, 10) };
      setFlowSettings(newFlow);
      saveGuestData({ ...existing, flowSettings: newFlow });
    }
    setShowSettings(false);
  };

  const switchMode = (mode) => {
    setTimerMode(mode);
    const existing = loadGuestData() ?? {};
    saveGuestData({ ...existing, timerMode: mode });
    setShowSettings(false);
  };

  const toggleTestingMode = () => {
    setTestingMode((prev) => {
      const next = !prev;
      const existing = loadGuestData() ?? {};
      saveGuestData({ ...existing, testingMode: next });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("pomopet:testing-mode", { detail: { enabled: next } }));
      }
      return next;
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle>Focus</CardTitle>
            <Badge variant={timerMode === "flow" ? "green" : "red"}>
              {timerMode === "flow" ? "Flow Mode" : "Battle Mode"}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (showSettings ? setShowSettings(false) : openSettings())}
            aria-label={showSettings ? "Close settings" : "Timer settings"}
            aria-expanded={showSettings}
          >
            {showSettings ? <X size={14} aria-hidden="true" /> : <Settings size={14} aria-hidden="true" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showSettings ? (
          <div className="bg-[var(--window-bg)] border-[2px] border-[var(--window-border)] shadow-[inset_1px_1px_0_var(--window-highlight),inset_-1px_-1px_0_var(--window-shadow)] p-4">
            {/* Mode selector */}
            <p className="font-pixel text-[9px] tracking-widest uppercase mb-3 text-[var(--text-dark)]">Timer Mode</p>
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                variant={timerMode === "pomodoro" ? "primary" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => switchMode("pomodoro")}
              >
                Pomodoro
              </Button>
              <Button
                type="button"
                variant={timerMode === "flow" ? "primary" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => switchMode("flow")}
              >
                Flow State
              </Button>
            </div>

            <Separator className="mb-4" />

            <p className="font-pixel text-[9px] tracking-widest uppercase mb-4 text-[var(--text-dark)]">Timer Settings</p>
            <form onSubmit={saveSettings} className="space-y-3">
              {timerMode === "pomodoro" ? (
                <>
                  <SettingRow
                    label="Focus"
                    value={draft.focusMinutes}
                    onChange={(v) => setDraft((d) => ({ ...d, focusMinutes: v }))}
                  />
                  <SettingRow
                    label="Short Break"
                    value={draft.shortBreakMinutes}
                    onChange={(v) => setDraft((d) => ({ ...d, shortBreakMinutes: v }))}
                  />
                  <SettingRow
                    label="Long Break"
                    value={draft.longBreakMinutes}
                    onChange={(v) => setDraft((d) => ({ ...d, longBreakMinutes: v }))}
                  />
                </>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <Label className="min-w-[90px] leading-tight">Break per min worked</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-pixel-body text-[18px] text-[var(--text-muted)]">1 /</span>
                    <Input
                      type="number"
                      min="2"
                      max="20"
                      value={flowDraft}
                      onChange={(e) => setFlowDraft(e.target.value)}
                      className="w-[70px] text-center"
                      style={{ borderColor: !canSaveFlow ? "var(--poke-red)" : undefined }}
                    />
                    <span className="font-pixel-body text-[18px] text-[var(--text-muted)]">min</span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={timerMode === "pomodoro" ? !canSave : !canSaveFlow}
                >
                  Save
                </Button>
                <Button type="button" variant="default" size="sm" onClick={restoreDefaults}>
                  Defaults
                </Button>
              </div>
            </form>

            <Separator className="my-4" />

            <div className="space-y-2">
              <p className="font-pixel text-[9px] tracking-widest uppercase text-[var(--text-dark)]">
                Testing
              </p>
              <Button
                type="button"
                variant={testingMode ? "destructive" : "secondary"}
                size="lg"
                className="w-full"
                onClick={toggleTestingMode}
              >
                {testingMode ? "Disable Testing Mode" : "Enable Testing Mode"}
              </Button>
              <p className="font-pixel-body text-[16px] text-[var(--text-muted)]">
                {timerMode === "pomodoro"
                  ? "Testing mode runs focus as 2 seconds and breaks as 1 second."
                  : "Testing mode runs at 30× speed (2 seconds per minute)."}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {timerMode === "pomodoro" ? (
              <>
                <p className="font-pixel text-[11px] leading-relaxed tracking-wide text-[var(--text-dark)]">
                  Choose your move and give it everything!
                </p>
                <p className="font-pixel-body text-[20px] text-[var(--text-muted)] mt-2">
                  Lock in, go all out, and let your streak carry you to victory.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["Stay Sharp", "One Move", "Victory Lap"].map((chip) => (
                    <span
                      key={chip}
                      className="font-pixel text-[8px] tracking-widest uppercase px-3 py-1.5 bg-white border-[2px] border-[var(--window-border)] shadow-[2px_2px_0_rgba(0,0,0,0.08)] text-[var(--text-dark)]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="font-pixel text-[11px] leading-relaxed tracking-wide text-[var(--text-dark)]">
                  Ride the wave. Stop when you&apos;re spent.
                </p>
                <p className="font-pixel-body text-[20px] text-[var(--text-muted)] mt-2">
                  Work until you can&apos;t, then rest for 1/{flowSettings.breakRatio} of the time you studied.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["No Clock", "Deep Work", "Full Send"].map((chip) => (
                    <span
                      key={chip}
                      className="font-pixel text-[8px] tracking-widest uppercase px-3 py-1.5 bg-white border-[2px] border-[var(--window-border)] shadow-[2px_2px_0_rgba(0,0,0,0.08)] text-[var(--text-dark)]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <Separator />

        {timerMode === "pomodoro" ? (
          <TimerComp
            focusMinutes={settings.focusMinutes}
            shortBreakMinutes={settings.shortBreakMinutes}
            longBreakMinutes={settings.longBreakMinutes}
            testingMode={testingMode}
            onPomodoroStart={onPomodoroStart}
            onPomodoroComplete={onPomodoroComplete}
          />
        ) : (
          <FlowTimerComp
            breakRatio={flowSettings.breakRatio}
            testingMode={testingMode}
            onFlowStart={onFlowStart}
            onFlowComplete={onFlowComplete}
          />
        )}

        {statusMessage && (
          <div className="bg-[var(--window-bg)] border-[2px] border-[var(--poke-blue)] p-3 mt-2">
            <p className="font-pixel-body text-[18px]" style={{ color: "var(--poke-blue)" }}>
              {statusMessage}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SettingRow({ label, value, onChange }) {
  const invalid = !isValidMinutes(value);
  return (
    <div className="flex items-center justify-between gap-3">
      <Label className="min-w-[90px]">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          max="120"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-[70px] text-center"
          style={{ borderColor: invalid ? "var(--poke-red)" : undefined }}
        />
        <span className="font-pixel-body text-[18px] text-[var(--text-muted)]">min</span>
      </div>
    </div>
  );
}
