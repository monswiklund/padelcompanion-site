/**
 * Bracket Logic Module
 * Handles single elimination bracket generation and match progression.
 */

import { state, saveState } from "./state.js";

/**
 * Generate a single elimination bracket from teams.
 * @param {Array<{id: string, name: string}>} teams - Team list
 * @returns {Object} Bracket structure with rounds and matches
 */
export function generateBracket(teams) {
  if (!teams || teams.length < 2) {
    throw new Error("Need at least 2 teams for a bracket");
  }

  // Calculate bracket size (next power of 2)
  const bracketSize = Math.pow(2, Math.ceil(Math.log2(teams.length)));
  const numRounds = Math.log2(bracketSize);
  const numByes = bracketSize - teams.length;

  // Seed teams (simple seeding: top vs bottom)
  const seededTeams = seedTeams(teams, bracketSize);

  // Generate matches
  const matches = [];
  let matchId = 1;

  // First round matches
  const firstRoundMatches = [];
  for (let i = 0; i < bracketSize / 2; i++) {
    const team1 = seededTeams[i];
    const team2 = seededTeams[bracketSize - 1 - i];

    const match = {
      id: matchId++,
      round: 1,
      position: i,
      team1: team1 || null,
      team2: team2 || null,
      score1: null,
      score2: null,
      winner: null,
      nextMatchId: null,
    };

    // Handle byes - if one team is null, other advances
    if (team1 && !team2) {
      match.winner = team1.id;
      match.isBye = true;
    } else if (team2 && !team1) {
      match.winner = team2.id;
      match.isBye = true;
    }

    firstRoundMatches.push(match);
    matches.push(match);
  }

  // Generate subsequent rounds
  let prevRoundMatches = firstRoundMatches;
  for (let round = 2; round <= numRounds; round++) {
    const roundMatches = [];
    for (let i = 0; i < prevRoundMatches.length / 2; i++) {
      const match = {
        id: matchId++,
        round,
        position: i,
        team1: null,
        team2: null,
        score1: null,
        score2: null,
        winner: null,
        nextMatchId: null,
      };
      roundMatches.push(match);
      matches.push(match);

      // Link previous round matches to this one
      const prevMatch1 = prevRoundMatches[i * 2];
      const prevMatch2 = prevRoundMatches[i * 2 + 1];
      prevMatch1.nextMatchId = match.id;
      prevMatch2.nextMatchId = match.id;

      // If bye matches, advance winners immediately
      if (prevMatch1.winner) {
        match.team1 = getTeamById(seededTeams, prevMatch1.winner);
      }
      if (prevMatch2.winner) {
        match.team2 = getTeamById(seededTeams, prevMatch2.winner);
      }
    }
    prevRoundMatches = roundMatches;
  }

  return {
    teams: seededTeams.filter(Boolean),
    matches,
    numRounds,
    format: "single",
  };
}

/**
 * Seed teams for bracket based on side assignments (A = top half, B = bottom half).
 * Teams without side assignments are distributed evenly.
 */
function seedTeams(teams, bracketSize) {
  // Separate teams by side
  const sideA = teams.filter((t) => t.side === "A");
  const sideB = teams.filter((t) => t.side === "B");
  const unassigned = teams.filter(
    (t) => !t.side || (t.side !== "A" && t.side !== "B")
  );

  // Distribute unassigned teams evenly
  const unassignedHalf = Math.ceil(unassigned.length / 2);
  const topHalf = [...sideA, ...unassigned.slice(0, unassignedHalf)];
  const bottomHalf = [...sideB, ...unassigned.slice(unassignedHalf)];

  // Place top half in first positions, bottom half in last positions
  const halfSize = bracketSize / 2;
  const seeded = new Array(bracketSize).fill(null);

  // Top half fills from start
  topHalf.forEach((team, i) => {
    if (i < halfSize) seeded[i] = team;
  });

  // Bottom half fills from middle
  bottomHalf.forEach((team, i) => {
    if (halfSize + i < bracketSize) seeded[halfSize + i] = team;
  });

  return seeded;
}

/**
 * Get team by ID from teams array.
 */
function getTeamById(teams, id) {
  return teams.find((t) => t?.id === id) || null;
}

/**
 * Update match result and advance winner.
 * Resets downstream matches if re-editing a completed match.
 * @param {number} matchId - Match ID
 * @param {number} score1 - Team 1 score
 * @param {number} score2 - Team 2 score
 */
export function updateMatchResult(matchId, score1, score2) {
  const match = state.tournament.matches.find((m) => m.id === matchId);
  if (!match) return false;

  // If re-editing a match, reset downstream matches first
  if (match.winner != null) {
    resetDownstreamMatches(match);
  }

  match.score1 = score1;
  match.score2 = score2;

  // Determine winner
  if (score1 > score2) {
    match.winner = match.team1?.id;
  } else if (score2 > score1) {
    match.winner = match.team2?.id;
  } else {
    match.winner = null; // Tie - shouldn't happen in elimination
    return false;
  }

  // Advance winner to next match
  if (match.nextMatchId) {
    const nextMatch = state.tournament.matches.find(
      (m) => m.id === match.nextMatchId
    );
    if (nextMatch) {
      const winnerTeam =
        match.winner === match.team1?.id ? match.team1 : match.team2;

      // Find which slot in next match
      const prevMatches = state.tournament.matches.filter(
        (m) => m.nextMatchId === nextMatch.id
      );
      const isFirstFeeder = prevMatches[0]?.id === match.id;

      if (isFirstFeeder) {
        nextMatch.team1 = winnerTeam;
      } else {
        nextMatch.team2 = winnerTeam;
      }
    }
  }

  saveState();
  return true;
}

/**
 * Reset downstream matches when re-editing an earlier result.
 */
function resetDownstreamMatches(match) {
  if (!match.nextMatchId) return;

  const nextMatch = state.tournament.matches.find(
    (m) => m.id === match.nextMatchId
  );
  if (!nextMatch) return;

  // Find which slot this match feeds into
  const prevMatches = state.tournament.matches.filter(
    (m) => m.nextMatchId === nextMatch.id
  );
  const isFirstFeeder = prevMatches[0]?.id === match.id;

  // Clear the team slot
  if (isFirstFeeder) {
    nextMatch.team1 = null;
  } else {
    nextMatch.team2 = null;
  }

  // If next match had a result, reset it and recurse
  if (nextMatch.winner != null) {
    nextMatch.score1 = null;
    nextMatch.score2 = null;
    nextMatch.winner = null;
    resetDownstreamMatches(nextMatch);
  }
}

/**
 * Get matches organized by rounds.
 * @returns {Array<Array<Object>>} 2D array of matches per round
 */
export function getBracketRounds() {
  const matches = state.tournament.matches;
  if (!matches.length) return [];

  const numRounds = Math.max(...matches.map((m) => m.round));
  const rounds = [];

  for (let r = 1; r <= numRounds; r++) {
    rounds.push(
      matches
        .filter((m) => m.round === r)
        .sort((a, b) => a.position - b.position)
    );
  }

  return rounds;
}

/**
 * Get round name (Final, Semi-final, etc.)
 */
export function getRoundName(round, totalRounds) {
  const fromEnd = totalRounds - round;
  if (fromEnd === 0) return "Final";
  if (fromEnd === 1) return "Semi-Finals";
  if (fromEnd === 2) return "Quarter-Finals";
  return `Round ${round}`;
}

/**
 * Check if bracket is complete.
 */
export function isBracketComplete() {
  const matches = state.tournament.matches;
  if (!matches.length) return false;

  const finalMatch = matches.find(
    (m) => m.round === Math.max(...matches.map((x) => x.round))
  );
  return finalMatch?.winner != null;
}

/**
 * Get final standings (1st, 2nd, 3rd/4th).
 */
export function getFinalStandings() {
  const matches = state.tournament.matches;
  if (!matches.length) return [];

  const numRounds = Math.max(...matches.map((m) => m.round));
  const finalMatch = matches.find((m) => m.round === numRounds);
  const semiFinals = matches.filter((m) => m.round === numRounds - 1);

  const standings = [];

  // 1st place - winner of final
  if (finalMatch?.winner) {
    const winner =
      finalMatch.winner === finalMatch.team1?.id
        ? finalMatch.team1
        : finalMatch.team2;
    standings.push({ place: 1, team: winner });

    // 2nd place - loser of final
    const runnerUp =
      finalMatch.winner === finalMatch.team1?.id
        ? finalMatch.team2
        : finalMatch.team1;
    standings.push({ place: 2, team: runnerUp });
  }

  // 3rd/4th - losers of semi-finals
  semiFinals.forEach((sf) => {
    if (sf.winner) {
      const loser = sf.winner === sf.team1?.id ? sf.team2 : sf.team1;
      if (loser) {
        standings.push({ place: 3, team: loser });
      }
    }
  });

  return standings;
}

/**
 * Initialize bracket tournament with teams.
 * @param {Array<string|{name: string, side?: string}>} teamNames - Team names or objects
 */
export function initBracketTournament(teamNames) {
  const teams = teamNames.map((team, i) => {
    const name = typeof team === "string" ? team : team.name;
    const side = typeof team === "object" ? team.side : null;
    return {
      id: `team-${Date.now()}-${i}`,
      name: name.trim(),
      side: side, // Preserve side for seeding
    };
  });

  const bracket = generateBracket(teams);

  state.tournament = {
    format: "single",
    teams: bracket.teams,
    matches: bracket.matches,
    standings: [],
    meta: {
      name: "",
      notes: "",
      createdAt: new Date().toISOString(),
    },
  };

  saveState();
  return bracket;
}

/**
 * Clear bracket tournament.
 */
export function clearBracket() {
  state.tournament = {
    format: "single",
    teams: [],
    matches: [],
    standings: [],
    meta: { name: "", notes: "", createdAt: null },
  };
  saveState();
}

/**
 * Generate a dual bracket (Side A vs Side B with Grand Final).
 * @param {Array} teamsA - Side A teams
 * @param {Array} teamsB - Side B teams
 * @returns {Object} Dual bracket structure
 */
export function generateDualBracket(teamsA, teamsB) {
  // Generate separate brackets for each side
  const bracketA = generateBracket(teamsA);
  const bracketB = generateBracket(teamsB);

  // Offset match IDs for bracket B to avoid conflicts
  const maxIdA = Math.max(...bracketA.matches.map((m) => m.id));
  bracketB.matches.forEach((m) => {
    m.id += maxIdA;
    if (m.nextMatchId) m.nextMatchId += maxIdA;
    m.bracket = "B";
  });

  // Mark bracket A matches
  bracketA.matches.forEach((m) => {
    m.bracket = "A";
  });

  // Find finals of each bracket
  const finalA = bracketA.matches.find((m) => m.round === bracketA.numRounds);
  const finalB = bracketB.matches.find((m) => m.round === bracketB.numRounds);

  // Create grand final match
  const grandFinalId =
    maxIdA + Math.max(...bracketB.matches.map((m) => m.id)) + 1;
  const grandFinal = {
    id: grandFinalId,
    round: Math.max(bracketA.numRounds, bracketB.numRounds) + 1,
    position: 0,
    team1: null,
    team2: null,
    score1: null,
    score2: null,
    winner: null,
    nextMatchId: null,
    bracket: "FINAL",
    isGrandFinal: true,
  };

  // Link finals to grand final
  finalA.nextMatchId = grandFinalId;
  finalB.nextMatchId = grandFinalId;

  // Combine all matches
  const allMatches = [...bracketA.matches, ...bracketB.matches, grandFinal];
  const allTeams = [...bracketA.teams, ...bracketB.teams];

  return {
    teams: allTeams,
    teamsA: bracketA.teams,
    teamsB: bracketB.teams,
    matches: allMatches,
    matchesA: bracketA.matches,
    matchesB: bracketB.matches,
    grandFinal,
    numRoundsA: bracketA.numRounds,
    numRoundsB: bracketB.numRounds,
    format: "dual",
  };
}

/**
 * Initialize a dual bracket tournament.
 * @param {Array} teamNames - Team objects with name and side
 * @param {boolean} sharedFinal - Whether to have a shared grand final
 */
export function initDualBracketTournament(teamNames, sharedFinal = true) {
  // Convert to team objects with IDs
  const teams = teamNames.map((team, i) => {
    const name = typeof team === "string" ? team : team.name;
    const side = typeof team === "object" ? team.side : null;
    return {
      id: `team-${Date.now()}-${i}`,
      name: name.trim(),
      side: side,
    };
  });

  // Split teams by side
  const teamsA = teams.filter((t) => t.side === "A");
  const teamsB = teams.filter((t) => t.side === "B");
  const unassigned = teams.filter(
    (t) => !t.side || (t.side !== "A" && t.side !== "B")
  );

  // Distribute unassigned teams evenly
  const halfUnassigned = Math.ceil(unassigned.length / 2);
  const finalTeamsA = [...teamsA, ...unassigned.slice(0, halfUnassigned)];
  const finalTeamsB = [...teamsB, ...unassigned.slice(halfUnassigned)];

  // Ensure minimum teams on each side
  if (finalTeamsA.length < 2 || finalTeamsB.length < 2) {
    throw new Error("Need at least 2 teams on each side for dual bracket");
  }

  const bracket = generateDualBracket(finalTeamsA, finalTeamsB);

  state.tournament = {
    format: "dual",
    teams: bracket.teams,
    teamsA: bracket.teamsA,
    teamsB: bracket.teamsB,
    matches: bracket.matches,
    matchesA: bracket.matchesA,
    matchesB: bracket.matchesB,
    grandFinal: bracket.grandFinal,
    numRoundsA: bracket.numRoundsA,
    numRoundsB: bracket.numRoundsB,
    sharedFinal,
    standings: [],
    meta: {
      name: "",
      notes: "",
      createdAt: new Date().toISOString(),
    },
  };

  saveState();
  return bracket;
}
