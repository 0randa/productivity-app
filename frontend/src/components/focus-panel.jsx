"use client";

import { useState } from "react";
import TimerComp from "@/components/timer";

const DEFAULTS = { focusMinutes: 25, shortBreakMinutes: 5, longBreakMinutes: 15 };

const toStrDraft = (s) => ({
  focusMinutes:      String(s.focusMinutes),
  shortBreakMinutes: String(s.shortBreakMinutes),
  longBreakMinutes:  String(s.longBreakMinutes),
});

export default function FocusPanel({ statusMessage, onPomodoroStart, onPomodoroComplete }) {
  const [settings, setSettings] = useState(DEFAULTS);
  // draft stores raw strings so the user can clear a field and retype freely
  const [draft, setDraft]       = useState(toStrDraft(DEFAULTS));
  const [errors, setErrors]     = useState({});
  const [showSettings, setShowSettings] = useState(false);

  const openSettings = () => {
    setDraft(toStrDraft(settings));
    setErrors({});
    setShowSettings(true);
  };

  const restoreDefaults = () => {
    setDraft(toStrDraft(DEFAULTS));
    setErrors({});
  };

  const saveSettings = (e) => {
    e.preventDefault();

    const focus      = parseInt(draft.focusMinutes, 10);
    const shortBreak = parseInt(draft.shortBreakMinutes, 10);
    const longBreak  = parseInt(draft.longBreakMinutes, 10);

    const newErrors = {};
    if (!draft.focusMinutes      || isNaN(focus)      || focus      < 1) newErrors.focusMinutes      = "Must be ≥ 1";
    if (!draft.shortBreakMinutes || isNaN(shortBreak) || shortBreak < 1) newErrors.shortBreakMinutes = "Must be ≥ 1";
    if (!draft.longBreakMinutes  || isNaN(longBreak)  || longBreak  < 1) newErrors.longBreakMinutes  = "Must be ≥ 1";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSettings({ focusMinutes: focus, shortBreakMinutes: shortBreak, longBreakMinutes: longBreak });
    setErrors({});
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
              error={errors.focusMinutes}
              onChange={(v) => { setDraft((d) => ({ ...d, focusMinutes: v })); setErrors((e) => ({ ...e, focusMinutes: undefined })); }}
            />
            <SettingRow
              label="Short Break"
              value={draft.shortBreakMinutes}
              error={errors.shortBreakMinutes}
              onChange={(v) => { setDraft((d) => ({ ...d, shortBreakMinutes: v })); setErrors((e) => ({ ...e, shortBreakMinutes: undefined })); }}
            />
            <SettingRow
              label="Long Break"
              value={draft.longBreakMinutes}
              error={errors.longBreakMinutes}
              onChange={(v) => { setDraft((d) => ({ ...d, longBreakMinutes: v })); setErrors((e) => ({ ...e, longBreakMinutes: undefined })); }}
            />
            <div className="flex gap-3 mt-2">
              <button type="submit" className="pokemon-btn pokemon-btn-red">
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

function SettingRow({ label, value, error, onChange }) {
  return (
    <div className="flex-col" style={{ display: "flex", gap: "4px" }}>
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
              borderColor: error ? "var(--poke-red)" : undefined,
            }}
          />
          <span className="pixel-text-sm text-muted">min</span>
        </div>
      </div>
      {error && (
        <p className="pixel-text-sm" style={{ color: "var(--poke-red)", textAlign: "right" }}>
          {error}
        </p>
      )}
    </div>
  );
}
