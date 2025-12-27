/**
 * Dual Bracket Module
 * Handles Side A vs Side B bracket generation.
 */

import { state, saveState } from "../core/state";
import {
  generateBracket,
  Bracket,
  BracketMatch,
  BracketTeam,
} from "./bracketGeneration";

interface GrandFinalMatch extends BracketMatch {
  isGrandFinal: boolean;
  prevBracketAFinalId: number;
  prevBracketBFinalId: number;
}

interface DualBracket {
  bracketA: Bracket;
  bracketB: Bracket;
  grandFinal: GrandFinalMatch;
  teams: BracketTeam[];
  matches: BracketMatch[];
  numRoundsA: number;
  numRoundsB: number;
  isDualBracket: boolean;
}

/**
 * Generate a dual bracket (Side A vs Side B with Grand Final).
 */
export function generateDualBracket(
  teamsA: BracketTeam[],
  teamsB: BracketTeam[]
): DualBracket {
  const bracketA = generateBracket(teamsA);
  const bracketB = generateBracket(teamsB);

  const maxIdA = Math.max(...bracketA.matches.map((m) => m.id));
  bracketB.matches.forEach((m) => {
    m.id += maxIdA;
    if (m.nextMatchId) m.nextMatchId += maxIdA;
    if (m.prevMatch1Id) m.prevMatch1Id += maxIdA;
    if (m.prevMatch2Id) m.prevMatch2Id += maxIdA;
  });

  const grandFinal: GrandFinalMatch = {
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
 */
export function initBracketTournament(
  teamNames: (string | { id?: string; name: string; side?: "A" | "B" })[]
): void {
  const teams: BracketTeam[] = teamNames.map((t, i) => {
    if (typeof t === "string") {
      return { id: `team-${i}`, name: t };
    }
    return { id: t.id || `team-${i}`, name: t.name, side: t.side };
  });

  (state.bracket as any) = generateBracket(teams);
  (state as any).bracketFormat = "single";
  saveState();
}

/**
 * Initialize a dual bracket tournament.
 */
export function initDualBracketTournament(
  teamNames: { id?: string; name: string; side?: "A" | "B" }[],
  sharedFinal = true
): void {
  const teams: BracketTeam[] = teamNames.map((t, i) => ({
    id: t.id || `team-${i}`,
    name: t.name,
    side: t.side || (i < teamNames.length / 2 ? "A" : "B"),
  }));

  const teamsA = teams.filter((t) => t.side === "A");
  const teamsB = teams.filter((t) => t.side === "B");

  if (sharedFinal) {
    (state.bracket as any) = generateDualBracket(teamsA, teamsB);
  } else {
    const bracketA = generateBracket(teamsA);
    const bracketB = generateBracket(teamsB);

    const maxIdA = Math.max(...bracketA.matches.map((m) => m.id));
    bracketB.matches.forEach((m) => {
      m.id += maxIdA;
      if (m.nextMatchId) m.nextMatchId += maxIdA;
      if (m.prevMatch1Id) m.prevMatch1Id += maxIdA;
      if (m.prevMatch2Id) m.prevMatch2Id += maxIdA;
    });

    (state.bracket as any) = {
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

  (state as any).bracketFormat = "dual";
  saveState();
}

/**
 * Clear bracket tournament.
 */
export function clearBracket(): void {
  (state.bracket as any) = null;
  (state as any).bracketFormat = null;
  (state as any).bracketTeams = [];
  saveState();
}
