/**
 * Winners Court Logic Module
 * Handles skill-based court placement and round advancement.
 */

import { state, saveState } from "./state.js";

/**
 * Generate initial court placements based on player skill ratings.
 * Balances total skill per court.
 * @param {Array<{name: string, skill: number}>} players - Players with skill 1-10
 * @param {number} courtCount - Number of courts
 * @returns {Array<Object>} Court assignments
 */
export function generatePlacements(players, courtCount) {
  if (players.length < courtCount * 4) {
    throw new Error(
      `Need at least ${courtCount * 4} players for ${courtCount} courts`
    );
  }

  // Sort players by skill (highest first)
  const sorted = [...players].sort((a, b) => b.skill - a.skill);

  // Distribute to courts using snake draft to balance skill
  const courts = Array.from({ length: courtCount }, (_, i) => ({
    id: i + 1,
    players: [],
    totalSkill: 0,
  }));

  // Snake draft: 1,2,3,3,2,1,1,2,3...
  let direction = 1;
  let courtIndex = 0;

  sorted.forEach((player) => {
    courts[courtIndex].players.push(player);
    courts[courtIndex].totalSkill += player.skill;

    // Move to next court
    courtIndex += direction;

    // Bounce at ends
    if (courtIndex >= courtCount || courtIndex < 0) {
      direction *= -1;
      courtIndex += direction;
    }
  });

  return courts;
}

/**
 * Create teams for a court (2v2).
 * @param {Array<Object>} players - 4 players on the court
 * @param {boolean} twist - If true, use twist pairing
 * @param {number} round - Current round number
 * @returns {Object} teams: {team1: [p1, p2], team2: [p3, p4]}
 */
export function createTeams(players, twist = false, round = 1) {
  if (players.length < 4) return null;

  // For twist mode, rotate pairings each round
  if (twist) {
    const rotations = [
      [
        [0, 1],
        [2, 3],
      ], // Round 1: AB vs CD
      [
        [0, 2],
        [1, 3],
      ], // Round 2: AC vs BD
      [
        [0, 3],
        [1, 2],
      ], // Round 3: AD vs BC
    ];
    const rotationIndex = (round - 1) % 3;
    const [[a, b], [c, d]] = rotations[rotationIndex];

    return {
      team1: [players[a], players[b]],
      team2: [players[c], players[d]],
    };
  }

  // Default: first two vs last two
  return {
    team1: [players[0], players[1]],
    team2: [players[2], players[3]],
  };
}

/**
 * Advance to next round - winners move up, losers move down.
 * @param {Array<Object>} courts - Current court assignments with results
 * @param {boolean} twist - Whether to apply twist
 * @returns {Array<Object>} Updated court assignments
 */
export function advanceRound(courts, twist) {
  if (courts.length < 2) return courts;

  const newCourts = JSON.parse(JSON.stringify(courts));

  // Collect winners and losers from each court
  for (let i = 0; i < newCourts.length; i++) {
    const court = newCourts[i];

    if (court.winner === 1) {
      // Team 1 won - move player(s) up
      if (i > 0) {
        swapPlayers(newCourts, i, 0, i - 1, 2);
        swapPlayers(newCourts, i, 1, i - 1, 3);
      }
    } else if (court.winner === 2) {
      // Team 2 won - move player(s) down
      if (i < newCourts.length - 1) {
        swapPlayers(newCourts, i, 2, i + 1, 0);
        swapPlayers(newCourts, i, 3, i + 1, 1);
      }
    }

    // Reset result for new round
    court.winner = null;
    court.score1 = null;
    court.score2 = null;
  }

  return newCourts;
}

/**
 * Swap two players between courts.
 */
function swapPlayers(courts, court1Idx, player1Idx, court2Idx, player2Idx) {
  const temp = courts[court1Idx].players[player1Idx];
  courts[court1Idx].players[player1Idx] = courts[court2Idx].players[player2Idx];
  courts[court2Idx].players[player2Idx] = temp;
}

/**
 * Initialize Winners Court state with support for multiple sides.
 * @param {Object} playersBySide - { A: [...players], B: [...players] }
 * @param {Object} courtCountBySide - { A: number, B: number }
 * @param {boolean} twist - Whether to use twist mode
 */
export function initWinnersCourt(
  playersBySide,
  courtCountBySide,
  twist = false
) {
  const sides = {};

  for (const side of ["A", "B"]) {
    const players = playersBySide[side] || [];
    const courtCount = courtCountBySide[side] || 0;

    if (players.length >= 4 && courtCount > 0) {
      const courts = generatePlacements(players, courtCount);
      sides[side] = {
        players,
        courts,
        courtCount,
        twist,
        round: 1,
        history: [],
      };
    }
  }

  state.winnersCourt = {
    sides,
    twist,
  };

  saveState();
  return sides;
}

/**
 * Get current Winners Court state.
 */
export function getWinnersCourtState() {
  return state.winnersCourt || null;
}

/**
 * Clear Winners Court state.
 */
export function clearWinnersCourt() {
  state.winnersCourt = null;
  saveState();
}

/**
 * Record match result for a court on a specific side.
 * @param {string} side - 'A' or 'B'
 * @param {number} courtId - Court ID
 * @param {number} winningTeam - 1 or 2
 */
export function recordCourtResult(side, courtId, winningTeam, score1, score2) {
  if (!state.winnersCourt?.sides?.[side]) return false;

  const court = state.winnersCourt.sides[side].courts.find(
    (c) => c.id === courtId
  );
  if (!court) return false;

  court.winner = winningTeam;
  court.score1 = score1;
  court.score2 = score2;

  saveState();
  return true;
}

/**
 * Proceed to next round for a specific side.
 * @param {string} side - 'A' or 'B'
 */
export function nextRound(side) {
  if (!state.winnersCourt?.sides?.[side]) return null;

  const sideState = state.winnersCourt.sides[side];
  const { courts, twist } = sideState;

  // Check all matches are complete
  const incomplete = courts.filter((c) => c.winner == null);
  if (incomplete.length > 0) {
    return { error: "Complete all matches first" };
  }

  // Advance
  sideState.history = sideState.history || [];
  sideState.history.push({
    round: sideState.round,
    courts: JSON.parse(JSON.stringify(courts)),
  });

  sideState.courts = advanceRound(courts, twist);
  sideState.round++;

  saveState();
  return sideState.courts;
}

/**
 * Get history of previous rounds for a specific side.
 * @param {string} side - 'A' or 'B'
 */
export function getWinnersCourtHistory(side) {
  return state.winnersCourt?.sides?.[side]?.history || [];
}
