import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import crypto from 'node:crypto';
import pg from 'pg';
import type { StoredTournamentSnapshot, TournamentSession } from '../types/tournament.ts';

const { Pool } = pg;

export interface SessionStore {
	saveSession(session: TournamentSession): Promise<void>;
	getSession(id: string): Promise<TournamentSession | null>;
	getSessionByShareCode(code: string): Promise<TournamentSession | null>;
	listSessions(): Promise<TournamentSession[]>;
}

// --- Utils ---
function generateCode(): string {
	return crypto.randomBytes(4).toString('hex').toUpperCase();
}

function generateToken(): string {
	return crypto.randomBytes(16).toString('hex');
}

// --- Postgres Implementation ---
class PostgresStore implements SessionStore {
	private pool: pg.Pool;

	constructor(config: pg.PoolConfig) {
		this.pool = new Pool(config);
	}

	async saveSession(session: TournamentSession): Promise<void> {
		const query = `
      INSERT INTO tournament_sessions (id, share_code, edit_token, snapshot, updated_at, last_ip)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO UPDATE SET
        snapshot = EXCLUDED.snapshot,
        updated_at = EXCLUDED.updated_at,
        last_ip = EXCLUDED.last_ip;
    `;
		await this.pool.query(query, [
			session.id,
			session.shareCode,
			session.editToken,
			JSON.stringify(session.snapshot),
			session.updatedAt,
			session.lastIp
		]);
	}

	async getSession(id: string): Promise<TournamentSession | null> {
		const res = await this.pool.query('SELECT * FROM tournament_sessions WHERE id = $1', [id]);
		if (res.rows.length === 0) return null;
		const row = res.rows[0];
		return {
			id: row.id,
			shareCode: row.share_code,
			editToken: row.edit_token,
			snapshot: row.snapshot,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
			lastIp: row.last_ip
		};
	}

	async getSessionByShareCode(code: string): Promise<TournamentSession | null> {
		const res = await this.pool.query(
			'SELECT * FROM tournament_sessions WHERE LOWER(share_code) = LOWER($1)',
			[code]
		);
		if (res.rows.length === 0) return null;
		const row = res.rows[0];
		return {
			id: row.id,
			shareCode: row.share_code,
			editToken: row.edit_token,
			snapshot: row.snapshot,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
			lastIp: row.last_ip
		};
	}

	async listSessions(): Promise<TournamentSession[]> {
		const res = await this.pool.query('SELECT * FROM tournament_sessions ORDER BY updated_at DESC');
		return res.rows.map((row) => ({
			id: row.id,
			shareCode: row.share_code,
			editToken: row.edit_token,
			snapshot: row.snapshot,
			createdAt: row.created_at,
			updatedAt: row.updated_at,
			lastIp: row.last_ip
		}));
	}
}

// --- File Implementation ---
class FileStore implements SessionStore {
	private path: string;
	private data: Record<string, TournamentSession> = {};

	constructor(path?: string) {
		this.path = path || join(process.cwd(), 'backend', 'data', 'sessions.json');
		this.load();
	}

	private load() {
		if (existsSync(this.path)) {
			try {
				const content = readFileSync(this.path, 'utf8').trim();
				this.data = content ? JSON.parse(content) : {};
			} catch (e) {
				console.error('Failed to load sessions file:', e);
				this.data = {};
			}
		}
	}

	private save() {
		const dir = dirname(this.path);
		if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
		writeFileSync(this.path, JSON.stringify(this.data, null, 2));
	}

	async saveSession(session: TournamentSession): Promise<void> {
		this.data[session.id] = session;
		this.save();
	}

	async getSession(id: string): Promise<TournamentSession | null> {
		return this.data[id] || null;
	}

	async getSessionByShareCode(code: string): Promise<TournamentSession | null> {
		const normalizedCode = code.toLowerCase();
		return (
			Object.values(this.data).find((s) => s.shareCode.toLowerCase() === normalizedCode) || null
		);
	}

	async listSessions(): Promise<TournamentSession[]> {
		return Object.values(this.data).sort(
			(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
		);
	}
}

// --- Factory ---
let defaultStore: SessionStore | null = null;

export function getSessionStore(): SessionStore {
	if (defaultStore) return defaultStore;

	const storeMode = getStoreMode();
	const pgConfig = storeMode === 'file' ? null : getPgConfigFromEnv(storeMode === 'postgres');
	const storePath = process.env.STORE_PATH;

	if (pgConfig) {
		defaultStore = new PostgresStore(pgConfig);
	} else if (storeMode === 'postgres') {
		throw new Error('SESSION_STORE=postgres requires DATABASE_URL or PGHOST');
	} else {
		defaultStore = new FileStore(storePath);
	}

	return defaultStore;
}

function getStoreMode(): 'auto' | 'file' | 'postgres' {
	const value = (process.env.SESSION_STORE || process.env.STORE_DRIVER || 'auto').toLowerCase();
	if (value === 'file' || value === 'postgres') return value;
	return 'auto';
}

function getPgConfigFromEnv(allowPgVars: boolean): pg.PoolConfig | null {
	if (process.env.DATABASE_URL) return { connectionString: process.env.DATABASE_URL };
	if (allowPgVars && process.env.PGHOST) {
		return {
			host: process.env.PGHOST,
			user: process.env.PGUSER,
			password: process.env.PGPASSWORD,
			database: process.env.PGDATABASE,
			port: parseInt(process.env.PGPORT || '5432', 10)
		};
	}
	return null;
}

export function createNewSession(snapshot: StoredTournamentSnapshot): TournamentSession {
	const now = new Date().toISOString();
	return {
		id: `session_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
		shareCode: generateCode(),
		editToken: generateToken(),
		snapshot,
		createdAt: now,
		updatedAt: now
	};
}
