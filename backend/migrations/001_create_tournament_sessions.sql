CREATE TABLE IF NOT EXISTS tournament_sessions (
  id TEXT PRIMARY KEY,
  share_code TEXT UNIQUE NOT NULL,
  edit_token TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_ip TEXT,
  snapshot JSONB NOT NULL
);

ALTER TABLE tournament_sessions
  ADD COLUMN IF NOT EXISTS edit_token TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS last_ip TEXT;

CREATE INDEX IF NOT EXISTS tournament_sessions_share_code_idx
ON tournament_sessions (share_code);

CREATE INDEX IF NOT EXISTS tournament_sessions_updated_at_idx
ON tournament_sessions (updated_at DESC);
