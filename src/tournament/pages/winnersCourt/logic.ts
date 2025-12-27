/**
 * Winners Court Logic
 * Handles initialization, scoring, and round progression for Winners Court mode.
 */

import {
  state,
  saveState,
  WCPlayer,
  WCCourt,
  WCSideState,
  WinnersCourtState,
} from "../../core/state";

/**
 * Initialize Winners Court from player lists.
 */
export function initWinnersCourt(
  playersBySide: { A: WCPlayer[]; B: WCPlayer[] },
  courtCountBySide: { A: number; B: number },
  twist: boolean
): void {
  const sides: Record<string, WCSideState> = {};

  for (const sideKey of ["A", "B"] as const) {
    const players = [...playersBySide[sideKey]];
    const courtCount = courtCountBySide[sideKey];

    if (players.length < 4 || courtCount < 1) continue;

    // Shuffle players initially
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }

    // Create courts
    const courts: WCCourt[] = [];
    let playerIdx = 0;

    for (let c = 0; c < courtCount; c++) {
      const team1 = [players[playerIdx++], players[playerIdx++]];
      const team2 = [players[playerIdx++], players[playerIdx++]];

      courts.push({
        id: c + 1,
        team1,
        team2,
        score1: 0,
        score2: 0,
        winner: null,
      });
    }

    // Remaining players go to queue
    const queue = players.slice(playerIdx);

    sides[sideKey] = {
      courts,
      queue,
      round: 1,
      history: [],
    };
  }

  state.winnersCourt = { sides, twist };
  saveState();
}

/**
 * Record a court result (winner = 1 or 2).
 */
export function recordCourtResult(
  side: string,
  courtIndex: number,
  winner: 1 | 2
): void {
  const wc = state.winnersCourt;
  if (!wc?.sides[side]) return;

  const court = wc.sides[side].courts[courtIndex];
  if (!court) return;

  court.winner = winner;
  saveState();
}

/**
 * Check if all courts in a side have results.
 */
export function allCourtsComplete(side: string): boolean {
  const wc = state.winnersCourt;
  if (!wc?.sides[side]) return false;

  return wc.sides[side].courts.every((c) => c.winner !== null);
}

/**
 * Advance to the next round (winners move up, losers move down).
 */
export function nextRound(side: string): { error?: string } | void {
  const wc = state.winnersCourt;
  if (!wc?.sides[side]) return { error: "Side not found" };

  const sideState = wc.sides[side];

  // Check all courts complete
  if (!allCourtsComplete(side)) {
    return { error: "Not all courts have results" };
  }

  // Collect winners and losers
  const winners: WCPlayer[] = [];
  const losers: WCPlayer[] = [];

  sideState.courts.forEach((court) => {
    if (court.winner === 1) {
      winners.push(...court.team1);
      losers.push(...court.team2);
    } else {
      winners.push(...court.team2);
      losers.push(...court.team1);
    }
  });

  // Save history
  sideState.history.push({
    round: sideState.round,
    courts: JSON.parse(JSON.stringify(sideState.courts)),
  });

  // Promote winners to top court, demote losers
  const allPlayers = [...winners, ...sideState.queue, ...losers];
  const courtCount = sideState.courts.length;

  // Rebuild courts
  const newCourts: WCCourt[] = [];
  let pIdx = 0;

  for (let c = 0; c < courtCount; c++) {
    newCourts.push({
      id: c + 1,
      team1: [allPlayers[pIdx++], allPlayers[pIdx++]],
      team2: [allPlayers[pIdx++], allPlayers[pIdx++]],
      score1: 0,
      score2: 0,
      winner: null,
    });
  }

  sideState.courts = newCourts;
  sideState.queue = allPlayers.slice(pIdx);
  sideState.round++;

  saveState();
}

/**
 * Clear Winners Court state.
 */
export function clearWinnersCourt(): void {
  state.winnersCourt = null;
  saveState();
}
