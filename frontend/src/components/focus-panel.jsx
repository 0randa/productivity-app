"use client";

import { useState } from "react";
import TimerComp from "@/components/timer";

const DEFAULT_SETTINGS = { focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 };

export default function FocusPanel({ statusMessage, onPomodoroStart, onPomodoroComplete }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [draft, setDraft] = useState(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

  const openSettings = () => {
    setDraft({ ...settings });
    setShowSettings(true);
  };

  const saveSettings = (e) => {
    e.preventDefault();
    setSettings({ ...draft });
    setShowSettings(false);
  };

  return (
    <div className="pokemon-window">
      <div className="flex items-center justify-between">
        <span className="pokemon-badge pokemon-badge-red">Battle Mode!</span>
        <button
          className="pokemon-btn"
          style={{ fontSize: "8px", padding: "5px 10px" }}
          onClick={() => (showSettings ? setShowSettings(false) : openSettings())}
        >
          {showSettings ? "✕ Close" : "⚙ Settings"}
        </button>
      </div>

      {showSettings ? (
        <div className="pokemon-window-inner mt-4">
          <p className="pixel-heading-sm mb-3">Timer Settings</p>
          <form onSubmit={saveSettings} className="flex-col gap-3" style={{ display: "flex" }}>
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
            <button type="submit" className="pokemon-btn pokemon-btn-red mt-2">
              Save
            </button>
          </form>
        </div>
      ) : (
        <>
          <h2 className="pixel-heading mt-4">Choose your move and give it everything!</h2>
          <p className="pixel-text mt-3 text-muted">
            Lock in, go all out, and let your streak carry you to victory.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="pokemon-chip">Stay Sharp</span>
            <span className="pokemon-chip">One Move</span>
            <span className="pokemon-chip">Victory Lap</span>
          </div>
        </>
      )}

      <div className="mt-6">
        <TimerComp
          focusMinutes={settings.focusMinutes}
          shortBreakMinutes={settings.shortBreakMinutes}
          longBreakMinutes={settings.longBreakMinutes}
          onPomodoroStart={onPomodoroStart}
          onPomodoroComplete={onPomodoroComplete}
        />
      </div>

      {statusMessage && (
        <div className="pokemon-window-inner mt-4">
          <p className="pixel-text" style={{ color: "var(--poke-blue)" }}>
            {statusMessage}
          </p>
        </div>
      )}
    </div>
  );
}

function SettingRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="pixel-text-sm" style={{ minWidth: "100px" }}>{label}</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max="120"
          value={value}
          onChange={(e) => onChange(Math.max(1, Math.min(120, Number(e.target.value))))}
          className="pokemon-input"
          style={{ width: "70px", textAlign: "center" }}
        />
        <span className="pixel-text-sm text-muted">min</span>
      </div>
    </div>
  );
}
