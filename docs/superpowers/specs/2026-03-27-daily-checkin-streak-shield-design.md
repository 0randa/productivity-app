# Daily Check-in + Streak Shield — Design Spec

**Date:** 2026-03-27
**Status:** Approved
**Goal:** Increase D1/D7 retention and streak continuation rate by adding a daily check-in reward and a proactive streak shield mechanic.

---

## Overview

On the first app load of each day, authenticated users see a check-in modal that awards a small XP + Pokedollars bonus. Streak state is persisted to Supabase so it survives device switching and browser clears. Users receive one streak shield per week, which they can activate proactively to protect their streak for a day they know they'll miss.

---

## Data Model

Four new columns added to the existing `progress` table via migration (no new tables):

| Column | Type | Default | Description |
|---|---|---|---|
| `streak` | `int4` | 0 | Current consecutive-day streak |
| `last_streak_date` | `date` | null | Last date a streak-eligible check-in occurred |
| `shields_available` | `int2` | 0 | Usable shields (0 or 1, max 1) |
| `last_checkin_date` | `date` | null | Last date the daily check-in was claimed |
| `longest_streak` | `int4` | 0 | All-time longest streak (for account page display) |

`loadUserProgress` and `saveUserProgress` in `src/lib/user-progress.js` are extended to read and write all five fields. Streak state is removed from localStorage (`session-storage.js`) — `use-session-state.js` reads streak from the loaded Supabase progress on mount.

---

## Check-in Logic

Owned by a new `useCheckin` hook (`src/hooks/use-checkin.js`). Runs once after `loadUserProgress` resolves.

### Daily check-in
- If `last_checkin_date !== today` → show check-in modal.
- On claim: award **+25 XP** and **+10 Pokedollars**, set `last_checkin_date = today`, save to Supabase.
- If already claimed today → do nothing (no modal).

### Streak update (on claim)
| Condition | Outcome |
|---|---|
| `last_streak_date === yesterday` | `streak += 1` |
| `last_streak_date === today` | no change |
| anything older (or null) | `streak = 1` (restart) |

`longest_streak` is updated to `max(longest_streak, streak)` on every increment.

### Weekly shield grant
On each check-in claim, compare the ISO week number of today vs. the ISO week number of the previous `last_checkin_date`. If they differ (new week), grant 1 shield: `shields_available = min(1, shields_available + 1)`. This gives one shield on the first check-in of each new week.

### Shield activation
- User explicitly taps "Use Shield" (navbar or account page).
- Preconditions: `shields_available >= 1` AND `last_streak_date` is exactly 2+ days ago (streak would be broken, but not already lost by more than 1 extra day).
- Effect: `shields_available -= 1`, `last_streak_date = yesterday`, save to Supabase.
- The following day's check-in sees `yesterday` and increments the streak normally.
- Shield cannot be activated if streak is already intact (last_streak_date is today or yesterday) or if the gap is more than 1 missed day.

---

## UI Components

### `src/components/checkin-modal.jsx` (new)
- Renders on app load when check-in is unclaimed.
- Not dismissible except via "Claim" button (prevents accidental skips without claiming).
- Displays: streak count, reward summary (+25 XP, +10 Pokedollars).
- Shows milestone message at streaks 7, 14, 30 days.
- Mounted at `App.jsx` level, same pattern as `WildEncounterModal`.

### `src/components/navbar.jsx` (extend)
- Add streak counter: flame icon + streak number.
- If `shields_available >= 1`, show shield badge alongside the counter.
- Shield badge is tappable → confirmation popover: "Use your streak shield? This protects your streak for one missed day." Confirm / Cancel.

### `src/app/account/page.jsx` (extend)
- New "Streak" section: current streak, longest streak, shield inventory.
- "Use Shield" button mirrors navbar action.

---

## Integration Points

| File | Change |
|---|---|
| `src/lib/user-progress.js` | Add 5 new fields to `loadUserProgress` / `saveUserProgress` |
| `src/hooks/use-session-state.js` | Remove local streak/lastStreakDate state; read from loaded progress |
| `src/hooks/use-checkin.js` | New hook — owns check-in + shield activation logic |
| `src/App.jsx` | Call `useCheckin`, render `CheckinModal` |
| `src/components/checkin-modal.jsx` | New component |
| `src/components/navbar.jsx` | Add streak counter + shield badge |
| `src/app/account/page.jsx` | Add streak section + use shield button |
| Supabase migration | Add 5 columns to `progress` table |

---

## Reward Values

| Event | XP | Pokedollars |
|---|---|---|
| Daily check-in | +25 | +10 |

These are intentionally modest — the check-in is a habit anchor, not the primary XP source.

---

## Out of Scope (Phase 1)

- Analytics event logging (`checkin_claimed`, `streak_extended`) — can be added in Phase 2.
- Escalating rewards by streak length.
- Multiple shields or shield inventory UI beyond a single counter.
- Guest/unauthenticated user support for check-in state.
