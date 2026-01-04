/**
 * Americano Schedule Generator
 * Round-robin schedule generation for Americano format.
 */

import { state } from "../core/state";

interface Player {
  id: string | number;
  name: string;
  isBye?: boolean;
}

interface Match {
  court: number;
  team1: Player[];
  team2: Player[];
}

interface Round {
  number: number;
  matches: Match[];
  byes: Player[];
}

/**
 * Generate Americano schedule (Round Robin).
 */
export function generateAmericanoSchedule(): Round[] {
  const players: Player[] = [...state.players];
  const n = players.length;
  const courts = state.courts;

  if (n % 2 !== 0) {
    players.push({ id: -1, name: "BYE", isBye: true });
  }

  const numPlayers = players.length;
  const rounds: Round[] = [];

  const fixed = players[0];
  const rotating = players.slice(1);

  for (let round = 0; round < numPlayers - 1; round++) {
    const roundPlayers = [fixed, ...rotating];
    const pairs: Player[][] = [];

    for (let i = 0; i < numPlayers / 2; i++) {
      const p1 = roundPlayers[i];
      const p2 = roundPlayers[numPlayers - 1 - i];
      if (!p1.isBye && !p2.isBye) {
        pairs.push([p1, p2]);
      }
    }

    const matches: Match[] = [];
    const playersInMatches = new Set<string | number>();
    for (let i = 0; i < pairs.length - 1; i += 2) {
      if (pairs[i] && pairs[i + 1]) {
        matches.push({
          court: Math.floor(i / 2) + 1,
          team1: pairs[i],
          team2: pairs[i + 1],
        });
        pairs[i].forEach((p) => playersInMatches.add(p.id));
        pairs[i + 1].forEach((p) => playersInMatches.add(p.id));
      }
    }

    const roundMatches = matches.slice(0, courts);
    const playersInRound = new Set<string | number>();
    roundMatches.forEach((m) => {
      m.team1.forEach((p) => playersInRound.add(p.id));
      m.team2.forEach((p) => playersInRound.add(p.id));
    });
    const byes = state.players.filter(
      (p: Player) => !p.isBye && !playersInRound.has(p.id)
    );

    if (roundMatches.length > 0) {
      rounds.push({
        number: rounds.length + 1,
        matches: roundMatches,
        byes,
      });
    }

    rotating.unshift(rotating.pop()!);
  }

  return rounds;
}

/**
 * Generate Team Americano schedule (Round Robin 1v1).
 */
export function generateTeamSchedule(): Round[] {
  const players: Player[] = [...state.players];
  const n = players.length;
  const courts = state.courts;

  if (n % 2 !== 0) {
    players.push({ id: -1, name: "BYE", isBye: true });
  }

  const numPlayers = players.length;
  const rounds: Round[] = [];

  const fixed = players[0];
  const rotating = players.slice(1);

  for (let round = 0; round < numPlayers - 1; round++) {
    const roundPlayers = [fixed, ...rotating];

    const matches: Match[] = [];
    const playersInMatches = new Set<string | number>();

    for (let i = 0; i < numPlayers / 2; i++) {
      const p1 = roundPlayers[i];
      const p2 = roundPlayers[numPlayers - 1 - i];

      if (!p1.isBye && !p2.isBye) {
        matches.push({
          court: matches.length + 1,
          team1: [p1],
          team2: [p2],
        });
        playersInMatches.add(p1.id);
        playersInMatches.add(p2.id);
      }
    }

    const roundMatches = matches.slice(0, courts);
    const playersInRound = new Set<string | number>();
    roundMatches.forEach((m) => {
      m.team1.forEach((p) => playersInRound.add(p.id));
      m.team2.forEach((p) => playersInRound.add(p.id));
    });
    const byes = state.players.filter(
      (p: Player) => !p.isBye && !playersInRound.has(p.id)
    );

    if (roundMatches.length > 0) {
      rounds.push({
        number: rounds.length + 1,
        matches: roundMatches,
        byes,
      });
    }

    rotating.unshift(rotating.pop()!);
  }

  return rounds;
}
