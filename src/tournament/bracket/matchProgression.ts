/**
 * Match Progression Module
 * Handles match result updates and downstream effects.
 */

import { state, saveState } from "../core/state";
import { getTeamById, BracketMatch, BracketTeam } from "./bracketGeneration";

/**
 * Update match result and advance winner.
 */
export function updateMatchResult(
  matchId: number,
  score1: number | null,
  score2: number | null
): void {
  if (!state.bracket?.matches) return;

  const match = (state.bracket.matches as BracketMatch[]).find(
    (m) => m.id === matchId
  );
  if (!match) return;

  if (match.completed) {
    resetDownstreamMatches(match);
  }

  match.score1 = score1;
  match.score2 = score2;

  if (score1 !== null && score2 !== null && score1 !== score2) {
    match.winnerId = score1 > score2 ? match.team1Id : match.team2Id;
    match.completed = true;

    if (match.nextMatchId) {
      const nextMatch = (state.bracket.matches as BracketMatch[]).find(
        (m) => m.id === match.nextMatchId
      );
      if (nextMatch && match.winnerId) {
        const winner = getTeamById(
          state.bracket.teams as BracketTeam[],
          match.winnerId
        );
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
 */
export function resetDownstreamMatches(match: BracketMatch): void {
  if (!match.nextMatchId || !state.bracket?.matches) return;

  const nextMatch = (state.bracket.matches as BracketMatch[]).find(
    (m) => m.id === match.nextMatchId
  );
  if (!nextMatch) return;

  if (nextMatch.prevMatch1Id === match.id) {
    nextMatch.team1Id = null;
    nextMatch.team1Name = null;
  } else {
    nextMatch.team2Id = null;
    nextMatch.team2Name = null;
  }

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
 */
export function getBracketRounds(): BracketMatch[][] {
  if (!state.bracket?.matches) return [];

  const rounds: BracketMatch[][] = [];
  const numRounds = (state.bracket as any).numRounds || 0;

  for (let r = 1; r <= numRounds; r++) {
    rounds.push(
      (state.bracket.matches as BracketMatch[])
        .filter((m) => m.round === r)
        .sort((a, b) => a.position - b.position)
    );
  }

  return rounds;
}

/**
 * Check if bracket is complete.
 */
export function isBracketComplete(): boolean {
  if (!state.bracket?.matches) return false;

  const numRounds = (state.bracket as any).numRounds || 0;
  const finalMatch = (state.bracket.matches as BracketMatch[]).find(
    (m) => m.round === numRounds
  );
  return finalMatch?.completed || false;
}

interface Standing {
  place: number;
  team: BracketTeam;
}

/**
 * Get final standings (1st, 2nd, 3rd/4th).
 */
export function getFinalStandings(): Standing[] {
  if (!state.bracket?.matches) return [];

  const standings: Standing[] = [];
  const numRounds = (state.bracket as any).numRounds || 0;
  const matches = state.bracket.matches as BracketMatch[];
  const teams = state.bracket.teams as BracketTeam[];

  const finalMatch = matches.find((m) => m.round === numRounds);

  if (finalMatch?.completed && finalMatch.winnerId) {
    const winner = getTeamById(teams, finalMatch.winnerId);
    if (winner) standings.push({ place: 1, team: winner });

    const loserId =
      finalMatch.winnerId === finalMatch.team1Id
        ? finalMatch.team2Id
        : finalMatch.team1Id;
    if (loserId) {
      const loser = getTeamById(teams, loserId);
      if (loser) standings.push({ place: 2, team: loser });
    }

    const semiFinals = matches.filter((m) => m.round === numRounds - 1);
    semiFinals.forEach((sf) => {
      if (sf.completed && sf.winnerId) {
        const sfLoserId = sf.winnerId === sf.team1Id ? sf.team2Id : sf.team1Id;
        if (sfLoserId) {
          const sfLoser = getTeamById(teams, sfLoserId);
          if (sfLoser && sfLoser.id !== loserId) {
            standings.push({ place: 3, team: sfLoser });
          }
        }
      }
    });
  }

  return standings;
}
