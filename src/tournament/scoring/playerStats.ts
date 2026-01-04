/**
 * Player Stats Module
 * Handles updating and subtracting player statistics.
 */

import { state } from "../core/state";

interface LeaderboardPlayer {
  id: string | number;
  name: string;
  points: number;
  played: number;
  pointsLost: number;
  wins: number;
  losses: number;
  playedWith?: (string | number)[];
}

/**
 * Update player stats after a match.
 */
export function updatePlayerStats(
  playerId: string | number,
  pointsFor: number,
  pointsAgainst: number,
  isWin: boolean,
  isDraw: boolean,
  partnerId: string | number | null = null
): void {
  const player = state.leaderboard.find(
    (p: LeaderboardPlayer) => p.id === playerId
  );
  if (player) {
    player.points += pointsFor;
    player.played += 1;
    player.pointsLost = (player.pointsLost || 0) + pointsAgainst;

    if (isWin) player.wins = (player.wins || 0) + 1;
    else if (!isDraw) player.losses = (player.losses || 0) + 1;

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
 */
export function subtractPlayerStats(
  playerId: string | number,
  pointsFor: number,
  pointsAgainst: number,
  isWin: boolean,
  isDraw: boolean
): void {
  const player = state.leaderboard.find(
    (p: LeaderboardPlayer) => p.id === playerId
  );
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
