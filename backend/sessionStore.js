import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { Pool } from "pg";

const DEFAULT_STORE_PATH = resolve(process.cwd(), "backend/data/sessions.json");

function randomCode(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "";
  for (let i = 0; i < length; i++) {
    value += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return value;
}

function createSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function createEditToken() {
  return `${Math.random().toString(36).slice(2)}${Math.random()
    .toString(36)
    .slice(2)}${Date.now().toString(36)}`;
}

function notFoundError() {
  const error = new Error("Tournament session not found");
  error.statusCode = 404;
  return error;
}

function forbiddenError() {
  const error = new Error("Invalid edit token");
  error.statusCode = 403;
  return error;
}

function getDatabaseUrl() {
  const value = process.env.DATABASE_URL;
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getPgConfigFromEnv() {
  const host = process.env.PGHOST;
  const user = process.env.PGUSER;
  const password = process.env.PGPASSWORD;
  const database = process.env.PGDATABASE;
  const port = process.env.PGPORT ? Number(process.env.PGPORT) : 5432;

  if (host && user && password && database) {
    return {
      host,
      user,
      password,
      database,
      port,
      ssl:
        process.env.PGSSLMODE === "require"
          ? { rejectUnauthorized: false }
          : undefined,
    };
  }

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) return null;

  return {
    connectionString: databaseUrl,
    ssl:
      process.env.PGSSLMODE === "require"
        ? { rejectUnauthorized: false }
        : undefined,
  };
}

async function ensureStoreFile(storePath) {
  await mkdir(dirname(storePath), { recursive: true });
  try {
    await readFile(storePath, "utf8");
  } catch {
    await writeFile(storePath, JSON.stringify({}, null, 2));
  }
}

async function readSessions(storePath = DEFAULT_STORE_PATH) {
  await ensureStoreFile(storePath);
  const raw = await readFile(storePath, "utf8");
  return JSON.parse(raw);
}

async function writeSessions(sessions, storePath = DEFAULT_STORE_PATH) {
  await ensureStoreFile(storePath);
  await writeFile(storePath, JSON.stringify(sessions, null, 2));
}

function findByShareCode(sessions, shareCode) {
  return Object.values(sessions).find((session) => session.shareCode === shareCode);
}

function createPgStore(databaseUrl) {
  const pool = new Pool(
    typeof databaseUrl === "string"
      ? {
          connectionString: databaseUrl,
          ssl:
            process.env.PGSSLMODE === "require"
              ? { rejectUnauthorized: false }
              : undefined,
        }
      : databaseUrl,
  );

  let initialized = false;

  async function ensureSchema() {
    if (initialized) return;
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tournament_sessions (
        id TEXT PRIMARY KEY,
        share_code TEXT UNIQUE NOT NULL,
        edit_token TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        snapshot JSONB NOT NULL
      );
      ALTER TABLE tournament_sessions
      ADD COLUMN IF NOT EXISTS edit_token TEXT;
      UPDATE tournament_sessions
      SET edit_token = md5(random()::text || clock_timestamp()::text)
      WHERE edit_token IS NULL;
      ALTER TABLE tournament_sessions
      ALTER COLUMN edit_token SET NOT NULL;
      CREATE INDEX IF NOT EXISTS tournament_sessions_share_code_idx
      ON tournament_sessions (share_code);
    `);
    initialized = true;
  }

  async function createSession(snapshot) {
    await ensureSchema();

    let shareCode = randomCode();
    while (true) {
      const { rowCount } = await pool.query(
        "SELECT 1 FROM tournament_sessions WHERE share_code = $1",
        [shareCode],
      );
      if (!rowCount) break;
      shareCode = randomCode();
    }

    const response = {
      id: createSessionId(),
      shareCode,
      editToken: createEditToken(),
      updatedAt: new Date().toISOString(),
      snapshot,
    };

    await pool.query(
      `
        INSERT INTO tournament_sessions (id, share_code, edit_token, updated_at, snapshot)
        VALUES ($1, $2, $3, $4, $5::jsonb)
      `,
      [
        response.id,
        response.shareCode,
        response.editToken,
        response.updatedAt,
        JSON.stringify(response.snapshot),
      ],
    );

    return response;
  }

  async function updateSession(sessionId, snapshot, editToken) {
    await ensureSchema();
    const updatedAt = new Date().toISOString();
    const result = await pool.query(
      `
        UPDATE tournament_sessions
        SET snapshot = $2::jsonb, updated_at = $3
        WHERE id = $1 AND edit_token = $4
        RETURNING id, share_code, edit_token, updated_at, snapshot
      `,
      [sessionId, JSON.stringify(snapshot), updatedAt, editToken],
    );

    if (!result.rowCount) {
      const exists = await pool.query(
        "SELECT 1 FROM tournament_sessions WHERE id = $1",
        [sessionId],
      );
      throw exists.rowCount ? forbiddenError() : notFoundError();
    }

    return mapRow(result.rows[0]);
  }

  async function getSessionByShareCode(shareCode) {
    await ensureSchema();
    const result = await pool.query(
      `
        SELECT id, share_code, edit_token, updated_at, snapshot
        FROM tournament_sessions
        WHERE share_code = $1
      `,
      [shareCode],
    );

    if (!result.rowCount) {
      throw notFoundError();
    }

    return mapRow(result.rows[0]);
  }

  async function listSessions() {
    await ensureSchema();
    const result = await pool.query(
      `
        SELECT id, share_code, edit_token, updated_at, snapshot
        FROM tournament_sessions
        ORDER BY updated_at DESC
      `,
    );

    return result.rows.map(mapRow);
  }

  async function close() {
    await pool.end();
  }

  function mapRow(row) {
    return {
      id: row.id,
      shareCode: row.share_code,
      editToken: row.edit_token,
      updatedAt:
        row.updated_at instanceof Date
          ? row.updated_at.toISOString()
          : new Date(row.updated_at).toISOString(),
      snapshot: row.snapshot,
    };
  }

  return {
    mode: "postgres",
    ensureSchema,
    createSession,
    updateSession,
    getSessionByShareCode,
    listSessions,
    close,
  };
}

function createFileStore(storePath = DEFAULT_STORE_PATH) {
  async function createSession(snapshot) {
    const sessions = await readSessions(storePath);

    let shareCode = randomCode();
    while (findByShareCode(sessions, shareCode)) {
      shareCode = randomCode();
    }

    const response = {
      id: createSessionId(),
      shareCode,
      editToken: createEditToken(),
      updatedAt: new Date().toISOString(),
      snapshot,
    };

    sessions[response.id] = response;
    await writeSessions(sessions, storePath);
    return response;
  }

  async function updateSession(sessionId, snapshot, editToken) {
    const sessions = await readSessions(storePath);
    const existing = sessions[sessionId];

    if (!existing) {
      throw notFoundError();
    }
    if (existing.editToken !== editToken) {
      throw forbiddenError();
    }

    const response = {
      ...existing,
      updatedAt: new Date().toISOString(),
      snapshot,
    };

    sessions[sessionId] = response;
    await writeSessions(sessions, storePath);
    return response;
  }

  async function getSessionByShareCode(shareCode) {
    const sessions = await readSessions(storePath);
    const session = findByShareCode(sessions, shareCode);

    if (!session) {
      throw notFoundError();
    }

    return session;
  }

  async function listSessions() {
    return Object.values(await readSessions(storePath));
  }

  async function ensureSchema() {
    await ensureStoreFile(storePath);
  }

  async function close() {}

  return {
    mode: "file",
    ensureSchema,
    createSession,
    updateSession,
    getSessionByShareCode,
    listSessions,
    close,
  };
}

let defaultStore;

export function getSessionStore() {
  if (defaultStore) return defaultStore;

  const pgConfig = getPgConfigFromEnv();
  defaultStore = pgConfig ? createPgStore(pgConfig) : createFileStore();
  return defaultStore;
}

export function createSessionStore(options = {}) {
  if (options.databaseUrl) {
    return createPgStore(options.databaseUrl);
  }
  if (options.pgConfig) {
    return createPgStore(options.pgConfig);
  }
  if (options.storePath) {
    return createFileStore(options.storePath);
  }
  return getSessionStore();
}

export async function createSession(snapshot, storeOrPath) {
  if (typeof storeOrPath === "string") {
    return createFileStore(storeOrPath).createSession(snapshot);
  }
  return (storeOrPath || getSessionStore()).createSession(snapshot);
}

export async function updateSession(sessionId, snapshot, storeOrPath, editToken) {
  if (typeof storeOrPath === "string") {
    return createFileStore(storeOrPath).updateSession(sessionId, snapshot, editToken);
  }
  return (storeOrPath || getSessionStore()).updateSession(sessionId, snapshot, editToken);
}

export async function getSessionByShareCode(shareCode, storeOrPath) {
  if (typeof storeOrPath === "string") {
    return createFileStore(storeOrPath).getSessionByShareCode(shareCode);
  }
  return (storeOrPath || getSessionStore()).getSessionByShareCode(shareCode);
}

export async function listSessions(storeOrPath) {
  if (typeof storeOrPath === "string") {
    return createFileStore(storeOrPath).listSessions();
  }
  return (storeOrPath || getSessionStore()).listSessions();
}
