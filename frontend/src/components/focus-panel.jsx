"use client";

import { useState } from "react";
import TimerComp from "@/components/timer";
import { loadGuestData, saveGuestData } from "@/lib/guest-storage";

const DEFAULTS = { focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 };

const toStrDraft = (s) => ({
  focusMinutes:      String(s.focusMinutes),
  shortBreakMinutes: String(s.shortBreakMinutes),
  longBreakMinutes:  String(s.longBreakMinutes),
});

const isValidMinutes = (v) => {
  const n = parseInt(v, 10);
  return v !== "" && !isNaN(n) && n >= 1;
};

export default function FocusPanel({ statusMessage, onPomodoroStart, onPomodoroComplete }) {
  const [settings, setSettings] = useState(() => {
    const saved = loadGuestData();
    return saved?.timerSettings ?? DEFAULTS;
  });
  // draft stores raw strings so the user can clear a field and retype freely
  const [draft, setDraft]       = useState(() => toStrDraft(loadGuestData()?.timerSettings ?? DEFAULTS));
  const [showSettings, setShowSettings] = useState(false);

  const canSave = isValidMinutes(draft.focusMinutes)
               && isValidMinutes(draft.shortBreakMinutes)
               && isValidMinutes(draft.longBreakMinutes);

  const openSettings = () => {
    setDraft(toStrDraft(settings));
    setShowSettings(true);
  };

  const restoreDefaults = () => setDraft(toStrDraft(DEFAULTS));

  const saveSettings = (e) => {
    e.preventDefault();
    if (!canSave) return;
    const newSettings = {
      focusMinutes:      parseInt(draft.focusMinutes, 10),
      shortBreakMinutes: parseInt(draft.shortBreakMinutes, 10),
      longBreakMinutes:  parseInt(draft.longBreakMinutes, 10),
    };
    setSettings(newSettings);
    // Merge timer settings into existing guest data so other fields aren't overwritten
    const existing = loadGuestData() ?? {};
    saveGuestData({ ...existing, timerSettings: newSettings });
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
            <div className="flex gap-3 mt-2">
              <button type="submit" className="pokemon-btn pokemon-btn-red" disabled={!canSave}>
                Save
              </button>
              <button type="button" className="pokemon-btn" onClick={restoreDefaults}>
                Restore Defaults
              </button>
            </div>
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
  const invalid = !isValidMinutes(value);
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="pixel-text-sm" style={{ minWidth: "100px" }}>{label}</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max="120"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pokemon-input"
          style={{
            width: "70px",
            textAlign: "center",
            borderColor: invalid ? "var(--poke-red)" : undefined,
          }}
        />
        <span className="pixel-text-sm text-muted">min</span>
      </div>
    </div>
  );
}
