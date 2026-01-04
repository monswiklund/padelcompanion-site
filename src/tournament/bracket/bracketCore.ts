/**
 * Pure bracket generation functions
 * No state mutation - returns data only
 */

// ============ TYPES ============

export interface BracketTeam {
  id: string;
  name: string;
  side?: "A" | "B";
}

export interface BracketMatch {
  id: number;
  round: number;
  team1: BracketTeam | null;
  team2: BracketTeam | null;
  score1: number | null;
  score2: number | null;
  winner: BracketTeam | null;
  nextMatchId: number | null;
  prevMatch1Id: number | null;
  prevMatch2Id: number | null;
}

export interface SingleBracket {
  teams: BracketTeam[];
  matches: BracketMatch[];
  numRounds: number;
  isDualBracket: false;
}

export interface DualBracket {
  teams: BracketTeam[];
  teamsA: BracketTeam[];
  teamsB: BracketTeam[];
  matchesA: BracketMatch[];
  matchesB: BracketMatch[];
  grandFinal: BracketMatch | null;
  numRoundsA: number;
  numRoundsB: number;
  isDualBracket: true;
  hasSharedFinal: boolean;
}

export interface BracketConfig {
  scoreType: "points" | "games" | "sets";
  mode: "teams" | "players";
}

export type Bracket = SingleBracket | DualBracket;

// ============ HELPER FUNCTIONS ============

/**
 * Calculate bracket size (next power of 2)
 */
function getBracketSize(teamCount: number): number {
  return Math.pow(2, Math.ceil(Math.log2(teamCount)));
}

/**
 * Calculate number of rounds
 */
function getNumRounds(bracketSize: number): number {
  return Math.log2(bracketSize);
}

/**
 * Create seeded team slots for a bracket
 */
function seedTeamsInOrder(
  teams: BracketTeam[],
  bracketSize: number
): (BracketTeam | null)[] {
  const seeded: (BracketTeam | null)[] = new Array(bracketSize).fill(null);
  teams.forEach((team, i) => {
    if (i < bracketSize) seeded[i] = team;
  });
  return seeded;
}

/**
 * Generate matches for a single bracket
 */
function generateMatchesForBracket(
  seededTeams: (BracketTeam | null)[],
  numRounds: number,
  idOffset: number = 0
): BracketMatch[] {
  const matches: BracketMatch[] = [];
  let matchId = 1 + idOffset;

  // Create first round matches
  const firstRoundMatchCount = seededTeams.length / 2;
  const firstRoundMatches: BracketMatch[] = [];

  for (let i = 0; i < firstRoundMatchCount; i++) {
    const match: BracketMatch = {
      id: matchId++,
      round: 1,
      team1: seededTeams[i * 2],
      team2: seededTeams[i * 2 + 1],
      score1: null,
      score2: null,
      winner: null,
      nextMatchId: null,
      prevMatch1Id: null,
      prevMatch2Id: null,
    };

    // Auto-advance byes
    if (match.team1 && !match.team2) {
      match.winner = match.team1;
    } else if (!match.team1 && match.team2) {
      match.winner = match.team2;
    }

    firstRoundMatches.push(match);
    matches.push(match);
  }

  // Create subsequent rounds
  let prevRoundMatches = firstRoundMatches;
  for (let round = 2; round <= numRounds; round++) {
    const roundMatches: BracketMatch[] = [];
    const matchCount = prevRoundMatches.length / 2;

    for (let i = 0; i < matchCount; i++) {
      const prevMatch1 = prevRoundMatches[i * 2];
      const prevMatch2 = prevRoundMatches[i * 2 + 1];

      const match: BracketMatch = {
        id: matchId++,
        round,
        team1: prevMatch1.winner,
        team2: prevMatch2.winner,
        score1: null,
        score2: null,
        winner: null,
        nextMatchId: null,
        prevMatch1Id: prevMatch1.id,
        prevMatch2Id: prevMatch2.id,
      };

      // Link previous matches to this one
      prevMatch1.nextMatchId = match.id;
      prevMatch2.nextMatchId = match.id;

      roundMatches.push(match);
      matches.push(match);
    }

    prevRoundMatches = roundMatches;
  }

  return matches;
}

// ============ MAIN GENERATION FUNCTIONS ============

/**
 * Generate a single elimination bracket
 */
export function generateSingleBracket(teams: BracketTeam[]): SingleBracket {
  if (teams.length < 2) {
    throw new Error("Need at least 2 teams for a bracket");
  }

  const bracketSize = getBracketSize(teams.length);
  const numRounds = getNumRounds(bracketSize);
  const seededTeams = seedTeamsInOrder(teams, bracketSize);
  const matches = generateMatchesForBracket(seededTeams, numRounds);

  return {
    teams,
    matches,
    numRounds,
    isDualBracket: false,
  };
}

/**
 * Apply team assignment strategy
 */
export function applyAssignment(
  teams: BracketTeam[],
  strategy: "random" | "alternate" | "half" | "manual"
): BracketTeam[] {
  if (strategy === "manual") {
    return teams;
  }

  if (strategy === "random") {
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    const halfPoint = Math.ceil(shuffled.length / 2);
    return teams.map((t) => {
      const shuffledIndex = shuffled.findIndex((s) => s.id === t.id);
      return {
        ...t,
        side: shuffledIndex < halfPoint ? "A" : "B",
      } as BracketTeam;
    });
  }

  if (strategy === "alternate") {
    return teams.map((t, i) => ({
      ...t,
      side: i % 2 === 0 ? "A" : "B",
    })) as BracketTeam[];
  }

  if (strategy === "half") {
    const halfPoint = Math.ceil(teams.length / 2);
    return teams.map((t, i) => ({
      ...t,
      side: i < halfPoint ? "A" : "B",
    })) as BracketTeam[];
  }

  return teams;
}

/**
 * Generate a dual (Pool Play) bracket
 */
export function generateDualBracket(
  teams: BracketTeam[],
  sharedFinal: boolean = true
): DualBracket {
  if (teams.length < 2) {
    throw new Error("Need at least 2 teams for a bracket");
  }

  // Separate teams by side
  const teamsA = teams.filter((t) => t.side === "A");
  const teamsB = teams.filter((t) => t.side === "B");

  // Handle case where no sides are assigned - split evenly
  if (teamsA.length === 0 && teamsB.length === 0) {
    const half = Math.ceil(teams.length / 2);
    teams.slice(0, half).forEach((t) => (t.side = "A"));
    teams.slice(half).forEach((t) => (t.side = "B"));
    return generateDualBracket(teams, sharedFinal);
  }

  // Generate bracket for each side
  const bracketSizeA = teamsA.length > 0 ? getBracketSize(teamsA.length) : 1;
  const bracketSizeB = teamsB.length > 0 ? getBracketSize(teamsB.length) : 1;
  const numRoundsA = teamsA.length > 1 ? getNumRounds(bracketSizeA) : 0;
  const numRoundsB = teamsB.length > 1 ? getNumRounds(bracketSizeB) : 0;

  const seededA = seedTeamsInOrder(teamsA, bracketSizeA);
  const seededB = seedTeamsInOrder(teamsB, bracketSizeB);

  const matchesA =
    teamsA.length > 1 ? generateMatchesForBracket(seededA, numRoundsA, 0) : [];
  const maxIdA =
    matchesA.length > 0 ? Math.max(...matchesA.map((m) => m.id)) : 0;
  const matchesB =
    teamsB.length > 1
      ? generateMatchesForBracket(seededB, numRoundsB, maxIdA)
      : [];
  const maxIdB =
    matchesB.length > 0 ? Math.max(...matchesB.map((m) => m.id)) : maxIdA;

  // Create grand final if shared
  let grandFinal: BracketMatch | null = null;
  if (sharedFinal) {
    grandFinal = {
      id: maxIdB + 1,
      round: Math.max(numRoundsA, numRoundsB) + 1,
      team1: null, // Winner of Side A
      team2: null, // Winner of Side B
      score1: null,
      score2: null,
      winner: null,
      nextMatchId: null,
      prevMatch1Id:
        matchesA.length > 0 ? matchesA[matchesA.length - 1].id : null,
      prevMatch2Id:
        matchesB.length > 0 ? matchesB[matchesB.length - 1].id : null,
    };

    // Link finals to grand final
    if (matchesA.length > 0) {
      matchesA[matchesA.length - 1].nextMatchId = grandFinal.id;
    }
    if (matchesB.length > 0) {
      matchesB[matchesB.length - 1].nextMatchId = grandFinal.id;
    }
  }

  return {
    teams,
    teamsA,
    teamsB,
    matchesA,
    matchesB,
    grandFinal,
    numRoundsA,
    numRoundsB,
    isDualBracket: true,
    hasSharedFinal: sharedFinal,
  };
}

/**
 * Update match result and propagate winner
 */
export function updateMatchResult(
  bracket: Bracket,
  matchId: number,
  score1: number,
  score2: number
): Bracket {
  const findAndUpdateMatch = (matches: BracketMatch[]): BracketMatch[] => {
    return matches.map((m) => {
      if (m.id === matchId) {
        const winner =
          score1 > score2 ? m.team1 : score2 > score1 ? m.team2 : null;
        return { ...m, score1, score2, winner };
      }
      return m;
    });
  };

  const propagateWinner = (
    matches: BracketMatch[],
    updatedMatchId: number
  ): BracketMatch[] => {
    const updatedMatch = matches.find((m) => m.id === updatedMatchId);
    if (!updatedMatch || !updatedMatch.winner || !updatedMatch.nextMatchId)
      return matches;

    return matches.map((m) => {
      if (m.id === updatedMatch.nextMatchId) {
        if (m.prevMatch1Id === updatedMatchId) {
          return { ...m, team1: updatedMatch.winner };
        } else if (m.prevMatch2Id === updatedMatchId) {
          return { ...m, team2: updatedMatch.winner };
        }
      }
      return m;
    });
  };

  if (bracket.isDualBracket) {
    const dual = bracket as DualBracket;
    let matchesA = findAndUpdateMatch(dual.matchesA);
    let matchesB = findAndUpdateMatch(dual.matchesB);
    let grandFinal = dual.grandFinal;

    // Propagate within sides
    matchesA = propagateWinner(matchesA, matchId);
    matchesB = propagateWinner(matchesB, matchId);

    // Propagate to grand final
    if (grandFinal) {
      const lastA = matchesA[matchesA.length - 1];
      const lastB = matchesB[matchesB.length - 1];
      grandFinal = {
        ...grandFinal,
        team1: lastA?.winner || grandFinal.team1,
        team2: lastB?.winner || grandFinal.team2,
      };

      // Update grand final score if this is the grand final match
      if (matchId === grandFinal.id) {
        const winner =
          score1 > score2
            ? grandFinal.team1
            : score2 > score1
            ? grandFinal.team2
            : null;
        grandFinal = { ...grandFinal, score1, score2, winner };
      }
    }

    return { ...dual, matchesA, matchesB, grandFinal };
  } else {
    const single = bracket as SingleBracket;
    let matches = findAndUpdateMatch(single.matches);
    matches = propagateWinner(matches, matchId);
    return { ...single, matches };
  }
}

/**
 * Clear bracket (return null)
 */
export function clearBracket(): null {
  return null;
}
