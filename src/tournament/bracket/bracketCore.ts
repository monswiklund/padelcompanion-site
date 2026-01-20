/**
 * Pure bracket generation functions
 * No state mutation - returns data only
 */

// ============ TYPES ============

export interface BracketTeam {
  id: string;
  name: string;
  side?: string;
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
  loserMatchId?: number | null; // For double elimination
}

export interface Pool {
  id: string;
  name: string;
  teams: BracketTeam[];
  matches: BracketMatch[];
  numRounds: number;
}

export interface MultiBracket {
  pools: Pool[];
  grandFinal: BracketMatch | null;
  isMultiPool: true;
  hasSharedFinal: boolean;
}

export interface DoubleEliminationBracket {
  winnersMatches: BracketMatch[];
  losersMatches: BracketMatch[];
  grandFinal: BracketMatch;
  teams: BracketTeam[];
  isDoubleElimination: true;
}

export interface BracketConfig {
  scoreType: "points" | "games" | "sets";
  mode: "teams" | "players";
  eliminationType: "single" | "double";
  poolCount?: number;
}

export type Bracket =
  | SingleBracket
  | DualBracket
  | MultiBracket
  | DoubleEliminationBracket;

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
  bracketSize: number,
): (BracketTeam | null)[] {
  const seeded: (BracketTeam | null)[] = new Array(bracketSize).fill(null);
  teams.forEach((team, i) => {
    if (i < bracketSize) seeded[i] = team;
  });
  return seeded;
}

/**
 * Auto-advance a match if it has a bye
 */
function autoAdvanceMatch(match: BracketMatch): BracketMatch {
  if (match.team1 && !match.team2) {
    return { ...match, winner: match.team1 };
  } else if (!match.team1 && match.team2) {
    return { ...match, winner: match.team2 };
  }
  return match;
}

/**
 * Generate matches for a single bracket
 */
function generateMatchesForBracket(
  seededTeams: (BracketTeam | null)[],
  numRounds: number,
  idOffset: number = 0,
): BracketMatch[] {
  const matches: BracketMatch[] = [];
  let matchId = 1 + idOffset;

  // Create first round matches
  const firstRoundMatchCount = seededTeams.length / 2;
  const firstRoundMatches: BracketMatch[] = [];

  for (let i = 0; i < firstRoundMatchCount; i++) {
    let match: BracketMatch = {
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

    match = autoAdvanceMatch(match);
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

      let match: BracketMatch = {
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

      match = autoAdvanceMatch(match);
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
 * Generate a multi-pool bracket
 */
export function generateMultiPoolBracket(
  teams: BracketTeam[],
  poolCount: number,
  sharedFinal: boolean = true,
): MultiBracket {
  const pools: Pool[] = [];
  let currentIdOffset = 0;

  for (let i = 0; i < poolCount; i++) {
    const poolLabel = String.fromCharCode(65 + i);
    const poolTeams = teams.filter((t) => t.side === poolLabel);

    if (poolTeams.length > 0) {
      const bracketSize = getBracketSize(poolTeams.length);
      const numRounds = getNumRounds(bracketSize);
      const seeded = seedTeamsInOrder(poolTeams, bracketSize);
      const matches = generateMatchesForBracket(
        seeded,
        numRounds,
        currentIdOffset,
      );

      pools.push({
        id: `pool-${poolLabel}`,
        name: `Pool ${poolLabel}`,
        teams: poolTeams,
        matches,
        numRounds,
      });

      if (matches.length > 0) {
        currentIdOffset = Math.max(...matches.map((m) => m.id));
      }
    }
  }

  let grandFinal: BracketMatch | null = null;
  if (sharedFinal && pools.length >= 2) {
    const lastMatchA = pools[0].matches[pools[0].matches.length - 1];
    const lastMatchB = pools[1].matches[pools[1].matches.length - 1];

    if (lastMatchA && lastMatchB) {
      grandFinal = {
        id: currentIdOffset + 1,
        round: Math.max(pools[0].numRounds, pools[1].numRounds) + 1,
        team1: null,
        team2: null,
        score1: null,
        score2: null,
        winner: null,
        nextMatchId: null,
        prevMatch1Id: lastMatchA.id,
        prevMatch2Id: lastMatchB.id,
      };

      lastMatchA.nextMatchId = grandFinal.id;
      lastMatchB.nextMatchId = grandFinal.id;
    }
  }

  return {
    pools,
    grandFinal,
    isMultiPool: true,
    hasSharedFinal: sharedFinal,
  };
}

/**
 * Apply team assignment strategy to N pools
 */
export function applyAssignment(
  teams: BracketTeam[],
  strategy: "random" | "alternate" | "half" | "manual",
  poolCount: number = 2,
): BracketTeam[] {
  if (strategy === "manual" || poolCount < 1) {
    return teams;
  }

  const getSideLabel = (index: number) => String.fromCharCode(65 + index); // 0 -> A, 1 -> B, etc

  if (strategy === "random") {
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    const teamsPerPool = Math.ceil(shuffled.length / poolCount);

    return teams.map((t) => {
      const shuffledIndex = shuffled.findIndex((s) => s.id === t.id);
      const poolIndex = Math.min(
        Math.floor(shuffledIndex / teamsPerPool),
        poolCount - 1,
      );
      return { ...t, side: getSideLabel(poolIndex) };
    });
  }

  if (strategy === "alternate") {
    return teams.map((t, i) => ({
      ...t,
      side: getSideLabel(i % poolCount),
    }));
  }

  if (strategy === "half") {
    const teamsPerPool = Math.ceil(teams.length / poolCount);
    return teams.map((t, i) => ({
      ...t,
      side: getSideLabel(Math.min(Math.floor(i / teamsPerPool), poolCount - 1)),
    }));
  }

  return teams;
}

/**
 * Generate a dual (Pool Play) bracket
 */
export function generateDualBracket(
  teams: BracketTeam[],
  sharedFinal: boolean = true,
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
  score2: number,
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
    updatedMatchId: number,
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

  if ((bracket as any).isMultiPool) {
    const multi = bracket as MultiBracket;
    let grandFinal = multi.grandFinal;
    const pools = multi.pools.map((pool) => {
      let matches = findAndUpdateMatch(pool.matches);
      matches = propagateWinner(matches, matchId);
      return { ...pool, matches };
    });

    // Propagate to grand final
    if (grandFinal) {
      // Find which pool final updated
      pools.forEach((pool, idx) => {
        const lastMatch = pool.matches[pool.matches.length - 1];
        if (lastMatch && lastMatch.winner) {
          if (grandFinal!.prevMatch1Id === lastMatch.id) {
            grandFinal = { ...grandFinal!, team1: lastMatch.winner };
          } else if (grandFinal!.prevMatch2Id === lastMatch.id) {
            grandFinal = { ...grandFinal!, team2: lastMatch.winner };
          }
        }
      });

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

    return { ...multi, pools, grandFinal };
  }

  if ((bracket as any).isDoubleElimination) {
    const de = bracket as DoubleEliminationBracket;
    let winnersMatches = findAndUpdateMatch(de.winnersMatches);
    let losersMatches = findAndUpdateMatch(de.losersMatches);

    // Propagate Winners in Winners Bracket
    winnersMatches = propagateWinner(winnersMatches, matchId);
    // Propagate Winners in Losers Bracket
    losersMatches = propagateWinner(losersMatches, matchId);

    // -- Handle Loser Propagation from Winners to Losers --
    const updatedWinnerMatch = winnersMatches.find((m) => m.id === matchId);
    if (updatedWinnerMatch && updatedWinnerMatch.loserMatchId) {
      const loser =
        score1 < score2
          ? updatedWinnerMatch.team1
          : score2 < score1
            ? updatedWinnerMatch.team2
            : null;
      if (loser) {
        losersMatches = losersMatches.map((lm) => {
          if (lm.id === updatedWinnerMatch.loserMatchId) {
            // Check if team1 is empty and doesn't have a winner-source
            // Standard generateMatchesForBracket doesn't set prevMatchId for losers-bracket start
            if (lm.prevMatch1Id === null && lm.team1 === null) {
              return { ...lm, team1: loser };
            } else {
              return { ...lm, team2: loser };
            }
          }
          return lm;
        });
      }
    }

    let grandFinal = de.grandFinal;
    const lastWinnerMatch = winnersMatches[winnersMatches.length - 1];
    const lastLoserMatch =
      losersMatches.length > 0 ? losersMatches[losersMatches.length - 1] : null;

    if (lastWinnerMatch && lastWinnerMatch.winner) {
      grandFinal = { ...grandFinal, team1: lastWinnerMatch.winner };
    }
    if (lastLoserMatch && lastLoserMatch.winner) {
      grandFinal = { ...grandFinal, team2: lastLoserMatch.winner };
    }

    if (matchId === grandFinal.id) {
      const winner =
        score1 > score2
          ? grandFinal.team1
          : score2 > score1
            ? grandFinal.team2
            : null;
      grandFinal = { ...grandFinal, score1, score2, winner };
    }

    return { ...de, winnersMatches, losersMatches, grandFinal };
  }

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
 * Generate a double elimination bracket
 */
export function generateDoubleEliminationBracket(
  teams: BracketTeam[],
): DoubleEliminationBracket {
  if (teams.length < 2) {
    throw new Error("Need at least 2 teams for a bracket");
  }

  const bracketSize = getBracketSize(teams.length);
  const numWinnersRounds = getNumRounds(bracketSize);
  const seeded = seedTeamsInOrder(teams, bracketSize);

  // 1. Generate Winners Bracket
  const winnersMatches = generateMatchesForBracket(seeded, numWinnersRounds, 0);
  let currentIdOffset = Math.max(...winnersMatches.map((m) => m.id));

  // 2. Generate Losers Bracket
  // Pattern:
  // LR1: WR1 losers (Match count: winnersMatchesPerRound[0] / 2)
  // LR2: (Winners of LR1) vs (Losers of WR2)
  // LR3: (Winners of LR2) against each other
  // LR4: (Winners of LR3) vs (Losers of WR3)
  // ...

  const losersMatches: BracketMatch[] = [];
  const winnersMatchesPerRound: BracketMatch[][] = [];
  for (let r = 1; r <= numWinnersRounds; r++) {
    winnersMatchesPerRound.push(winnersMatches.filter((m) => m.round === r));
  }

  let prevLoserRoundMatches: BracketMatch[] = [];
  let loserRound = 1;

  // -- LR1: Losers from Winners R1 --
  const wr1Matches = winnersMatchesPerRound[0];
  const lr1MatchCount = wr1Matches.length / 2;

  if (lr1MatchCount > 0) {
    for (let i = 0; i < lr1MatchCount; i++) {
      const match: BracketMatch = {
        id: ++currentIdOffset,
        round: loserRound,
        team1: null, // From WR1 match i*2 loser
        team2: null, // From WR1 match i*2+1 loser
        score1: null,
        score2: null,
        winner: null,
        nextMatchId: null,
        prevMatch1Id: null,
        prevMatch2Id: null,
      };
      // Link losers
      wr1Matches[i * 2].loserMatchId = match.id;
      wr1Matches[i * 2 + 1].loserMatchId = match.id;
      losersMatches.push(match);
      prevLoserRoundMatches.push(match);
    }
    loserRound++;
  } else if (wr1Matches.length === 1) {
    // Special case for 2 teams: WR1 has 1 match.
    // Loser of WR1 goes straight to some "Final losers" match?
    // Actually 2 teams double-elim is just WR1 -> Final.
  }

  // -- Subsequent Loser Rounds (LR2 to L_2n-2) --
  for (let wrr = 2; wrr <= numWinnersRounds; wrr++) {
    // Major Round: Winners of prev LR vs Losers of current WR
    const currentWRMatches = winnersMatchesPerRound[wrr - 1]; // wrr is 2, 3... index is 1, 2...
    if (currentWRMatches.length === 0) break;

    const majorMatches: BracketMatch[] = [];
    for (let i = 0; i < currentWRMatches.length; i++) {
      const prevMatch = prevLoserRoundMatches[i];
      const match: BracketMatch = {
        id: ++currentIdOffset,
        round: loserRound,
        team1: null, // From prevMatch winner
        team2: null, // From currentWRMatches[i] loser
        score1: null,
        score2: null,
        winner: null,
        nextMatchId: null,
        prevMatch1Id: prevMatch ? prevMatch.id : null,
        prevMatch2Id: null, // Will be linked via loserMatchId on the WR match
      };

      if (prevMatch) prevMatch.nextMatchId = match.id;
      currentWRMatches[i].loserMatchId = match.id;

      losersMatches.push(match);
      majorMatches.push(match);
    }
    prevLoserRoundMatches = majorMatches;
    loserRound++;

    // Minor Round (if not final): Winners of prev major round vs each other
    if (prevLoserRoundMatches.length > 1) {
      const minorMatches: BracketMatch[] = [];
      for (let i = 0; i < prevLoserRoundMatches.length / 2; i++) {
        const m1 = prevLoserRoundMatches[i * 2];
        const m2 = prevLoserRoundMatches[i * 2 + 1];
        const match: BracketMatch = {
          id: ++currentIdOffset,
          round: loserRound,
          team1: null,
          team2: null,
          score1: null,
          score2: null,
          winner: null,
          nextMatchId: null,
          prevMatch1Id: m1.id,
          prevMatch2Id: m2.id,
        };
        m1.nextMatchId = match.id;
        m2.nextMatchId = match.id;
        losersMatches.push(match);
        minorMatches.push(match);
      }
      prevLoserRoundMatches = minorMatches;
      loserRound++;
    }
  }

  // 3. Grand Final
  const winnersFinal = winnersMatches[winnersMatches.length - 1];
  const losersFinal =
    losersMatches.length > 0 ? losersMatches[losersMatches.length - 1] : null;

  const grandFinal: BracketMatch = {
    id: ++currentIdOffset,
    round: Math.max(numWinnersRounds, losersFinal ? losersFinal.round : 0) + 1,
    team1: null, // Winners Final winner
    team2: null, // Losers Final winner
    score1: null,
    score2: null,
    winner: null,
    nextMatchId: null,
    prevMatch1Id: winnersFinal.id,
    prevMatch2Id: losersFinal ? losersFinal.id : null,
  };

  winnersFinal.nextMatchId = grandFinal.id;
  if (losersFinal) losersFinal.nextMatchId = grandFinal.id;

  return {
    winnersMatches,
    losersMatches,
    grandFinal,
    teams,
    isDoubleElimination: true,
  };
}

/**
 * Clear bracket (return null)
 */
export function clearBracket(): null {
  return null;
}
