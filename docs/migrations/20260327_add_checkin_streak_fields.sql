-- Adds daily check-in and streak shield columns to progress table.
ALTER TABLE progress
  ADD COLUMN IF NOT EXISTS streak            INT4  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_streak_date  DATE,
  ADD COLUMN IF NOT EXISTS shields_available INT2  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_checkin_date DATE,
  ADD COLUMN IF NOT EXISTS longest_streak    INT4  NOT NULL DEFAULT 0;
