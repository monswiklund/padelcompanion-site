import {
	createTournamentSnapshot,
	parseTournamentSnapshot,
	restoreTournamentStateFromSnapshot,
	type TournamentSnapshot
} from './snapshot';
import type { TournamentState } from '../core/state';
import { StorageService } from '$lib/shared/storage';

const DEFAULT_API_BASE = '/api';
const LOCAL_SESSIONS_KEY = 'tournament-cloud-sessions';

export interface TournamentSessionResponse {
	id: string;
	shareCode: string;
	editToken?: string;
	updatedAt: string;
	snapshot: TournamentSnapshot;
}

export interface TournamentSessionSummary {
	id: string;
	shareCode: string;
	editToken?: string;
	updatedAt: string;
}

type StoredTournamentSession = TournamentSessionResponse;

function getApiBase(): string | null {
	const envBase = import.meta.env.VITE_TOURNAMENT_SYNC_API_BASE;
	if (typeof envBase === 'string' && envBase.trim()) {
		return envBase.trim().replace(/\/$/, '');
	}

	if (typeof window !== 'undefined') {
		const hostname = window.location.hostname;
		if (hostname === 'padelcompanion.se' || hostname === 'www.padelcompanion.se') {
			return 'https://api.padelcompanion.se/api';
		}
	}

	return DEFAULT_API_BASE;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const apiBase = getApiBase();
	if (!apiBase) {
		throw new Error('Tournament sync API is not configured');
	}

	const response = await fetch(`${apiBase}${path}`, {
		headers: {
			'Content-Type': 'application/json',
			...(init?.headers ?? {})
		},
		...init
	});

	if (!response.ok) {
		const message = await response.text();
		throw new Error(message || `Request failed with status ${response.status}`);
	}

	return (await response.json()) as T;
}

function randomCode(length = 6): string {
	const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
	let value = '';
	for (let i = 0; i < length; i++) {
		value += alphabet[Math.floor(Math.random() * alphabet.length)];
	}
	return value;
}

function createSessionId(): string {
	return `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function readLocalSessions(): Record<string, StoredTournamentSession> {
	return (
		StorageService.getItem<Record<string, StoredTournamentSession>>(LOCAL_SESSIONS_KEY, {}) || {}
	);
}

function writeLocalSessions(sessions: Record<string, StoredTournamentSession>): void {
	StorageService.setItem(LOCAL_SESSIONS_KEY, sessions);
}

function findSessionByShareCode(shareCode: string): StoredTournamentSession | undefined {
	const sessions = readLocalSessions();
	return Object.values(sessions).find((session) => session.shareCode === shareCode);
}

function createLocalSession(snapshot: TournamentSnapshot): TournamentSessionResponse {
	const sessions = readLocalSessions();
	let shareCode = randomCode();
	while (findSessionByShareCode(shareCode)) {
		shareCode = randomCode();
	}

	const response: TournamentSessionResponse = {
		id: createSessionId(),
		shareCode,
		editToken: randomCode(12),
		updatedAt: new Date().toISOString(),
		snapshot
	};

	sessions[response.id] = response;
	writeLocalSessions(sessions);
	return response;
}

function updateLocalSession(
	sessionId: string,
	snapshot: TournamentSnapshot,
	editToken: string
): TournamentSessionResponse {
	const sessions = readLocalSessions();
	const existing = sessions[sessionId];
	if (!existing) {
		throw new Error('Tournament session not found');
	}
	if (existing.editToken !== editToken) {
		throw new Error('Invalid edit token');
	}

	const response: TournamentSessionResponse = {
		...existing,
		updatedAt: new Date().toISOString(),
		snapshot
	};

	sessions[sessionId] = response;
	writeLocalSessions(sessions);
	return response;
}

function getLocalSession(shareCode: string): TournamentSessionResponse {
	const session = findSessionByShareCode(shareCode);
	if (!session) {
		throw new Error('Tournament session not found');
	}
	return session;
}

async function requestWithLocalFallback<TournamentResponse extends TournamentSessionResponse>(
	path: string,
	init: RequestInit | undefined,
	fallback: () => TournamentResponse
): Promise<TournamentResponse> {
	try {
		return await request<TournamentResponse>(path, init);
	} catch (error) {
		if (
			error instanceof TypeError ||
			(error instanceof Error &&
				/Failed to fetch|NetworkError|404|405|500|502|503|504/.test(error.message))
		) {
			return fallback();
		}
		throw error;
	}
}

export const CloudService = {
	isConfigured(): boolean {
		return getApiBase() !== null;
	},

	createSnapshot(state: TournamentState): TournamentSnapshot {
		return createTournamentSnapshot(state);
	},

	restoreState(snapshot: TournamentSnapshot): Partial<TournamentState> {
		return restoreTournamentStateFromSnapshot(snapshot);
	},

	parseSnapshot(input: string | TournamentSnapshot): TournamentSnapshot {
		return parseTournamentSnapshot(input);
	},

	async createSession(state: TournamentState): Promise<TournamentSessionSummary> {
		const snapshot = createTournamentSnapshot(state);
		const response = await requestWithLocalFallback(
			'/tournament-sessions',
			{
				method: 'POST',
				body: JSON.stringify({ snapshot })
			},
			() => createLocalSession(snapshot)
		);

		return {
			id: response.id,
			shareCode: response.shareCode,
			editToken: response.editToken,
			updatedAt: response.updatedAt
		};
	},

	async updateSession(
		sessionId: string,
		editToken: string,
		state: TournamentState
	): Promise<TournamentSessionSummary> {
		const snapshot = createTournamentSnapshot(state);
		const response = await requestWithLocalFallback<TournamentSessionResponse>(
			`/tournament-sessions/${encodeURIComponent(sessionId)}/snapshot`,
			{
				method: 'PUT',
				headers: {
					'X-Session-Token': editToken
				},
				body: JSON.stringify({ snapshot })
			},
			() => updateLocalSession(sessionId, snapshot, editToken)
		);

		return {
			id: response.id,
			shareCode: response.shareCode,
			editToken: response.editToken,
			updatedAt: response.updatedAt
		};
	},

	async getSession(shareCode: string): Promise<TournamentSnapshot> {
		const response = await requestWithLocalFallback<TournamentSessionResponse>(
			`/tournament-sessions/${encodeURIComponent(shareCode)}`,
			undefined,
			() => getLocalSession(shareCode)
		);
		return parseTournamentSnapshot(response.snapshot);
	}
};
