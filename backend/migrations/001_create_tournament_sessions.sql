CREATE TABLE IF NOT EXISTS tournament_sessions (
  id TEXT PRIMARY KEY,
  share_code TEXT UNIQUE NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  snapshot JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS tournament_sessions_share_code_idx
ON tournament_sessions (share_code);

CREATE INDEX IF NOT EXISTS tournament_sessions_updated_at_idx
ON tournament_sessions (updated_at DESC);
