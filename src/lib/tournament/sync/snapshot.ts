import type { TournamentState } from '../core/state';

export const TOURNAMENT_SNAPSHOT_SCHEMA_VERSION = 2;

export type TournamentSessionStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface TournamentSnapshotMetadata {
	name: string;
	format: TournamentState['format'];
	playerCount: number;
	currentRound: number;
	status: TournamentSessionStatus;
}

export interface TournamentSnapshot {
	snapshotSchemaVersion: number;
	exportedAt: string;
	metadata: TournamentSnapshotMetadata;
	state: Omit<TournamentState, 'ui' | 'historyData'>;
}

interface LegacyTournamentExport {
	name?: string;
	format?: TournamentState['format'];
	players?: TournamentState['players'];
	schedule?: TournamentState['schedule'];
	leaderboard?: TournamentState['leaderboard'];
	exportedAt?: string;
}

type ServerRelevantState = TournamentSnapshot['state'];

function deepClone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value)) as T;
}

function inferTournamentStatus(
	state: Pick<TournamentState, 'schedule' | 'isLocked' | 'winnersCourt'>
): TournamentSessionStatus {
	const winnersCourtSides = state.winnersCourt?.sides
		? Object.keys(state.winnersCourt.sides).length
		: 0;

	if (winnersCourtSides > 0) return 'active';
	if (!state.schedule.length) return 'draft';

	const hasIncompleteRound = state.schedule.some((round: any) => !round.completed);
	if (hasIncompleteRound || state.isLocked) return 'active';

	return 'completed';
}

export function sanitizeTournamentStateForSync(state: TournamentState): ServerRelevantState {
	const cloned = deepClone(state);

	delete (cloned as any).ui;
	delete (cloned as any).historyData;
	return cloned as any;
}

export function extractTournamentSnapshotMetadata(
	state: TournamentState
): TournamentSnapshotMetadata {
	return {
		name: state.tournamentName || '',
		format: state.format,
		playerCount: state.players.length,
		currentRound: state.currentRound,
		status: inferTournamentStatus(state)
	};
}

export function createTournamentSnapshot(state: TournamentState): TournamentSnapshot {
	return {
		snapshotSchemaVersion: TOURNAMENT_SNAPSHOT_SCHEMA_VERSION,
		exportedAt: new Date().toISOString(),
		metadata: extractTournamentSnapshotMetadata(state),
		state: sanitizeTournamentStateForSync(state)
	};
}

export function restoreTournamentStateFromSnapshot(
	snapshot: TournamentSnapshot
): Partial<TournamentState> {
	return deepClone(snapshot.state);
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function isTournamentSnapshot(value: unknown): value is TournamentSnapshot {
	return (
		isObject(value) &&
		typeof value.snapshotSchemaVersion === 'number' &&
		isObject(value.metadata) &&
		isObject(value.state)
	);
}

function isLegacyTournamentExport(value: unknown): value is LegacyTournamentExport {
	return isObject(value) && Array.isArray(value.players) && Array.isArray(value.schedule);
}

export function parseTournamentSnapshot(
	input: string | TournamentSnapshot | LegacyTournamentExport
): TournamentSnapshot {
	const parsed = typeof input === 'string' ? (JSON.parse(input) as unknown) : input;

	if (isTournamentSnapshot(parsed)) {
		return deepClone(parsed);
	}

	if (isLegacyTournamentExport(parsed)) {
		const partialState = {
			version: 1,
			players: parsed.players ?? [],
			format: parsed.format ?? 'americano',
			courts: 2,
			scoringMode: 'total',
			pointsPerMatch: 24,
			rankingCriteria: 'points',
			courtFormat: 'court',
			customCourtNames: [],
			divisionCourtNames: {},
			maxRepeats: 99,
			pairingStrategy: 'optimal',
			strictStrategy: false,
			preferredPartners: [],
			manualByes: [],
			hideLeaderboard: true,
			showPositionChanges: false,
			gridColumns: 0,
			leaderboardColumns: 1,
			textSize: 100,
			bracketScale: 100,
			isLocked: false,
			allowCourtChange: true,
			tournamentName: parsed.name ?? '',
			tournamentNotes: '',
			schedule: parsed.schedule ?? [],
			currentRound: parsed.schedule?.length ?? 0,
			roundStartedAt: null,
			sessionStartedAt: null,
			leaderboard: parsed.leaderboard ?? [],
			allRounds: null,
			historyData: [],
			timer: {
				remainingSeconds: 720,
				isRunning: false,
				duration: 12,
				status: 'idle' as const
			},
			winnersCourt: null,
			bracket: null,
			ui: {
				currentRoute: '',
				selectedMatchId: null,
				activeBracketTab: 'A'
			},
			tiebreaker: 'difference' as const,
			divisionCourts: 2,
			divisions: [],
			maxCourts: 2
		} satisfies TournamentState;

		return createTournamentSnapshot(partialState as any);
	}

	throw new Error('Invalid tournament snapshot format');
}
