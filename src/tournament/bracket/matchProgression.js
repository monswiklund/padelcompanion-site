/**
 * Match Progression Module
 * Handles match result updates and downstream effects.
 */

import { state, saveState } from "../core/state.js";
import { getTeamById } from "./bracketGeneration.js";

/**
 * Update match result and advance winner.
 * @param {number} matchId - Match ID
 * @param {number} score1 - Team 1 score
 * @param {number} score2 - Team 2 score
 */
export function updateMatchResult(matchId, score1, score2) {
  if (!state.bracket?.matches) return;

  const match = state.bracket.matches.find((m) => m.id === matchId);
  if (!match) return;

  // If re-editing a completed match, reset downstream
  if (match.completed) {
    resetDownstreamMatches(match);
  }

  match.score1 = score1;
  match.score2 = score2;

  // Determine winner
  if (score1 !== null && score2 !== null && score1 !== score2) {
    match.winnerId = score1 > score2 ? match.team1Id : match.team2Id;
    match.completed = true;

    // Advance winner
    if (match.nextMatchId) {
      const nextMatch = state.bracket.matches.find(
        (m) => m.id === match.nextMatchId
      );
      if (nextMatch) {
        const winner = getTeamById(state.bracket.teams, match.winnerId);
        if (winner) {
          if (nextMatch.prevMatch1Id === match.id) {
            nextMatch.team1Id = winner.id;
            nextMatch.team1Name = winner.name;
          } else {
            nextMatch.team2Id = winner.id;
            nextMatch.team2Name = winner.name;
          }
        }
      }
    }
  } else {
    match.winnerId = null;
    match.completed = false;
  }

  saveState();
}

/**
 * Reset downstream matches when re-editing an earlier result.
 * @param {Object} match - The match being edited
 */
export function resetDownstreamMatches(match) {
  if (!match.nextMatchId || !state.bracket?.matches) return;

  const nextMatch = state.bracket.matches.find(
    (m) => m.id === match.nextMatchId
  );
  if (!nextMatch) return;

  // Clear this team's slot
  if (nextMatch.prevMatch1Id === match.id) {
    nextMatch.team1Id = null;
    nextMatch.team1Name = null;
  } else {
    nextMatch.team2Id = null;
    nextMatch.team2Name = null;
  }

  // If next match was completed, recursively reset
  if (nextMatch.completed) {
    nextMatch.score1 = null;
    nextMatch.score2 = null;
    nextMatch.winnerId = null;
    nextMatch.completed = false;
    resetDownstreamMatches(nextMatch);
  }
}

/**
 * Get matches organized by rounds.
 * @returns {Array<Array<Object>>} 2D array of matches per round
 */
export function getBracketRounds() {
  if (!state.bracket?.matches) return [];

  const rounds = [];
  const numRounds = state.bracket.numRounds;

  for (let r = 1; r <= numRounds; r++) {
    rounds.push(
      state.bracket.matches
        .filter((m) => m.round === r)
        .sort((a, b) => a.position - b.position)
    );
  }

  return rounds;
}

/**
 * Check if bracket is complete.
 * @returns {boolean} True if final match is complete
 */
export function isBracketComplete() {
  if (!state.bracket?.matches) return false;

  const finalMatch = state.bracket.matches.find(
    (m) => m.round === state.bracket.numRounds
  );
  return finalMatch?.completed || false;
}

/**
 * Get final standings (1st, 2nd, 3rd/4th).
 * @returns {Array} Standings array
 */
export function getFinalStandings() {
  if (!state.bracket?.matches) return [];

  const standings = [];
  const finalMatch = state.bracket.matches.find(
    (m) => m.round === state.bracket.numRounds
  );

  if (finalMatch?.completed) {
    // 1st place
    const winner = getTeamById(state.bracket.teams, finalMatch.winnerId);
    if (winner) standings.push({ place: 1, team: winner });

    // 2nd place
    const loserId =
      finalMatch.winnerId === finalMatch.team1Id
        ? finalMatch.team2Id
        : finalMatch.team1Id;
    const loser = getTeamById(state.bracket.teams, loserId);
    if (loser) standings.push({ place: 2, team: loser });

    // 3rd/4th from semi-finals
    const semiFinals = state.bracket.matches.filter(
      (m) => m.round === state.bracket.numRounds - 1
    );
    semiFinals.forEach((sf) => {
      if (sf.completed) {
        const sfLoserId = sf.winnerId === sf.team1Id ? sf.team2Id : sf.team1Id;
        const sfLoser = getTeamById(state.bracket.teams, sfLoserId);
        if (sfLoser && sfLoser.id !== loserId) {
          standings.push({ place: 3, team: sfLoser });
        }
      }
    });
  }

  return standings;
}
