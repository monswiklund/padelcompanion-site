/**
 * Player Stats Module
 * Handles updating and subtracting player statistics.
 * Pure functions - no state mutation.
 */

export interface LeaderboardPlayer {
	id: string | number;
	name: string;
	points: number;
	played: number;
	pointsLost: number;
	wins: number;
	losses: number;
	draws: number;
	matchPoints: number;
	playedWith?: (string | number)[];
	playedAgainst?: (string | number)[];
	byeCount?: number;
	previousRank?: number;
	division?: string;
}

/**
 * Update player stats for a set of players based on match results.
 */
export function calculateUpdatedLeaderboard(
	currentLeaderboard: LeaderboardPlayer[],
	matches: any[],
	byes: any[] = []
): LeaderboardPlayer[] {
	const newLeaderboard = currentLeaderboard.map((p) => ({
		...p,
		playedWith: p.playedWith ? [...p.playedWith] : [],
		playedAgainst: p.playedAgainst ? [...p.playedAgainst] : []
	}));

	matches.forEach((match) => {
		const s1 = match.score1 || 0;
		const s2 = match.score2 || 0;
		const t1Won = s1 > s2;
		const t2Won = s2 > s1;
		const isDraw = s1 === s2;

		const updatePlayer = (
			id: string | number,
			pFor: number,
			pAgainst: number,
			won: boolean,
			draw: boolean,
			partnerId?: string | number,
			opponentIds: (string | number)[] = []
		) => {
			const pIdx = newLeaderboard.findIndex((p) => p.id === id);
			if (pIdx !== -1) {
				const p = newLeaderboard[pIdx];
				p.points += pFor;
				p.pointsLost += pAgainst;
				p.played += 1;
				if (won) {
					p.wins += 1;
					p.matchPoints = (p.matchPoints || 0) + 3;
				} else if (draw) {
					p.draws = (p.draws || 0) + 1;
					p.matchPoints = (p.matchPoints || 0) + 1;
				} else {
					p.losses = (p.losses || 0) + 1;
				}
				if (partnerId) {
					p.playedWith = [...(p.playedWith || []), partnerId];
				}
				if (opponentIds.length > 0) {
					p.playedAgainst = [...(p.playedAgainst || []), ...opponentIds];
				}
			}
		};

		match.team1.forEach((p: any) =>
			updatePlayer(
				p.id,
				s1,
				s2,
				t1Won,
				isDraw,
				match.team1.length > 1 ? match.team1.find((px: any) => px.id !== p.id)?.id : undefined,
				match.team2.map((opponent: any) => opponent.id)
			)
		);
		match.team2.forEach((p: any) =>
			updatePlayer(
				p.id,
				s2,
				s1,
				t2Won,
				isDraw,
				match.team2.length > 1 ? match.team2.find((px: any) => px.id !== p.id)?.id : undefined,
				match.team1.map((opponent: any) => opponent.id)
			)
		);
	});

	// Update byes
	byes.forEach((bp) => {
		const pIdx = newLeaderboard.findIndex((p) => p.id === bp.id);
		if (pIdx !== -1) {
			newLeaderboard[pIdx].byeCount = (newLeaderboard[pIdx].byeCount || 0) + 1;
		}
	});

	return newLeaderboard;
}

/**
 * Sorts leaderboard based on points, wins, and other criteria.
 */
export function sortLeaderboard(
	leaderboard: LeaderboardPlayer[],
	criteria: 'points' | 'wins' | 'winRatio' | 'pointRatio' | 'matchPoints' = 'points',
	tiebreaker?: 'difference' | 'most_won' | 'shared'
): LeaderboardPlayer[] {
	return [...leaderboard].sort((a, b) => {
		if (criteria === 'matchPoints') {
			// Division mode: sort by matchPoints first
			if (b.matchPoints !== a.matchPoints) return b.matchPoints - a.matchPoints;
			// Then apply tiebreaker
			if (tiebreaker === 'difference') {
				const diffA = a.points - a.pointsLost;
				const diffB = b.points - b.pointsLost;
				if (diffB !== diffA) return diffB - diffA;
			} else if (tiebreaker === 'most_won') {
				if (b.points !== a.points) return b.points - a.points;
			}
			// "shared" or further fallback: keep same order
			return (b.wins || 0) - (a.wins || 0);
		}
		if (criteria === 'points') {
			if (b.points !== a.points) return b.points - a.points;
			return (b.wins || 0) - (a.wins || 0);
		}
		// Add more criteria if needed
		return b.points - a.points;
	});
}
