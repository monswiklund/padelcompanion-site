import "./loadEnv.js";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Pool } from "pg";

const poolConfig =
  process.env.PGHOST &&
  process.env.PGUSER &&
  process.env.PGPASSWORD &&
  process.env.PGDATABASE
    ? {
        host: process.env.PGHOST,
        port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        ssl:
          process.env.PGSSLMODE === "require"
            ? { rejectUnauthorized: false }
            : undefined,
      }
    : process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl:
            process.env.PGSSLMODE === "require"
              ? { rejectUnauthorized: false }
              : undefined,
        }
      : null;

if (!poolConfig) {
  console.error("PostgreSQL env vars are required to run migrations");
  process.exit(1);
}

const migrationPath = resolve(
  process.cwd(),
  "backend/migrations/001_create_tournament_sessions.sql",
);

const pool = new Pool(poolConfig);

try {
  const sql = await readFile(migrationPath, "utf8");
  await pool.query(sql);
  console.log("Migration applied:", migrationPath);
} finally {
  await pool.end();
}
