import { StorageService } from '$lib/shared/storage';
import { generateMexicanoNextRound, generateTeamMexicanoNextRound } from '$lib/tournament/scoring';
import {
	calculateUpdatedLeaderboard,
	sortLeaderboard,
	type LeaderboardPlayer
} from '$lib/tournament/scoring/playerStats';
import { validateRoundScores } from '$lib/tournament/scoring/scoreValidation';
import { generateFinals, generateSemifinals } from '$lib/tournament/scoring/playoffGenerator';
import {
	recordCourtResult,
	advanceRound,
	clearSide,
	type WinnersCourtState
} from '$lib/tournament/winnersCourt/winnersCourtCore';
import { updateBracketResult as updateGeneratedBracketResult } from '$lib/tournament/bracket/bracketGeneration';
import { normalizeTournamentState } from '$lib/tournament/core/normalization';

// --- Types ---
export interface Player {
	id: string;
	name: string;
	lockedCourt?: number | null;
	division?: string;
	divisionId?: string;
}

export interface PreferredPartner {
	id: string;
	player1Id: string;
	player2Id: string;
}

export interface WinnersCourtSetupDraft {
	players: {
		id: string;
		name: string;
		skill: number;
		poolId: string;
	}[];
	poolCount: number;
	isTwist: boolean;
	useSkillLevels: boolean;
	courtCountInput: number | null;
	assignStrategy: 'random' | 'manual';
}

export interface Match {
	court: number;
	team1: Player[];
	team2: Player[];
	score1?: number;
	score2?: number;
	relaxedConstraint?: string;
}

export interface Round {
	number: number;
	name?: string;
	completed?: boolean;
	matches: Match[];
	byes?: Player[];
	durationSeconds?: number;
}

export interface TournamentState {
	version: number;
	players: Player[];
	format:
		| 'americano'
		| 'mexicano'
		| 'team'
		| 'teamMexicano'
		| 'division'
		| 'bracket'
		| 'winners-court';
	divisions?: Array<{
		id: string;
		name: string;
		courts: number;
		order: number;
		color?: string;
	}>;
	courts: number;
	scoringMode: 'total' | 'race' | 'time';
	pointsPerMatch: number;
	rankingCriteria: 'points' | 'wins' | 'winRatio' | 'pointRatio';
	courtFormat: 'number' | 'court' | 'custom';
	customCourtNames: string[];
	divisionCourtNames: Record<string, string[]>;
	maxRepeats: number;
	pairingStrategy: 'optimal' | 'oneTwo' | 'oneThree' | 'oneFour';
	strictStrategy: boolean;
	preferredPartners: PreferredPartner[];
	manualByes: string[];
	hideLeaderboard: boolean;
	showPositionChanges: boolean;
	gridColumns: number;
	leaderboardColumns: number;
	textSize: number;
	bracketScale: number;
	isLocked: boolean;
	allowCourtChange: boolean;
	tournamentName: string;
	tournamentNotes: string;
	schedule: Round[];
	currentRound: number;
	roundStartedAt: number | null;
	sessionStartedAt: number | null;
	leaderboard: any[];
	allRounds: Round[] | null;
	historyData: any[];
	timer: {
		remainingSeconds: number;
		isRunning: boolean;
		duration: number;
		status: 'idle' | 'running' | 'paused' | 'completed';
	};
	winnersCourt: any | null;
	winnersCourtSetup?: WinnersCourtSetupDraft | null;
	bracket: {
		format: string;
		teams: any[];
		matches: any[];
		standings: any[];
		meta: { name: string; notes: string; createdAt: string | null };
		matchesA?: any[];
		matchesB?: any[];
		grandFinal?: any | null;
		numRoundsA?: number;
		numRoundsB?: number;
		numRounds?: number;
		isDualBracket?: boolean;
		teamsA?: any[];
		teamsB?: any[];
	} | null;
	plannedStartTime?: string;
	matchDuration?: number;
	bracketConfig?: {
		scoreType: string;
		mode: 'teams' | 'players';
		bracketCount?: number;
	};
	ui: {
		currentRoute: string;
		selectedMatchId: string | null;
		activeBracketTab: string;
	};
	tiebreaker?: 'difference' | 'most_won' | 'shared';
	divisionCourts?: number;
	namingDrafts: Record<string, { name: string; notes: string }>;
	[key: string]: any;
}

const DEFAULT_STATE: TournamentState = {
	version: 1,
	players: [],
	format: 'americano',
	divisions: [],
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
	tournamentName: '',
	tournamentNotes: '',
	schedule: [],
	currentRound: 0,
	roundStartedAt: null,
	sessionStartedAt: null,
	leaderboard: [],
	allRounds: null,
	historyData: [],
	timer: {
		remainingSeconds: 720,
		isRunning: false,
		duration: 12,
		status: 'idle'
	},
	winnersCourt: null,
	winnersCourtSetup: null,
	bracket: null,
	tiebreaker: 'difference',
	divisionCourts: 2,
	ui: {
		currentRoute: '',
		selectedMatchId: null,
		activeBracketTab: 'A'
	},
	plannedStartTime: '17:00',
	matchDuration: 15,
	namingDrafts: {
		americano: { name: '', notes: '' },
		mexicano: { name: '', notes: '' },
		team: { name: '', notes: '' },
		teamMexicano: { name: '', notes: '' },
		division: { name: '', notes: '' },
		bracket: { name: '', notes: '' },
		winnersCourt: { name: '', notes: '' }
	}
};

function buildInitialLeaderboard(players: Player[]): LeaderboardPlayer[] {
	return players.map((player, index) => ({
		id: player.id,
		name: player.name,
		division: player.division,
		points: 0,
		wins: 0,
		losses: 0,
		draws: 0,
		matchPoints: 0,
		played: 0,
		pointsLost: 0,
		byeCount: 0,
		playedWith: [],
		playedAgainst: [],
		previousRank: index + 1
	}));
}

function recalculateLeaderboard(
	players: Player[],
	completedRounds: Round[],
	rankingCriteria: TournamentState['rankingCriteria']
): LeaderboardPlayer[] {
	let leaderboard = buildInitialLeaderboard(players);
	const leagueRounds = completedRounds.filter((r) => !r.name);

	leagueRounds.forEach((round) => {
		const sortedCurrent = sortLeaderboard(leaderboard, rankingCriteria);
		const currentRankMap = new Map<string | number, number>();
		sortedCurrent.forEach((player, idx) => currentRankMap.set(player.id, idx + 1));

		const leaderboardWithPrevRanks = leaderboard.map((player) => ({
			...player,
			previousRank: currentRankMap.get(player.id) ?? player.previousRank
		}));

		leaderboard = calculateUpdatedLeaderboard(
			leaderboardWithPrevRanks,
			round.matches,
			round.byes || []
		);
	});

	return leaderboard;
}

class TournamentStore {
	// Svelte 5 Runes for reactive states
	state = $state<TournamentState>(DEFAULT_STATE);
	undoStack = $state<TournamentState[]>([]);
	isLoaded = $state(false);

	constructor() {
		this.load();
	}

	getStorageKeyForFormat(format: string): string {
		if (['americano', 'mexicano', 'team', 'teamMexicano'].includes(format)) {
			return 'tournament-state';
		}
		if (format === 'winners-court') {
			return 'tournament-state-winners-court';
		}
		if (format === 'division') {
			return 'tournament-state-division';
		}
		if (format === 'bracket') {
			return 'tournament-state-bracket';
		}
		return 'tournament-state';
	}

	initForFormat(
		format:
			| 'americano'
			| 'mexicano'
			| 'team'
			| 'teamMexicano'
			| 'division'
			| 'bracket'
			| 'winners-court'
	) {
		const key = this.getStorageKeyForFormat(format);
		const saved = StorageService.getItem(key) as any;

		this.isLoaded = false;

		if (saved) {
			const merged = {
				...DEFAULT_STATE,
				...saved,
				format, // Force the active format
				divisionCourtNames:
					saved.divisionCourtNames &&
					typeof saved.divisionCourtNames === 'object' &&
					!Array.isArray(saved.divisionCourtNames)
						? saved.divisionCourtNames
						: DEFAULT_STATE.divisionCourtNames
			};
			this.state = normalizeTournamentState(merged as any) as unknown as TournamentState;
		} else {
			const newState = JSON.parse(JSON.stringify(DEFAULT_STATE));
			newState.format = format;
			if (format === 'division') {
				newState.divisions = [
					{
						id: 'div-A',
						name: 'A',
						courts: 1,
						order: 0
					}
				];
			}
			this.state = normalizeTournamentState(newState as any) as unknown as TournamentState;
		}

		this.undoStack = [];
		this.isLoaded = true;
		this.save();
	}

	load() {
		let initialFormat = 'americano';
		if (typeof window !== 'undefined') {
			const path = window.location.pathname;
			if (path.includes('/winners-court')) {
				initialFormat = 'winners-court';
			} else if (path.includes('/division')) {
				initialFormat = 'division';
			} else if (path.includes('/bracket')) {
				initialFormat = 'bracket';
			}
		}

		const key = this.getStorageKeyForFormat(initialFormat);
		const saved = StorageService.getItem(key) as any;
		if (saved) {
			const merged = {
				...DEFAULT_STATE,
				...saved,
				divisionCourtNames:
					saved.divisionCourtNames &&
					typeof saved.divisionCourtNames === 'object' &&
					!Array.isArray(saved.divisionCourtNames)
						? saved.divisionCourtNames
						: DEFAULT_STATE.divisionCourtNames
			};
			this.state = normalizeTournamentState(merged as any) as unknown as TournamentState;
		} else {
			const newState = JSON.parse(JSON.stringify(DEFAULT_STATE));
			newState.format = initialFormat as any;
			if (initialFormat === 'division') {
				newState.divisions = [
					{
						id: 'div-A',
						name: 'A',
						courts: 1,
						order: 0
					}
				];
			}
			this.state = normalizeTournamentState(newState as any) as unknown as TournamentState;
		}
		this.isLoaded = true;
	}

	save() {
		if (this.isLoaded) {
			const key = this.getStorageKeyForFormat(this.state.format);
			StorageService.setItem(key, this.state);
			if (typeof window !== 'undefined') {
				(window as any).state = this.state;
			}
		}
	}

	// Derived state to check if undo is available
	canUndo = $derived(this.undoStack.length > 0);

	// Take a snapshot for undoing later
	snapshot() {
		const copy = JSON.parse(JSON.stringify(this.state));
		this.undoStack.push(copy);
		if (this.undoStack.length > 20) {
			this.undoStack.shift();
		}
	}

	undo() {
		if (this.undoStack.length === 0) return;
		const previousState = this.undoStack[this.undoStack.length - 1];
		this.undoStack = this.undoStack.slice(0, -1);
		this.state = previousState;
		this.save();
	}

	reset() {
		this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
		this.undoStack = [];
		this.save();
	}

	// --- State modification methods ---

	setState(payload: Partial<TournamentState>) {
		this.state = { ...this.state, ...payload };
		this.save();
	}

	updateField(key: keyof TournamentState, value: any) {
		const dataFields = ['schedule', 'players', 'leaderboard', 'format', 'allowCourtChange'];
		if (dataFields.includes(key as string)) {
			this.snapshot();
		}
		(this.state as any)[key] = value;
		this.save();
	}

	addPlayer(player: Player) {
		this.state.players.push(player);
		this.save();
	}

	addLatePlayer(player: Player) {
		this.snapshot();
		const newPlayer = player;
		const defaultDivisionId =
			this.state.format === 'division'
				? this.state.players[0]?.divisionId ||
					this.state.players[0]?.division ||
					(this.state as any).divisions?.[0]?.id ||
					'A'
				: undefined;
		const defaultDivisionName =
			this.state.format === 'division'
				? this.state.players[0]?.division ||
					(this.state as any).divisions?.find?.((div: any) => div.id === defaultDivisionId)?.name ||
					'A'
				: undefined;

		const leaderboardEntry = {
			id: newPlayer.id,
			name: newPlayer.name,
			division: defaultDivisionName,
			divisionId: defaultDivisionId,
			points: 0,
			wins: 0,
			played: 0,
			pointsLost: 0,
			byeCount: 0,
			losses: 0,
			draws: 0,
			matchPoints: 0,
			playedWith: [],
			playedAgainst: [],
			previousRank: this.state.leaderboard.length + 1
		};

		this.state.players.push(
			this.state.format === 'division'
				? {
						...newPlayer,
						divisionId: defaultDivisionId,
						division: defaultDivisionName
					}
				: newPlayer
		);
		this.state.leaderboard.push(leaderboardEntry);
		this.save();
	}

	removePlayer(playerId: string) {
		this.snapshot();
		this.state.players = this.state.players.filter((p) => p.id !== playerId);
		this.save();
	}

	clearPlayers() {
		this.state.players = [];
		this.save();
	}

	setBracket(bracket: any, config?: any) {
		this.state.bracket = bracket;
		if (config) {
			this.state.bracketConfig = config;
		}
		this.save();
	}

	updateBracketResult(matchId: number, score1: number, score2: number) {
		if (!this.state.bracket) return;
		const updatedBracket = updateGeneratedBracketResult(
			this.state.bracket as any,
			matchId,
			score1,
			score2
		);
		this.state.bracket = updatedBracket as any;
		this.save();
	}

	clearBracket() {
		this.state.bracket = null;
		this.state.bracketConfig = undefined;
		this.save();
	}

	updateBracketScale(scale: number) {
		this.state.bracketScale = scale;
		this.save();
	}

	setHistory(history: any[]) {
		this.state.historyData = history;
		this.save();
	}

	updateTimer(payload: Partial<TournamentState['timer']>) {
		this.state.timer = { ...this.state.timer, ...payload };
		this.save();
	}

	updateNamingDraft(format: string, key: 'name' | 'notes', value: string) {
		if (!this.state.namingDrafts) {
			this.state.namingDrafts = {};
		}
		const currentDraft = this.state.namingDrafts[format] || { name: '', notes: '' };
		this.state.namingDrafts[format] = { ...currentDraft, [key]: value };
		this.save();
	}

	// --- Winners Court ---

	setWinnersCourt(winnersCourtState: WinnersCourtState | null) {
		this.state.winnersCourt = winnersCourtState;
		this.save();
	}

	setWinnersCourtSetup(winnersCourtSetup: WinnersCourtSetupDraft | null) {
		this.state.winnersCourtSetup = winnersCourtSetup;
		this.save();
	}

	clearWinnersCourtSetup() {
		this.state.winnersCourtSetup = null;
		this.save();
	}

	updateWinnersCourtResult(side: string, courtIndex: number, winner: 1 | 2) {
		if (!this.state.winnersCourt) return;
		const updated = recordCourtResult(this.state.winnersCourt, side, courtIndex, winner);
		this.state.winnersCourt = updated;
		this.save();
	}

	advanceWinnersCourt(side: string) {
		if (!this.state.winnersCourt) return;
		const result = advanceRound(this.state.winnersCourt, side);
		if (result && 'error' in result) {
			console.error('[WC] Advance round error:', (result as any).error);
			return;
		}
		this.state.winnersCourt = result;
		this.save();
	}

	clearWinnersCourtSide(side: string) {
		if (!this.state.winnersCourt) return;
		const cleared = clearSide(this.state.winnersCourt, side);
		this.state.winnersCourt = cleared;
		this.save();
	}

	// --- Match & Rounds ---

	swapMatchCourt(roundIndex: number, matchIndex: number, newCourt: number) {
		this.snapshot();
		const newSchedule = [...this.state.schedule];
		if (newSchedule[roundIndex] && newSchedule[roundIndex].matches[matchIndex]) {
			const newMatches = [...newSchedule[roundIndex].matches];
			newMatches[matchIndex] = { ...newMatches[matchIndex], court: newCourt };
			newSchedule[roundIndex] = { ...newSchedule[roundIndex], matches: newMatches };
			this.state.schedule = newSchedule;
			this.save();
		}
	}

	addRound(round: Round) {
		this.state.schedule.push({ ...round, number: this.state.schedule.length + 1 });
		this.state.isLocked = true;
		this.state.hideLeaderboard = false;
		this.save();
	}

	completeRound(): { ok: boolean; errors?: string[] } {
		this.snapshot();
		const currentRoundIdx = this.state.schedule.length - 1;
		const currentRound = this.state.schedule[currentRoundIdx];
		if (!currentRound || currentRound.completed) return { ok: false, errors: ['No active round'] };

		const errors = validateRoundScores(currentRound, {
			scoringMode: this.state.scoringMode,
			pointsPerMatch: this.state.pointsPerMatch
		});
		if (errors.length > 0) {
			this.undoStack = this.undoStack.slice(0, -1);
			return { ok: false, errors };
		}

		const completedAt = Date.now();

		// 1. Snapshot previous ranks
		const sortedCurrent = sortLeaderboard(this.state.leaderboard, this.state.rankingCriteria);
		const currentRankMap = new Map();
		sortedCurrent.forEach((p, idx) => currentRankMap.set(p.id, idx + 1));

		const leaderboardWithPrevRanks = this.state.leaderboard.map((p) => ({
			...p,
			previousRank: currentRankMap.get(p.id)
		}));

		// 2. Recalculate leaderboard (only for non-playoff rounds)
		const isPlayoff = !!currentRound.name;
		const newLeaderboard = isPlayoff
			? leaderboardWithPrevRanks
			: calculateUpdatedLeaderboard(
					leaderboardWithPrevRanks,
					currentRound.matches,
					currentRound.byes || []
				);

		const newSchedule = [...this.state.schedule];
		const duration = this.state.roundStartedAt
			? Math.round((completedAt - this.state.roundStartedAt) / 1000)
			: 0;

		newSchedule[currentRoundIdx] = {
			...currentRound,
			completed: true,
			durationSeconds: duration
		};

		// 3. Generate next round
		let nextRoundBase: Round | null = null;
		const nextRoundIndex = newSchedule.length;

		if (
			(this.state.format === 'americano' || this.state.format === 'team') &&
			this.state.allRounds &&
			nextRoundIndex < this.state.allRounds.length
		) {
			nextRoundBase = { ...this.state.allRounds[nextRoundIndex] };
		} else if (this.state.format === 'mexicano') {
			nextRoundBase = generateMexicanoNextRound({
				leaderboard: newLeaderboard,
				manualByes: this.state.manualByes,
				courts: this.state.courts,
				preferredPartners: this.state.preferredPartners,
				pairingStrategy: this.state.pairingStrategy,
				maxRepeats: this.state.maxRepeats,
				strictStrategy: this.state.strictStrategy,
				scheduleLength: newSchedule.length
			}) as any;
		} else if (this.state.format === 'teamMexicano') {
			nextRoundBase = generateTeamMexicanoNextRound({
				leaderboard: newLeaderboard,
				manualByes: this.state.manualByes,
				courts: this.state.courts,
				scheduleLength: newSchedule.length,
				pairingStrategy: this.state.pairingStrategy,
				maxRepeats: this.state.maxRepeats
			}) as any;
		} else if (this.state.format === 'division') {
			if (this.state.allRounds && nextRoundIndex < this.state.allRounds.length) {
				nextRoundBase = { ...this.state.allRounds[nextRoundIndex] };
			} else if (!this.state.schedule.some((round) => round.name === 'Semifinal')) {
				nextRoundBase = generateSemifinals({
					...this.state,
					schedule: newSchedule,
					leaderboard: newLeaderboard
				} as any) as any;
			} else if (
				currentRound.name === 'Semifinal' &&
				!this.state.schedule.some((round) => round.name === 'Final')
			) {
				nextRoundBase = generateFinals(newSchedule[currentRoundIdx] as any) as any;
			}
		}

		if (nextRoundBase && nextRoundBase.matches.length > 0) {
			newSchedule.push(nextRoundBase);
		} else {
			nextRoundBase = null;
		}

		this.state.schedule = newSchedule;
		this.state.leaderboard = newLeaderboard;
		this.state.currentRound = nextRoundIndex;
		this.state.manualByes = [];
		this.state.roundStartedAt = nextRoundBase ? completedAt : null;
		this.state.ui.selectedMatchId = null;
		this.save();
		return { ok: true };
	}

	editRound(roundIndex: number, matchIndex?: number) {
		if (roundIndex < 0 || roundIndex >= this.state.schedule.length) return;
		this.snapshot();

		const newSchedule = this.state.schedule.slice(0, roundIndex + 1);
		newSchedule[roundIndex] = {
			...newSchedule[roundIndex],
			completed: false,
			durationSeconds: undefined
		};

		const completedRounds = newSchedule.slice(0, roundIndex).filter((round) => round.completed);
		const recalculated = recalculateLeaderboard(
			this.state.players,
			completedRounds,
			this.state.rankingCriteria
		);

		this.state.schedule = newSchedule;
		this.state.currentRound = roundIndex;
		this.state.leaderboard = recalculated;
		this.state.manualByes = [];
		this.state.roundStartedAt = null;
		this.state.ui.selectedMatchId =
			matchIndex != null ? `round-${roundIndex}-match-${matchIndex}` : null;
		this.save();
	}
}

// Global instance to share state across components and routes
export const tournament = new TournamentStore();
