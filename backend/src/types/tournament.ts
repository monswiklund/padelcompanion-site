export interface Player {
	id: string;
	name: string;
}

export interface Match {
	id: string;
	players: string[];
	score?: [number, number];
	court?: number;
	round?: number;
}

export interface TournamentSnapshot {
	format: TournamentFormat;
	players: Player[];
	matches?: Match[];
	settings?: Record<string, unknown>;
	[key: string]: unknown;
}

export interface TournamentSnapshotEnvelope {
	snapshotSchemaVersion: number;
	exportedAt: string;
	metadata?: Record<string, unknown>;
	state: TournamentSnapshot;
}

export type StoredTournamentSnapshot = TournamentSnapshot | TournamentSnapshotEnvelope;

export interface TournamentSession {
	id: string;
	shareCode: string;
	editToken: string;
	snapshot: StoredTournamentSnapshot;
	createdAt: string;
	updatedAt: string;
	lastIp?: string;
}

export const TOURNAMENT_FORMATS = [
	'americano',
	'mexicano',
	'team',
	'teamMexicano',
	'division',
	'bracket',
	'winners-court'
] as const;

export type TournamentFormat = (typeof TOURNAMENT_FORMATS)[number];
