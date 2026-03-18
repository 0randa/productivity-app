/**
 * Pokémon audio helpers.
 * Victory sound plays once after a focus session.
 * Break music loops for the duration of the break and stops on reset/new session.
 */

let victoryAudio = null;
let breakAudio = null;

// ── Victory ────────────────────────────────────────────────────────────────────

export function playVictorySound() {
  if (typeof window === "undefined") return;

  stopVictorySound();
  victoryAudio = new Audio("/victory-trainer.mp3");
  victoryAudio.volume = 0.8;
  victoryAudio.play().catch(() => {});
}

export function stopVictorySound() {
  if (!victoryAudio) return;
  victoryAudio.pause();
  victoryAudio.currentTime = 0;
  victoryAudio = null;
}

// ── Break music ────────────────────────────────────────────────────────────────

const BREAK_TRACKS = {
  shortBreak: "/pokemon-center.mp3",
  longBreak:  null, // add a long-break track here when ready
};

export function playBreakMusic(breakType) {
  if (typeof window === "undefined") return;

  const src = BREAK_TRACKS[breakType];
  if (!src) return;

  stopBreakMusic();
  breakAudio = new Audio(src);
  breakAudio.volume = 0.6;
  breakAudio.loop = true;
  breakAudio.play().catch(() => {});
}

export function pauseBreakMusic() {
  if (!breakAudio) return;
  breakAudio.pause();
  // currentTime intentionally preserved so resume continues from same spot
}

export function resumeBreakMusic() {
  if (!breakAudio) return;
  breakAudio.play().catch(() => {});
}

export function stopBreakMusic() {
  if (!breakAudio) return;
  breakAudio.pause();
  breakAudio.currentTime = 0;
  breakAudio = null;
}

// ── Heal sound (plays when break ends naturally) ───────────────────────────────

export function playHealSound() {
  if (typeof window === "undefined") return;

  const audio = new Audio("/pokemon-heal.mp3");
  audio.volume = 0.8;
  audio.play().catch(() => {});
}

// ── Stop everything at once (used by Reset) ────────────────────────────────────

export function stopAllAudio() {
  stopVictorySound();
  stopBreakMusic();
}
