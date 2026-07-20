import { describe, expect, it } from 'vitest';
import {
	generateAmericanoSchedule,
	generateDivisionSchedule,
	generateMexicanoFirstRound,
	generateMexicanoNextRound,
	generateTeamMexicanoFirstRound
} from '../scoring';
import { normalizeTournamentState } from '../core/normalization';
import {
	calculateUpdatedLeaderboard,
	sortLeaderboard,
	type LeaderboardPlayer
} from '../scoring/playerStats';
import { validateRoundScores } from '../scoring/scoreValidation';
import {
	generateWinnersCourt,
	recordCourtResult,
	advanceRound
} from '../winnersCourt/winnersCourtCore';
import { generateBracket, updateBracketResult } from '../bracket/bracketGeneration';

function players(count: number) {
	return Array.from({ length: count }, (_, index) => ({
		id: String(index + 1),
		name: `Player ${index + 1}`
	}));
}

type ValidationRound = Parameters<typeof validateRoundScores>[0];

function expectCleanRound(
	round: ValidationRound,
	scoringMode: 'total' | 'race' | 'time' = 'total'
) {
	expect(
		validateRoundScores(round, {
			scoringMode,
			pointsPerMatch: 24,
			requireScores: false
		})
	).toEqual([]);
}

describe('padel game mode contracts', () => {
	it('creates Americano without double-booking players or courts', () => {
		const schedule = generateAmericanoSchedule({ players: players(8), courts: 2 });

		expect(schedule).toHaveLength(7);
		schedule.forEach((round) => expectCleanRound(round));
	});

	it('creates Mexicano first round with byes for uneven players', () => {
		const [round] = generateMexicanoFirstRound(players(9), 2);

		expect(round.matches).toHaveLength(2);
		expect(round.byes).toHaveLength(1);
		expectCleanRound(round);
	});

	it('avoids immediate Mexicano partner repeats in non-strict rotations', () => {
		const leaderboard = players(4).map((player, index) => ({
			...player,
			points: 10 - index,
			played: 1,
			byeCount: 0,
			playedWith: index < 2 ? [index === 0 ? '2' : '1'] : [index === 2 ? '4' : '3']
		}));

		const round = generateMexicanoNextRound({
			leaderboard,
			manualByes: [],
			courts: 1,
			pairingStrategy: 'oneTwo',
			maxRepeats: 99,
			strictStrategy: false
		});

		const partners = round.matches.flatMap((match) => [match.team1, match.team2]);
		expect(partners.map((team) => team.map((player) => player.id))).not.toContainEqual(['1', '2']);
		expect(partners.map((team) => team.map((player) => player.id))).not.toContainEqual(['3', '4']);
	});

	it('creates Winners Court and blocks advance until all courts have winners', () => {
		const state = generateWinnersCourt(
			players(8).map((p) => ({ ...p, side: null })),
			{ poolCount: 1, courtsPerPool: { A: 2 }, twist: true }
		);

		expect(state.sides.A.courts).toHaveLength(2);
		expect(advanceRound(state, 'A')).toEqual({ error: 'Not all courts have results' });

		const oneDone = recordCourtResult(state, 'A', 0, 1);
		const allDone = recordCourtResult(oneDone, 'A', 1, 2);
		const advanced = advanceRound(allDone, 'A');

		expect('error' in advanced).toBe(false);
		if (!('error' in advanced)) expect(advanced.sides.A.round).toBe(2);
	});

	it('creates bracket tournament and rejects tied advancement', () => {
		const bracket = generateBracket(players(4));

		expect(bracket.matches.length).toBeGreaterThan(0);
		expect(bracket.matches[0].team1Id).toBe('1');
		expect(bracket.matches[0].team2Id).toBe('2');

		const withWinner = updateBracketResult(bracket, 1, 10, 8);
		expect(withWinner.matches.find((match) => match.round === 2)?.team1Name).toBe('Player 1');

		const tiedAgain = updateBracketResult(withWinner, 1, 10, 10);
		expect(tiedAgain.matches.find((match) => match.round === 2)?.team1Name).toBeNull();
	});

	it('creates Division round robin across divisions', () => {
		const divisions = [
			{ id: 'A', name: 'A', courts: 1, order: 0 },
			{ id: 'B', name: 'B', courts: 1, order: 1 }
		];
		const teams = players(8).map((player, index) => ({
			...player,
			divisionId: index < 4 ? 'A' : 'B',
			division: index < 4 ? 'A' : 'B'
		}));

		const schedule = generateDivisionSchedule({ players: teams, divisions });

		expect(schedule.length).toBeGreaterThan(0);
		schedule.forEach((round) => expectCleanRound(round));
	});

	it('keeps player division changes by stable divisionId', () => {
		const state = normalizeTournamentState({
			format: 'division',
			players: [
				{ id: '1', name: 'Team 1', divisionId: 'div-B', division: 'A' },
				{ id: '2', name: 'Team 2', divisionId: 'div-A', division: 'A' }
			],
			divisions: [
				{ id: 'div-A', name: 'A', courts: 1, order: 0 },
				{ id: 'div-B', name: 'B', courts: 1, order: 1 }
			],
			divisionCourtNames: {}
		} as any);

		expect(state.players[0].division).toBe('B');
		expect(state.players[0].divisionId).toBe('div-B');
	});

	it('rejects invalid scores, double-booked players, and double-booked courts', () => {
		const round = {
			matches: [
				{ court: 1, team1: [players(1)[0]], team2: [players(2)[1]], score1: 25, score2: 0 },
				{ court: 1, team1: [players(1)[0]], team2: [players(3)[2]], score1: 12, score2: 12 }
			]
		};

		const errors = validateRoundScores(round, { scoringMode: 'total', pointsPerMatch: 24 });

		expect(errors).toContain('Match 1: total score must equal 24');
		expect(errors).toContain('Match 2: court 1 is double-booked');
		expect(errors).toContain('Match 2: player is double-booked');
	});

	it('sorts tied leaderboard by points then wins', () => {
		const leaderboard = [
			{
				id: '1',
				name: 'A',
				points: 10,
				wins: 1,
				losses: 0,
				draws: 0,
				matchPoints: 3,
				played: 1,
				pointsLost: 8
			},
			{
				id: '2',
				name: 'B',
				points: 10,
				wins: 2,
				losses: 0,
				draws: 0,
				matchPoints: 6,
				played: 2,
				pointsLost: 8
			}
		];

		expect(sortLeaderboard(leaderboard).map((p) => p.id)).toEqual(['2', '1']);
	});

	it('records leaderboard points, ties, and playedAgainst', () => {
		const leaderboard: LeaderboardPlayer[] = players(4).map((player) => ({
			...player,
			points: 0,
			wins: 0,
			losses: 0,
			draws: 0,
			matchPoints: 0,
			played: 0,
			pointsLost: 0,
			playedWith: [],
			playedAgainst: []
		}));
		const match = {
			court: 1,
			team1: [leaderboard[0], leaderboard[1]],
			team2: [leaderboard[2], leaderboard[3]],
			score1: 12,
			score2: 12
		};

		const updated = calculateUpdatedLeaderboard(leaderboard, [match]);

		expect(updated[0].points).toBe(12);
		expect(updated[0].draws).toBe(1);
		expect(updated[0].matchPoints).toBe(1);
		expect(updated[0].playedAgainst).toEqual(['3', '4']);
	});

	it('creates Team Mexicano with invalid court overflow handled as byes', () => {
		const [round] = generateTeamMexicanoFirstRound(players(5), 2);

		expect(round.matches).toHaveLength(2);
		expect(round.byes).toHaveLength(1);
		expectCleanRound(round);
	});
});
