import type { IncomingMessage, ServerResponse } from 'node:http';
import { getSessionStore, createNewSession } from '../services/sessionStore.ts';
import {
	TOURNAMENT_FORMATS,
	type Player,
	type StoredTournamentSnapshot,
	type TournamentSnapshot
} from '../types/tournament.ts';

export async function handleCreateSession(
	req: IncomingMessage,
	res: ServerResponse,
	body: unknown
) {
	const snapshot = unwrapSnapshot(body);
	if (!isValidSnapshot(snapshot)) {
		res.statusCode = 400;
		return { error: 'Invalid tournament snapshot' };
	}

	const store = getSessionStore();
	const session = createNewSession(snapshot);
	session.lastIp = req.socket.remoteAddress;

	await store.saveSession(session);

	res.statusCode = 201;
	return session;
}

export async function handleGetSession(code: string) {
	const store = getSessionStore();
	const session = await store.getSessionByShareCode(code);

	if (!session) return null;

	return {
		id: session.id,
		shareCode: session.shareCode,
		snapshot: session.snapshot,
		createdAt: session.createdAt,
		updatedAt: session.updatedAt,
		lastIp: session.lastIp
	};
}

export async function handleUpdateSession(id: string, token: string, body: unknown, ip?: string) {
	const store = getSessionStore();
	const session = await store.getSession(id);
	const snapshot = unwrapSnapshot(body);

	if (!session) return { status: 404, error: 'Session not found' };
	if (session.editToken !== token) return { status: 403, error: 'Invalid edit token' };

	if (!isValidSnapshot(snapshot)) {
		return { status: 400, error: 'Invalid snapshot format' };
	}

	session.snapshot = snapshot;
	session.updatedAt = new Date().toISOString();
	session.lastIp = ip;

	await store.saveSession(session);
	return { status: 200, data: session };
}

function unwrapSnapshot(body: unknown): unknown {
	if (!body || typeof body !== 'object') return body;
	const candidate = body as { snapshot?: unknown };
	return candidate.snapshot ?? body;
}

function isValidSnapshot(s: unknown): s is StoredTournamentSnapshot {
	if (isSnapshotEnvelope(s)) return isValidSnapshotState(s.state);
	return isValidSnapshotState(s);
}

function isSnapshotEnvelope(s: unknown): s is { state: TournamentSnapshot } {
	return !!s && typeof s === 'object' && 'state' in s;
}

function isValidSnapshotState(s: unknown): s is TournamentSnapshot {
	if (!s || typeof s !== 'object') return false;
	const snapshot = s as Partial<TournamentSnapshot>;
	if (
		typeof snapshot.format !== 'string' ||
		!TOURNAMENT_FORMATS.includes(snapshot.format as (typeof TOURNAMENT_FORMATS)[number])
	) {
		return false;
	}
	if (!Array.isArray(snapshot.players)) return false;
	return snapshot.players.every(isValidPlayer);
}

function isValidPlayer(player: unknown): player is Player {
	if (!player || typeof player !== 'object') return false;
	const candidate = player as Partial<Player>;
	return (
		typeof candidate.id === 'string' &&
		typeof candidate.name === 'string' &&
		candidate.name.trim().length > 0
	);
}
