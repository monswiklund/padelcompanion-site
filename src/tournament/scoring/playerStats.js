/**
 * Player Stats Module
 * Handles updating and subtracting player statistics.
 */

import { state } from "../state.js";

/**
 * Update player stats after a match.
 * @param {number} playerId - Player ID
 * @param {number} pointsFor - Points scored
 * @param {number} pointsAgainst - Points conceded
 * @param {boolean} isWin - Whether player won
 * @param {boolean} isDraw - Whether match was a draw
 * @param {number|null} partnerId - Partner's ID (for tracking)
 */
export function updatePlayerStats(
  playerId,
  pointsFor,
  pointsAgainst,
  isWin,
  isDraw,
  partnerId = null
) {
  const player = state.leaderboard.find((p) => p.id === playerId);
  if (player) {
    player.points += pointsFor;
    player.played += 1;
    player.pointsLost = (player.pointsLost || 0) + pointsAgainst;

    if (isWin) player.wins = (player.wins || 0) + 1;
    else if (!isDraw) player.losses = (player.losses || 0) + 1;

    // Track partner for optimal pairing
    if (partnerId && !player.playedWith) {
      player.playedWith = [];
    }
    if (partnerId) {
      player.playedWith.push(partnerId);
    }
  }
}

/**
 * Subtract player stats (for editing rounds).
 * @param {number} playerId - Player ID
 * @param {number} pointsFor - Points scored
 * @param {number} pointsAgainst - Points conceded
 * @param {boolean} isWin - Whether player won
 * @param {boolean} isDraw - Whether match was a draw
 */
export function subtractPlayerStats(
  playerId,
  pointsFor,
  pointsAgainst,
  isWin,
  isDraw
) {
  const player = state.leaderboard.find((p) => p.id === playerId);
  if (player) {
    player.points -= pointsFor;
    player.played -= 1;
    player.pointsLost = (player.pointsLost || 0) - pointsAgainst;

    if (isWin) player.wins = (player.wins || 0) - 1;
    else if (!isDraw) player.losses = (player.losses || 0) - 1;

    // Clamp to zero
    if (player.played < 0) player.played = 0;
    if (player.points < 0) player.points = 0;
    if (player.wins < 0) player.wins = 0;
    if (player.losses < 0) player.losses = 0;
    if (player.pointsLost < 0) player.pointsLost = 0;
  }
}
