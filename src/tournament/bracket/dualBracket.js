/**
 * Dual Bracket Module
 * Handles Side A vs Side B bracket generation.
 */

import { state, saveState } from "../core/state.js";
import { generateBracket } from "./bracketGeneration.js";

/**
 * Generate a dual bracket (Side A vs Side B with Grand Final).
 * @param {Array} teamsA - Side A teams
 * @param {Array} teamsB - Side B teams
 * @returns {Object} Dual bracket structure
 */
export function generateDualBracket(teamsA, teamsB) {
  const bracketA = generateBracket(teamsA);
  const bracketB = generateBracket(teamsB);

  // Offset bracketB match IDs
  const maxIdA = Math.max(...bracketA.matches.map((m) => m.id));
  bracketB.matches.forEach((m) => {
    m.id += maxIdA;
    if (m.nextMatchId) m.nextMatchId += maxIdA;
    if (m.prevMatch1Id) m.prevMatch1Id += maxIdA;
    if (m.prevMatch2Id) m.prevMatch2Id += maxIdA;
  });

  // Create grand final match
  const grandFinal = {
    id: maxIdA + bracketB.matches.length + 1,
    round: Math.max(bracketA.numRounds, bracketB.numRounds) + 1,
    position: 0,
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
    isGrandFinal: true,
    prevBracketAFinalId: bracketA.matches[bracketA.matches.length - 1].id,
    prevBracketBFinalId: bracketB.matches[bracketB.matches.length - 1].id,
  };

  // Link finals to grand final
  bracketA.matches[bracketA.matches.length - 1].nextMatchId = grandFinal.id;
  bracketB.matches[bracketB.matches.length - 1].nextMatchId = grandFinal.id;

  return {
    bracketA,
    bracketB,
    grandFinal,
    teams: [...teamsA, ...teamsB],
    matches: [...bracketA.matches, ...bracketB.matches, grandFinal],
    numRoundsA: bracketA.numRounds,
    numRoundsB: bracketB.numRounds,
    isDualBracket: true,
  };
}

/**
 * Initialize bracket tournament with teams.
 * @param {Array} teamNames - Team names or objects
 */
export function initBracketTournament(teamNames) {
  const teams = teamNames.map((t, i) => {
    if (typeof t === "string") {
      return { id: `team-${i}`, name: t };
    }
    return { id: t.id || `team-${i}`, name: t.name, side: t.side };
  });

  state.bracket = generateBracket(teams);
  state.bracketFormat = "single";
  saveState();
}

/**
 * Initialize a dual bracket tournament.
 * @param {Array} teamNames - Team objects with name and side
 * @param {boolean} sharedFinal - Whether to have a shared grand final
 */
export function initDualBracketTournament(teamNames, sharedFinal = true) {
  const teams = teamNames.map((t, i) => ({
    id: t.id || `team-${i}`,
    name: t.name,
    side: t.side || (i < teamNames.length / 2 ? "A" : "B"),
  }));

  const teamsA = teams.filter((t) => t.side === "A");
  const teamsB = teams.filter((t) => t.side === "B");

  if (sharedFinal) {
    state.bracket = generateDualBracket(teamsA, teamsB);
  } else {
    // Separate brackets without grand final
    const bracketA = generateBracket(teamsA);
    const bracketB = generateBracket(teamsB);

    const maxIdA = Math.max(...bracketA.matches.map((m) => m.id));
    bracketB.matches.forEach((m) => {
      m.id += maxIdA;
      if (m.nextMatchId) m.nextMatchId += maxIdA;
      if (m.prevMatch1Id) m.prevMatch1Id += maxIdA;
      if (m.prevMatch2Id) m.prevMatch2Id += maxIdA;
    });

    state.bracket = {
      bracketA,
      bracketB,
      teams,
      matches: [...bracketA.matches, ...bracketB.matches],
      numRoundsA: bracketA.numRounds,
      numRoundsB: bracketB.numRounds,
      isDualBracket: true,
      hasSharedFinal: false,
    };
  }

  state.bracketFormat = "dual";
  saveState();
}

/**
 * Clear bracket tournament.
 */
export function clearBracket() {
  state.bracket = null;
  state.bracketFormat = null;
  state.bracketTeams = [];
  saveState();
}
