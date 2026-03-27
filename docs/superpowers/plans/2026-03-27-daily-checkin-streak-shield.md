# Daily Check-in + Streak Shield Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a daily check-in modal with XP + Pokedollars rewards, Supabase-backed streak tracking, and a proactive streak shield mechanic.

**Architecture:** Pure logic lives in `src/lib/checkin.js`. A `CheckinContext` provides streak/shield state globally (so `NavbarComp` inside `StudyShell` can read it without props). `CheckinProvider` loads its own Supabase data and fires a `pomopet:checkin-claimed` custom event when rewards are earned — `App.jsx` listens for this event to update XP/Pokedollars, the same pattern already used for `pomopet:testing-mode`. Streak state migrates off localStorage.

**Tech Stack:** Next.js App Router, React 19, Supabase, Vitest, shadcn Dialog, lucide-react icons.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `src/lib/checkin.js` | Pure date/streak/shield logic |
| Create | `src/lib/checkin.test.js` | Unit tests for checkin.js |
| Modify | `src/lib/user-progress.js` | Read/write 5 new Supabase fields |
| Create | `src/context/checkin-context.jsx` | Global checkin/streak/shield state via React Context |
| Modify | `src/components/providers.jsx` | Add CheckinProvider |
| Modify | `src/hooks/use-session-state.js` | Accept `initialStreak`; remove streak from localStorage |
| Create | `src/components/checkin-modal.jsx` | Check-in modal UI |
| Modify | `src/components/navbar.jsx` | Streak counter + shield badge (reads from CheckinContext) |
| Modify | `src/app/account/page.jsx` | Streak section + use shield button (reads from CheckinContext) |
| Modify | `src/App.jsx` | Listen for checkin-claimed event; render CheckinModal via context |
| Migration | Supabase SQL editor | Add 5 columns to `progress` table |

---

## Task 1: Supabase Migration

**Files:**
- No local file — run in Supabase dashboard SQL editor

- [ ] **Step 1: Run the migration SQL**

Open the Supabase dashboard → SQL editor and run:

```sql
ALTER TABLE progress
  ADD COLUMN IF NOT EXISTS streak            INT4  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_streak_date  DATE,
  ADD COLUMN IF NOT EXISTS shields_available INT2  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_checkin_date DATE,
  ADD COLUMN IF NOT EXISTS longest_streak    INT4  NOT NULL DEFAULT 0;
```

- [ ] **Step 2: Verify columns exist**

In the Supabase table editor, confirm the `progress` table now has these five columns. Existing rows will have `streak = 0`, `shields_available = 0`, `longest_streak = 0`, and null dates — this is correct.

- [ ] **Step 3: Commit a migration record**

```bash
mkdir -p docs/migrations
cat > docs/migrations/20260327_add_checkin_streak_fields.sql << 'EOF'
-- Adds daily check-in and streak shield columns to progress table.
ALTER TABLE progress
  ADD COLUMN IF NOT EXISTS streak            INT4  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_streak_date  DATE,
  ADD COLUMN IF NOT EXISTS shields_available INT2  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_checkin_date DATE,
  ADD COLUMN IF NOT EXISTS longest_streak    INT4  NOT NULL DEFAULT 0;
EOF
git add docs/migrations/20260327_add_checkin_streak_fields.sql
git commit -m "chore: track supabase migration for checkin/streak fields"
```

---

## Task 2: Pure Check-in Logic + Tests

**Files:**
- Create: `frontend/src/lib/checkin.js`
- Create: `frontend/src/lib/checkin.test.js`

- [ ] **Step 1: Write the failing tests**

Create `frontend/src/lib/checkin.test.js`:

```js
import { describe, test, expect } from 'vitest';
import {
  todayStr,
  yesterdayStr,
  isoWeek,
  computeNextStreak,
  shouldGrantShield,
  canActivateShield,
  CHECKIN_XP,
  CHECKIN_POKEDOLLARS,
} from './checkin.js';

describe('todayStr / yesterdayStr', () => {
  test('todayStr returns YYYY-MM-DD format', () => {
    expect(todayStr()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  test('yesterdayStr is one day before todayStr', () => {
    const today = new Date(todayStr());
    const yesterday = new Date(yesterdayStr());
    expect(today - yesterday).toBe(86_400_000);
  });
});

describe('isoWeek', () => {
  test('returns a number 1–53', () => {
    const w = isoWeek('2026-03-27');
    expect(w).toBeGreaterThanOrEqual(1);
    expect(w).toBeLessThanOrEqual(53);
  });
  test('different weeks for consecutive Mondays', () => {
    expect(isoWeek('2026-03-23')).not.toBe(isoWeek('2026-03-30'));
  });
  test('same week for Mon and Sun of same ISO week', () => {
    // 2026-03-23 (Mon) and 2026-03-29 (Sun) are the same ISO week
    expect(isoWeek('2026-03-23')).toBe(isoWeek('2026-03-29'));
  });
});

describe('computeNextStreak', () => {
  test('null lastStreakDate → streak resets to 1', () => {
    expect(computeNextStreak(5, null, '2026-03-27')).toEqual({ streak: 1, longest: 5 });
  });
  test('lastStreakDate is today → no change', () => {
    expect(computeNextStreak(5, '2026-03-27', '2026-03-27')).toEqual({ streak: 5, longest: 5 });
  });
  test('lastStreakDate is yesterday → increments', () => {
    expect(computeNextStreak(5, '2026-03-26', '2026-03-27')).toEqual({ streak: 6, longest: 6 });
  });
  test('lastStreakDate is 2 days ago → resets to 1', () => {
    expect(computeNextStreak(5, '2026-03-25', '2026-03-27')).toEqual({ streak: 1, longest: 5 });
  });
  test('increment updates longest when new streak exceeds it', () => {
    expect(computeNextStreak(9, '2026-03-26', '2026-03-27')).toEqual({ streak: 10, longest: 10 });
  });
  test('increment does not lower longest when longestStreak param exceeds new streak', () => {
    // longest was 20, current is 5 incremented to 6 — longest stays 20
    expect(computeNextStreak(5, '2026-03-26', '2026-03-27', 20)).toEqual({ streak: 6, longest: 20 });
  });
});

describe('shouldGrantShield', () => {
  test('null lastCheckinDate → grant shield (first ever check-in)', () => {
    expect(shouldGrantShield(null, '2026-03-27')).toBe(true);
  });
  test('same ISO week → do not grant', () => {
    // 2026-03-23 (Mon) and 2026-03-27 (Fri) are same ISO week
    expect(shouldGrantShield('2026-03-23', '2026-03-27')).toBe(false);
  });
  test('different ISO week → grant', () => {
    // 2026-03-27 (Fri week 13) → 2026-03-30 (Mon week 14)
    expect(shouldGrantShield('2026-03-27', '2026-03-30')).toBe(true);
  });
});

describe('canActivateShield', () => {
  test('no shields → false', () => {
    expect(canActivateShield(0, '2026-03-25', '2026-03-27')).toBe(false);
  });
  test('shield available, lastStreakDate yesterday → streak intact, cannot activate', () => {
    expect(canActivateShield(1, '2026-03-26', '2026-03-27')).toBe(false);
  });
  test('shield available, lastStreakDate today → streak intact, cannot activate', () => {
    expect(canActivateShield(1, '2026-03-27', '2026-03-27')).toBe(false);
  });
  test('shield available, lastStreakDate exactly 2 days ago → can activate', () => {
    expect(canActivateShield(1, '2026-03-25', '2026-03-27')).toBe(true);
  });
  test('shield available, lastStreakDate 3+ days ago → gap too large, cannot activate', () => {
    expect(canActivateShield(1, '2026-03-20', '2026-03-27')).toBe(false);
  });
  test('shield available, null lastStreakDate → cannot activate (no streak to protect)', () => {
    expect(canActivateShield(1, null, '2026-03-27')).toBe(false);
  });
});

describe('constants', () => {
  test('CHECKIN_XP is 25', () => expect(CHECKIN_XP).toBe(25));
  test('CHECKIN_POKEDOLLARS is 10', () => expect(CHECKIN_POKEDOLLARS).toBe(10));
});
```

- [ ] **Step 2: Run tests — expect ALL to fail**

```bash
cd frontend && npm run test -- src/lib/checkin.test.js
```

Expected: failures like `Cannot find module './checkin.js'`.

- [ ] **Step 3: Implement checkin.js**

Create `frontend/src/lib/checkin.js`:

```js
export const CHECKIN_XP = 25;
export const CHECKIN_POKEDOLLARS = 10;

/** Returns today's date as 'YYYY-MM-DD' in local time. */
export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Returns yesterday's date as 'YYYY-MM-DD' in local time. */
export function yesterdayStr() {
  const d = new Date(Date.now() - 86_400_000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Returns the ISO week number (1–53) for a 'YYYY-MM-DD' date string.
 * Uses ISO 8601: weeks start on Monday.
 */
export function isoWeek(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Shift to nearest Thursday; make Sunday = 7
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / 86_400_000 + 1) / 7);
}

/**
 * Computes the new streak and longest_streak after a check-in claim.
 * @param {number} currentStreak
 * @param {string|null} lastStreakDate - 'YYYY-MM-DD' or null
 * @param {string} today - 'YYYY-MM-DD'
 * @param {number} [longestStreak=currentStreak]
 * @returns {{ streak: number, longest: number }}
 */
export function computeNextStreak(currentStreak, lastStreakDate, today, longestStreak = currentStreak) {
  if (lastStreakDate === today) {
    return { streak: currentStreak, longest: longestStreak };
  }
  const d = new Date(today + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  const yStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const newStreak = lastStreakDate === yStr ? currentStreak + 1 : 1;
  return { streak: newStreak, longest: Math.max(longestStreak, newStreak) };
}

/**
 * Returns true if a new weekly shield should be granted on this check-in.
 * @param {string|null} lastCheckinDate - previous last_checkin_date
 * @param {string} today - 'YYYY-MM-DD'
 */
export function shouldGrantShield(lastCheckinDate, today) {
  if (!lastCheckinDate) return true;
  return isoWeek(lastCheckinDate) !== isoWeek(today);
}

/**
 * Returns true if the user can activate a streak shield right now.
 * Requires: ≥1 shield AND last_streak_date is exactly 2 days ago.
 * @param {number} shieldsAvailable
 * @param {string|null} lastStreakDate - 'YYYY-MM-DD' or null
 * @param {string} today - 'YYYY-MM-DD'
 */
export function canActivateShield(shieldsAvailable, lastStreakDate, today) {
  if (shieldsAvailable < 1 || !lastStreakDate) return false;
  const last = new Date(lastStreakDate + 'T00:00:00');
  const now  = new Date(today + 'T00:00:00');
  const diffDays = Math.round((now - last) / 86_400_000);
  return diffDays === 2;
}
```

- [ ] **Step 4: Run tests — expect ALL to pass**

```bash
cd frontend && npm run test -- src/lib/checkin.test.js
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
cd frontend && git add src/lib/checkin.js src/lib/checkin.test.js
git commit -m "feat: add pure check-in/streak/shield logic with tests"
```

---

## Task 3: Extend user-progress.js

**Files:**
- Modify: `frontend/src/lib/user-progress.js`

- [ ] **Step 1: Extend loadUserProgress to return 5 new fields**

The `progress` select already uses `"*"`, so all columns are returned automatically. Only the return object needs updating. Replace the `return` statement in `loadUserProgress`:

```js
return {
  activePokemon,
  totalXp: progress?.total_xp ?? 0,
  pomodorosCompleted: progress?.pomodoros_completed ?? 0,
  pokedollars: progress?.pokedollars ?? 0,
  caughtPokemon: normalizedCaught,
  regionId,
  // Checkin/streak fields
  streak: progress?.streak ?? 0,
  lastStreakDate: progress?.last_streak_date ?? null,
  shieldsAvailable: progress?.shields_available ?? 0,
  lastCheckinDate: progress?.last_checkin_date ?? null,
  longestStreak: progress?.longest_streak ?? 0,
};
```

- [ ] **Step 2: Extend saveUserProgress to accept and write 5 new fields**

Replace the existing `saveUserProgress` function with:

```js
export async function saveUserProgress({
  activePokemon,
  totalXp,
  pomodorosCompleted,
  pokedollars,
  regionId,
  streak,
  lastStreakDate,
  shieldsAvailable,
  lastCheckinDate,
  longestStreak,
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const promises = [];

  if (activePokemon) {
    promises.push(
      supabase.from("profiles").upsert({
        id: user.id,
        starter_key: activePokemon.key,
        starter_pokemon_id: activePokemon.pokemonId,
        starter_label: activePokemon.label,
        starter_sprite: activePokemon.sprite,
        ...(regionId ? { game_region: regionId } : {}),
      })
    );
  }

  const progressRow = {
    id: user.id,
    total_xp: totalXp,
    pomodoros_completed: pomodorosCompleted,
    pokedollars: pokedollars ?? 0,
    updated_at: new Date().toISOString(),
  };

  // Only include checkin/streak fields when explicitly provided
  if (typeof streak === 'number')           progressRow.streak = streak;
  if (lastStreakDate !== undefined)          progressRow.last_streak_date = lastStreakDate;
  if (typeof shieldsAvailable === 'number') progressRow.shields_available = shieldsAvailable;
  if (lastCheckinDate !== undefined)         progressRow.last_checkin_date = lastCheckinDate;
  if (typeof longestStreak === 'number')    progressRow.longest_streak = longestStreak;

  promises.push(supabase.from("progress").upsert(progressRow));
  await Promise.all(promises);
}
```

- [ ] **Step 3: Commit**

```bash
cd frontend && git add src/lib/user-progress.js
git commit -m "feat: extend user-progress to persist checkin/streak/shield fields"
```

---

## Task 4: Create CheckinContext

**Files:**
- Create: `frontend/src/context/checkin-context.jsx`

`CheckinContext` provides global checkin state so both `NavbarComp` (inside `StudyShell`) and `App.jsx` can access it without prop-drilling. On reward claim, it fires a `pomopet:checkin-claimed` custom event — the same event-bus pattern already used for `pomopet:testing-mode` in `App.jsx`.

- [ ] **Step 1: Create the context file**

Create `frontend/src/context/checkin-context.jsx`:

```jsx
"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import {
  todayStr,
  yesterdayStr,
  computeNextStreak,
  shouldGrantShield,
  canActivateShield,
  CHECKIN_XP,
  CHECKIN_POKEDOLLARS,
} from "@/lib/checkin";

const CheckinContext = createContext(null);

export function CheckinProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [streak, setStreak]                 = useState(0);
  const [lastStreakDate, setLastStreakDate]   = useState(null);
  const [shieldsAvailable, setShieldsAvailable] = useState(0);
  const [lastCheckinDate, setLastCheckinDate] = useState(null);
  const [longestStreak, setLongestStreak]   = useState(0);
  const [loaded, setLoaded]                 = useState(false);

  // Load checkin state from Supabase when auth resolves
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // Reset on logout
      setStreak(0);
      setLastStreakDate(null);
      setShieldsAvailable(0);
      setLastCheckinDate(null);
      setLongestStreak(0);
      setLoaded(false);
      return;
    }

    supabase
      .from("progress")
      .select("streak, last_streak_date, shields_available, last_checkin_date, longest_streak")
      .single()
      .then(({ data }) => {
        setStreak(data?.streak ?? 0);
        setLastStreakDate(data?.last_streak_date ?? null);
        setShieldsAvailable(data?.shields_available ?? 0);
        setLastCheckinDate(data?.last_checkin_date ?? null);
        setLongestStreak(data?.longest_streak ?? 0);
        setLoaded(true);
      });
  }, [user, authLoading]);

  // True when the user is logged in, progress is loaded, and today's check-in is unclaimed
  const showCheckinModal = loaded && Boolean(user) && lastCheckinDate !== todayStr();

  const claimCheckin = useCallback(async () => {
    const today = todayStr();
    const { streak: newStreak, longest: newLongest } = computeNextStreak(
      streak, lastStreakDate, today, longestStreak,
    );
    const grantShield = shouldGrantShield(lastCheckinDate, today);
    const newShields  = grantShield ? Math.min(1, shieldsAvailable + 1) : shieldsAvailable;

    // Update local state immediately
    setStreak(newStreak);
    setLastStreakDate(today);
    setShieldsAvailable(newShields);
    setLastCheckinDate(today);
    setLongestStreak(newLongest);

    // Persist to Supabase
    const { data: { user: u } } = await supabase.auth.getUser();
    if (u) {
      await supabase.from("progress").upsert({
        id: u.id,
        streak: newStreak,
        last_streak_date: today,
        shields_available: newShields,
        last_checkin_date: today,
        longest_streak: newLongest,
        updated_at: new Date().toISOString(),
      });
    }

    // Notify App.jsx to apply XP + Pokedollar rewards via event bus
    window.dispatchEvent(
      new CustomEvent("pomopet:checkin-claimed", {
        detail: { xp: CHECKIN_XP, pokedollars: CHECKIN_POKEDOLLARS },
      })
    );
  }, [streak, lastStreakDate, shieldsAvailable, lastCheckinDate, longestStreak]);

  const activateShield = useCallback(async () => {
    const today = todayStr();
    if (!canActivateShield(shieldsAvailable, lastStreakDate, today)) return;

    const yesterday  = yesterdayStr();
    const newShields = shieldsAvailable - 1;

    setShieldsAvailable(newShields);
    setLastStreakDate(yesterday);

    const { data: { user: u } } = await supabase.auth.getUser();
    if (u) {
      await supabase.from("progress").upsert({
        id: u.id,
        shields_available: newShields,
        last_streak_date: yesterday,
        updated_at: new Date().toISOString(),
      });
    }
  }, [shieldsAvailable, lastStreakDate]);

  const value = {
    streak,
    longestStreak,
    shieldsAvailable,
    lastStreakDate,
    showCheckinModal,
    claimCheckin,
    activateShield,
    canUseShield: canActivateShield(shieldsAvailable, lastStreakDate, todayStr()),
  };

  return (
    <CheckinContext.Provider value={value}>
      {children}
    </CheckinContext.Provider>
  );
}

/** Hook to consume checkin state anywhere in the tree. */
export function useCheckin() {
  const ctx = useContext(CheckinContext);
  if (!ctx) throw new Error("useCheckin must be used inside CheckinProvider");
  return ctx;
}
```

- [ ] **Step 2: Add CheckinProvider to Providers**

In `frontend/src/components/providers.jsx`, import and wrap with `CheckinProvider`:

```jsx
"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AuthProvider } from "@/context/auth-context";
import { CheckinProvider } from "@/context/checkin-context";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#fdf6ee",
      100: "#f9e8d0",
      200: "#f3d0a0",
      300: "#ecb56a",
      400: "#e59a3f",
      500: "#c97c28",
      600: "#a6601e",
      700: "#834918",
      800: "#623613",
      900: "#42240d",
    },
  },
  styles: {
    global: {
      "html, body": {
        bg: "transparent",
      },
    },
  },
});

export default function Providers({ children }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <CheckinProvider>
          {children}
        </CheckinProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd frontend && git add src/context/checkin-context.jsx src/components/providers.jsx
git commit -m "feat: add CheckinContext for global streak/shield state"
```

---

## Task 5: Remove Streak from useSessionState

**Files:**
- Modify: `frontend/src/hooks/use-session-state.js`

`useSessionState` still tracks local `streak` for within-session XP multipliers. We remove it from localStorage persistence and accept the Supabase-loaded initial value instead.

- [ ] **Step 1: Change function signature to accept initialStreak**

```js
// Change:
export function useSessionState() {
// To:
export function useSessionState({ initialStreak = 0 } = {}) {
```

- [ ] **Step 2: Update streak + lastStreakDate initialization**

Change (around line 44):

```js
// FROM:
const [streak,         setStreak]         = useState(() => saved().streak         ?? 0);
const [lastStreakDate, setLastStreakDate]  = useState(() => saved().lastStreakDate ?? null);

// TO:
const [streak,         setStreak]         = useState(initialStreak);
const [lastStreakDate, setLastStreakDate]  = useState(null);
```

- [ ] **Step 3: Remove streak and lastStreakDate from saveSessionData**

Remove both fields from the `saveSessionData` call and its `useEffect` dependency array:

```js
// Change the saveSessionData useEffect to:
useEffect(() => {
  saveSessionData({
    tasks,
    pomodorosStarted,
    tasksCompleted,
    availableTaskClaims,
    lastSessionQuality,
    dailyXpEarned,
    dailyXpDate,
    // streak and lastStreakDate removed — now owned by CheckinContext/Supabase
  });
}, [tasks, pomodorosStarted, tasksCompleted, availableTaskClaims,
    lastSessionQuality, dailyXpEarned, dailyXpDate]);
```

- [ ] **Step 4: Run all tests**

```bash
cd frontend && npm run test
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
cd frontend && git add src/hooks/use-session-state.js
git commit -m "refactor: migrate streak out of localStorage — initialized from Supabase via initialStreak prop"
```

---

## Task 6: Create CheckinModal Component

**Files:**
- Create: `frontend/src/components/checkin-modal.jsx`

- [ ] **Step 1: Create the component**

Create `frontend/src/components/checkin-modal.jsx`:

```jsx
"use client";

import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CHECKIN_XP, CHECKIN_POKEDOLLARS } from "@/lib/checkin";

function milestoneMessage(streak) {
  if (streak === 30) return "30-day streak! You're a true Pokémon Master.";
  if (streak === 14) return "Two weeks strong! Keep training!";
  if (streak === 7)  return "One week streak! You're on fire!";
  return null;
}

export function CheckinModal({ streak, onClaim }) {
  const milestone = milestoneMessage(streak);

  return (
    <Dialog open>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flame size={20} className="text-orange-500" aria-hidden="true" />
            Daily Check-in
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2 pt-1">
              {streak > 0 && (
                <p className="font-pixel-body text-[18px]">
                  🔥 {streak}-day streak!
                </p>
              )}
              {milestone && (
                <p className="font-pixel-body text-[16px] text-[var(--poke-blue)]">
                  {milestone}
                </p>
              )}
              <p className="font-pixel-body text-[18px]">
                Today's reward: <strong>+{CHECKIN_XP} XP</strong> and{" "}
                <strong>+{CHECKIN_POKEDOLLARS} Pokédollars</strong>
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClaim}>Claim</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd frontend && git add src/components/checkin-modal.jsx
git commit -m "feat: add CheckinModal component"
```

---

## Task 7: Update Navbar with Streak Counter + Shield Badge

**Files:**
- Modify: `frontend/src/components/navbar.jsx`

`NavbarComp` reads from `useCheckin()` — no props needed since `CheckinProvider` wraps the whole app.

- [ ] **Step 1: Add imports**

At the top of `navbar.jsx`, add `Flame` to the existing lucide import:

```jsx
import {
  Archive,
  Flame,    // add this
  Home,
  LogIn,
  LogOut,
  Menu,
  Moon,
  ShoppingBag,
  Sun,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
```

Add the checkin hook and Button imports:

```jsx
import { useCheckin } from "@/context/checkin-context";
import { Button } from "@/components/ui/button";
```

- [ ] **Step 2: Consume checkin context**

Inside `NavbarComp`, after the existing hooks, add:

```jsx
const { streak, shieldsAvailable, canUseShield, activateShield } = useCheckin();
const [showShieldPopover, setShowShieldPopover] = useState(false);
```

- [ ] **Step 3: Add streak display to the navbar top bar**

In the top `<nav>` JSX, inside `<div className="pokemon-nav-links">` and before the dark/light toggle button, add:

```jsx
{/* Streak counter — only shown for authenticated users with an active streak */}
{user && streak > 0 && (
  <div style={{ position: "relative" }}>
    <div
      className="pokemon-nav-link"
      style={{
        background: "rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.3)",
        padding: "4px 8px",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        color: "var(--text-light)",
      }}
      aria-label={`${streak}-day streak`}
    >
      <Flame size={14} aria-hidden="true" style={{ color: "#f97316" }} />
      <span className="font-pixel text-[9px]">{streak}</span>

      {shieldsAvailable > 0 && (
        <button
          onClick={() => setShowShieldPopover((v) => !v)}
          aria-label="Use streak shield"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            paddingLeft: "4px",
            color: "var(--text-light)",
            display: "flex",
            alignItems: "center",
          }}
        >
          🛡️
        </button>
      )}
    </div>

    {showShieldPopover && (
      <div
        style={{
          position: "absolute",
          top: "110%",
          right: 0,
          background: "var(--window-bg)",
          border: "2px solid var(--window-border)",
          padding: "10px 12px",
          zIndex: 100,
          minWidth: "220px",
          boxShadow: "2px 2px 0 var(--window-shadow)",
        }}
      >
        <p className="font-pixel-body text-[16px] text-[var(--text-dark)] mb-3">
          {canUseShield
            ? "Use your streak shield? This protects your streak for one missed day."
            : "Shield can only be used after missing exactly one day."}
        </p>
        <div className="flex gap-2">
          {canUseShield && (
            <Button
              size="sm"
              onClick={() => {
                activateShield();
                setShowShieldPopover(false);
              }}
            >
              Use Shield
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowShieldPopover(false)}
          >
            {canUseShield ? "Cancel" : "Close"}
          </Button>
        </div>
      </div>
    )}
  </div>
)}
```

- [ ] **Step 4: Commit**

```bash
cd frontend && git add src/components/navbar.jsx
git commit -m "feat: add streak counter and shield badge to navbar"
```

---

## Task 8: Update Account Page with Streak Section

**Files:**
- Modify: `frontend/src/app/account/page.jsx`

- [ ] **Step 1: Add imports**

At the top of `account/page.jsx`, add:

```jsx
import { useCheckin } from "@/context/checkin-context";
import { canActivateShield, todayStr } from "@/lib/checkin";
```

- [ ] **Step 2: Consume checkin context**

Inside `AccountPage`, after the existing hooks, add:

```jsx
const {
  streak,
  longestStreak,
  shieldsAvailable,
  lastStreakDate,
  activateShield,
} = useCheckin();

const shieldEligible = canActivateShield(shieldsAvailable, lastStreakDate, todayStr());
```

- [ ] **Step 3: Add Streak card to the JSX**

Insert this card after the Party card (before the Danger Zone card):

```jsx
{/* Streak — logged-in only */}
{user && (
  <Card>
    <CardHeader>
      <CardTitle>Streak</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex gap-6">
        <div>
          <p className="font-pixel-body text-[16px] text-[var(--text-muted)]">Current</p>
          <p className="font-pixel-body text-[22px]" style={{ color: "var(--poke-blue)" }}>
            🔥 {streak} day{streak !== 1 ? "s" : ""}
          </p>
        </div>
        <div>
          <p className="font-pixel-body text-[16px] text-[var(--text-muted)]">Best</p>
          <p className="font-pixel-body text-[22px]" style={{ color: "var(--poke-blue)" }}>
            {longestStreak} day{longestStreak !== 1 ? "s" : ""}
          </p>
        </div>
        <div>
          <p className="font-pixel-body text-[16px] text-[var(--text-muted)]">Shields</p>
          <p className="font-pixel-body text-[22px]">
            {shieldsAvailable > 0 ? "🛡️" : "—"}
          </p>
        </div>
      </div>
      {shieldsAvailable > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <p className="font-pixel-body text-[18px] text-[var(--text-muted)]">
              A streak shield lets you protect your streak for one missed day.
              Activate it before a day you plan to miss.
            </p>
            <Button
              variant="outline"
              onClick={activateShield}
              disabled={!shieldEligible}
            >
              Use Shield
            </Button>
            {!shieldEligible && (
              <p className="font-pixel-body text-[16px] text-[var(--text-muted)]">
                Shield can only be used after missing exactly one day.
              </p>
            )}
          </div>
        </>
      )}
    </CardContent>
  </Card>
)}
```

- [ ] **Step 4: Commit**

```bash
cd frontend && git add src/app/account/page.jsx
git commit -m "feat: add streak section with shield activation to account page"
```

---

## Task 9: Wire CheckinModal into App.jsx

**Files:**
- Modify: `frontend/src/App.jsx`

This task wires the checkin event listener (for XP/Pokedollar rewards), passes `initialStreak` to `useSessionState`, and renders `CheckinModal`.

- [ ] **Step 1: Add imports**

```jsx
import { useCheckin } from "@/context/checkin-context";
import { CheckinModal } from "@/components/checkin-modal";
```

- [ ] **Step 2: Consume checkin context**

Inside `App()`, after the existing hooks, add:

```jsx
const { streak: checkinStreak, showCheckinModal, claimCheckin } = useCheckin();
```

- [ ] **Step 3: Pass initialStreak to useSessionState**

Change:

```jsx
} = useSessionState();
```

To:

```jsx
} = useSessionState({ initialStreak: checkinStreak });
```

- [ ] **Step 4: Listen for pomopet:checkin-claimed event**

Add this `useEffect` alongside the existing `pomopet:testing-mode` event listener:

```jsx
useEffect(() => {
  const onCheckinClaimed = (e) => {
    const { xp = 0, pokedollars: pd = 0 } = e.detail ?? {};
    if (xp)  setTotalXp((prev) => prev + xp);
    if (pd)  setPokedollars((prev) => prev + pd);
  };

  window.addEventListener("pomopet:checkin-claimed", onCheckinClaimed);
  return () => window.removeEventListener("pomopet:checkin-claimed", onCheckinClaimed);
}, []);
```

- [ ] **Step 5: Render CheckinModal in JSX**

In the JSX return, alongside `WildEncounterModal`, add:

```jsx
{showCheckinModal && (
  <CheckinModal
    streak={checkinStreak}
    onClaim={claimCheckin}
  />
)}
```

- [ ] **Step 6: Run all tests**

```bash
cd frontend && npm run test
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
cd frontend && git add src/App.jsx
git commit -m "feat: wire check-in modal and reward event into App"
```

---

## Task 10: Manual Smoke Test

- [ ] **Step 1: Start the dev server**

```bash
cd frontend && npm run dev
```

- [ ] **Step 2: Log in and verify check-in modal appears**

Open `http://localhost:3000`, log in with a test account. The check-in modal should appear immediately after progress loads. Click "Claim" — verify:
- Modal closes
- XP and Pokédollars increase in the UI
- Refreshing the page does NOT show the modal again

- [ ] **Step 3: Verify streak counter in navbar**

After claiming, the navbar should show a 🔥 flame icon with the streak number.

- [ ] **Step 4: Verify streak section on account page**

Navigate to `/account`. Confirm the Streak card shows current streak, best streak, and shield count.

- [ ] **Step 5: Verify shield grant on new week**

Manually set `last_checkin_date` in Supabase to a date in the previous ISO week, then reload and claim — the shield count should increase to 1.

- [ ] **Step 6: Commit any smoke-test fixes**

```bash
cd frontend && git add -p && git commit -m "fix: smoke test corrections for daily check-in feature"
```
