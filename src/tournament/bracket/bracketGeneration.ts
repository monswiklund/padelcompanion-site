/**
 * Bracket Generation Module
 * Handles single bracket generation and seeding.
 */

export interface BracketTeam {
  id: string;
  name: string;
  side?: "A" | "B";
}

export interface BracketMatch {
  id: number;
  round: number;
  position: number;
  team1Id: string | null;
  team2Id: string | null;
  team1Name: string | null;
  team2Name: string | null;
  score1: number | null;
  score2: number | null;
  winnerId: string | null;
  completed: boolean;
  nextMatchId: number | null;
  isBye: boolean;
  prevMatch1Id?: number;
  prevMatch2Id?: number;
}

export interface Bracket {
  teams: BracketTeam[];
  matches: BracketMatch[];
  numRounds: number;
  bracketSize: number;
}

/**
 * Generate a single elimination bracket from teams.
 */
export function generateBracket(teams: BracketTeam[]): Bracket {
  const teamCount = teams.length;

  let bracketSize = 1;
  while (bracketSize < teamCount) {
    bracketSize *= 2;
  }

  const seeded = seedTeams(teams, bracketSize);
  const numRounds = Math.log2(bracketSize);
  const matches: BracketMatch[] = [];
  let matchId = 1;

  // First round
  const firstRoundMatchCount = bracketSize / 2;
  for (let i = 0; i < firstRoundMatchCount; i++) {
    const team1 = seeded[i * 2];
    const team2 = seeded[i * 2 + 1];

    matches.push({
      id: matchId++,
      round: 1,
      position: i,
      team1Id: team1 ? team1.id : null,
      team2Id: team2 ? team2.id : null,
      team1Name: team1 ? team1.name : "BYE",
      team2Name: team2 ? team2.name : "BYE",
      score1: null,
      score2: null,
      winnerId: null,
      completed: false,
      nextMatchId: null,
      isBye: !team1 || !team2,
    });
  }

  // Subsequent rounds
  for (let round = 2; round <= numRounds; round++) {
    const matchesInRound = bracketSize / Math.pow(2, round);
    const prevRoundStart = matches.length - matchesInRound * 2;

    for (let i = 0; i < matchesInRound; i++) {
      const prevMatch1 = matches[prevRoundStart + i * 2];
      const prevMatch2 = matches[prevRoundStart + i * 2 + 1];

      const newMatch: BracketMatch = {
        id: matchId++,
        round,
        position: i,
        team1Id: null,
        team2Id: null,
        team1Name: null,
        team2Name: null,
        score1: null,
        score2: null,
        winnerId: null,
        completed: false,
        nextMatchId: null,
        isBye: false,
        prevMatch1Id: prevMatch1.id,
        prevMatch2Id: prevMatch2.id,
      };

      prevMatch1.nextMatchId = newMatch.id;
      prevMatch2.nextMatchId = newMatch.id;

      matches.push(newMatch);
    }
  }

  // Auto-advance byes
  matches
    .filter((m) => m.round === 1 && m.isBye)
    .forEach((m) => {
      if (m.team1Id && !m.team2Id) {
        m.winnerId = m.team1Id;
        m.completed = true;
        advanceWinner(matches, m, teams);
      } else if (m.team2Id && !m.team1Id) {
        m.winnerId = m.team2Id;
        m.completed = true;
        advanceWinner(matches, m, teams);
      }
    });

  return { teams, matches, numRounds, bracketSize };
}

/**
 * Seed teams for bracket based on side assignments.
 * For dual brackets, teams are already filtered by side, so just place them in order.
 */
export function seedTeams(
  teams: BracketTeam[],
  bracketSize: number
): (BracketTeam | null)[] {
  const seeded = new Array<BracketTeam | null>(bracketSize).fill(null);

  // If all teams have same side or no side, just place them in order
  const sideA = teams.filter((t) => t.side === "A");
  const sideB = teams.filter((t) => t.side === "B");
  const noSide = teams.filter(
    (t) => !t.side || (t.side !== "A" && t.side !== "B")
  );

  // If all teams have the same side (typical for dual bracket sub-brackets),
  // or if there's a mix without opposing sides, just place sequentially
  if (sideA.length === 0 || sideB.length === 0) {
    // All teams are on one side or have no side - place sequentially
    teams.forEach((t, i) => {
      if (i < bracketSize) seeded[i] = t;
    });
    return seeded;
  }

  // Standard seeding: separate A and B to opposite halves
  const topHalf = [...sideA];
  const bottomHalf = [...sideB];

  noSide.forEach((t, i) => {
    if (i % 2 === 0) topHalf.push(t);
    else bottomHalf.push(t);
  });

  const halfSize = bracketSize / 2;
  topHalf.forEach((t, i) => {
    if (i < halfSize) seeded[i] = t;
  });
  bottomHalf.forEach((t, i) => {
    if (i < halfSize) seeded[halfSize + i] = t;
  });

  return seeded;
}

/**
 * Get team by ID from teams array.
 */
export function getTeamById(
  teams: BracketTeam[],
  id: string
): BracketTeam | undefined {
  return teams.find((t) => t.id === id);
}

function advanceWinner(
  matches: BracketMatch[],
  match: BracketMatch,
  teams: BracketTeam[]
): void {
  if (!match.nextMatchId || !match.winnerId) return;

  const nextMatch = matches.find((m) => m.id === match.nextMatchId);
  if (!nextMatch) return;

  const winner = getTeamById(teams, match.winnerId);
  if (!winner) return;

  if (nextMatch.prevMatch1Id === match.id) {
    nextMatch.team1Id = winner.id;
    nextMatch.team1Name = winner.name;
  } else {
    nextMatch.team2Id = winner.id;
    nextMatch.team2Name = winner.name;
  }
}

/**
 * Get round name (Final, Semi-final, etc.).
 */
export function getRoundName(round: number, totalRounds: number): string {
  const fromEnd = totalRounds - round;
  if (fromEnd === 0) return "Final";
  if (fromEnd === 1) return "Semi-Finals";
  if (fromEnd === 2) return "Quarter-Finals";
  return `Round ${round}`;
}
