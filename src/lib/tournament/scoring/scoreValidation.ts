export interface ScoreValidationPlayer {
	id: string | number;
	name?: string;
}

export interface ScoreValidationMatch {
	court: number;
	team1: ScoreValidationPlayer[];
	team2: ScoreValidationPlayer[];
	score1?: number | null;
	score2?: number | null;
}

export interface ScoreValidationRound {
	number?: number;
	name?: string;
	matches: ScoreValidationMatch[];
}

export interface ScoreValidationOptions {
	scoringMode: 'total' | 'race' | 'time';
	pointsPerMatch: number;
	requireScores?: boolean;
}

export function validateRoundScores(
	round: ScoreValidationRound,
	options: ScoreValidationOptions
): string[] {
	const errors: string[] = [];
	const usedPlayers = new Set<string | number>();
	const usedCourts = new Set<number>();

	round.matches.forEach((match, index) => {
		const label = `Match ${index + 1}`;

		if (!Number.isInteger(match.court) || match.court < 1) {
			errors.push(`${label}: invalid court`);
		} else if (usedCourts.has(match.court)) {
			errors.push(`${label}: court ${match.court} is double-booked`);
		} else {
			usedCourts.add(match.court);
		}

		[...match.team1, ...match.team2].forEach((player) => {
			if (usedPlayers.has(player.id)) {
				errors.push(`${label}: player is double-booked`);
			}
			usedPlayers.add(player.id);
		});

		const scoreError = validateMatchScore(match, options);
		if (scoreError) errors.push(`${label}: ${scoreError}`);
	});

	return errors;
}

export function validateMatchScore(
	match: Pick<ScoreValidationMatch, 'score1' | 'score2'>,
	options: ScoreValidationOptions
): string | null {
	const { scoringMode, pointsPerMatch, requireScores = true } = options;
	const { score1, score2 } = match;

	if (score1 == null || score2 == null) {
		return requireScores ? 'missing score' : null;
	}

	if (!isValidScoreValue(score1) || !isValidScoreValue(score2)) {
		return 'scores must be whole numbers';
	}

	if (scoringMode === 'total' && score1 + score2 !== pointsPerMatch) {
		return `total score must equal ${pointsPerMatch}`;
	}

	if (scoringMode === 'race') {
		const oneReachedTarget = score1 === pointsPerMatch || score2 === pointsPerMatch;
		const bothReachedTarget = score1 === pointsPerMatch && score2 === pointsPerMatch;
		if (
			!oneReachedTarget ||
			bothReachedTarget ||
			score1 > pointsPerMatch ||
			score2 > pointsPerMatch
		) {
			return `race score must have exactly one team on ${pointsPerMatch}`;
		}
	}

	return null;
}

export function isValidScoreValue(value: number): boolean {
	return Number.isInteger(value) && value >= 0;
}

export function parseScoreInput(value: string, max: number): number | null {
	const trimmed = value.trim();
	if (trimmed === '') return null;
	if (!/^\d+$/.test(trimmed)) return null;
	return Math.min(Number(trimmed), max);
}
