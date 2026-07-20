import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import type { Server } from 'node:http';

let server: Server;
let tempDir: string;
const PORT = 8990;
const BASE_URL = `http://localhost:${PORT}`;

beforeAll(async () => {
	tempDir = await mkdtemp(join(tmpdir(), 'padel-api-test-ts-'));
	const storePath = join(tempDir, 'sessions.json');

	// Inherited PGHOST must not disable file storage unless postgres is explicit.
	process.env.PGHOST = 'vad_hander_db';
	process.env.PGUSER = '';
	process.env.DATABASE_URL = '';
	process.env.SESSION_STORE = '';
	process.env.STORE_PATH = storePath;
	process.env.NODE_ENV = 'test';

	const mod = await import('./index.ts');
	server = mod.server;

	return new Promise((resolve) => {
		server.listen(PORT, resolve);
	});
});

afterAll(async () => {
	if (tempDir) await rm(tempDir, { recursive: true, force: true });
	return new Promise((resolve) => {
		server.close(resolve);
	});
});

describe('API Integration (TS)', () => {
	it('GET /api/health should return 200', async () => {
		const res = await fetch(`${BASE_URL}/api/health`);
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data.status).toBe('ok');
	});

	it('POST /api/tournament-sessions should create a session', async () => {
		const snapshot = {
			format: 'americano',
			players: [{ id: '1', name: 'Player 1' }]
		};

		const res = await fetch(`${BASE_URL}/api/tournament-sessions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(snapshot)
		});

		const data = await res.json();
		expect(res.status).toBe(201);
		expect(data.shareCode).toBeDefined();
		expect(data.shareCode).toMatch(/^[0-9A-F]{8}$/);
		expect(data.editToken).toBeDefined();
		expect(data.snapshot.format).toBe('americano');
	});

	it('POST /api/tournament-sessions accepts v2 frontend snapshots', async () => {
		const snapshot = {
			snapshotSchemaVersion: 2,
			exportedAt: new Date().toISOString(),
			metadata: {
				name: 'Live session',
				format: 'americano',
				playerCount: 1,
				currentRound: 0,
				status: 'draft'
			},
			state: {
				format: 'americano',
				players: [{ id: '1', name: 'Player 1' }]
			}
		};

		const res = await fetch(`${BASE_URL}/api/tournament-sessions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ snapshot })
		});

		const data = await res.json();
		expect(res.status).toBe(201);
		expect(data.snapshot.snapshotSchemaVersion).toBe(2);
		expect(data.snapshot.state.format).toBe('americano');
	});

	it('POST /api/tournament-sessions rejects unknown formats', async () => {
		const res = await fetch(`${BASE_URL}/api/tournament-sessions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ format: 'Test', players: [] })
		});

		const data = await res.json();
		expect(res.status).toBe(400);
		expect(data.error).toBe('Invalid tournament snapshot');
	});

	it('GET /api/tournament-sessions/:code should return public session', async () => {
		// Create one first
		const createRes = await fetch(`${BASE_URL}/api/tournament-sessions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ format: 'mexicano', players: [] })
		});
		const created = await createRes.json();

		const res = await fetch(
			`${BASE_URL}/api/tournament-sessions/${created.shareCode.toLowerCase()}`
		);
		const data = await res.json();

		expect(res.status).toBe(200);
		expect(data.shareCode).toBe(created.shareCode);
		expect(data.editToken).toBeUndefined(); // Security: hidden
	});

	it('PUT /api/tournament-sessions/:id/snapshot should update session', async () => {
		const createRes = await fetch(`${BASE_URL}/api/tournament-sessions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ format: 'americano', players: [] })
		});
		const created = await createRes.json();

		const updateRes = await fetch(`${BASE_URL}/api/tournament-sessions/${created.id}/snapshot`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${created.editToken}`
			},
			body: JSON.stringify({ format: 'division', players: [] })
		});

		const updated = await updateRes.json();
		expect(updateRes.status).toBe(200);
		expect(updated.snapshot.format).toBe('division');
	});

	it('PUT /api/tournament-sessions/:id/snapshot accepts X-Session-Token and v2 snapshots', async () => {
		const createRes = await fetch(`${BASE_URL}/api/tournament-sessions`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ format: 'americano', players: [] })
		});
		const created = await createRes.json();

		const snapshot = {
			snapshotSchemaVersion: 2,
			exportedAt: new Date().toISOString(),
			metadata: {
				name: 'Division live',
				format: 'division',
				playerCount: 0,
				currentRound: 0,
				status: 'draft'
			},
			state: {
				format: 'division',
				players: []
			}
		};

		const updateRes = await fetch(`${BASE_URL}/api/tournament-sessions/${created.id}/snapshot`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'X-Session-Token': created.editToken
			},
			body: JSON.stringify({ snapshot })
		});

		const updated = await updateRes.json();
		expect(updateRes.status).toBe(200);
		expect(updated.snapshot.state.format).toBe('division');
	});
});
