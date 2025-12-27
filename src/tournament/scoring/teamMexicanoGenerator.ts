/**
 * Team Mexicano Schedule Generator
 * Dynamic pairing for Team Mexicano format.
 */

import { state } from "../core/state";
import { shuffleArray } from "../../shared/utils";

interface Player {
  id: string | number;
  name: string;
  points?: number;
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
 * Generate Team Mexicano first round.
 */
export function generateTeamMexicanoFirstRound(): Round[] {
  const teams: Player[] = [...state.players];
  shuffleArray(teams);

  const courts = state.courts;
  const matches: Match[] = [];
  const playersInMatches = new Set<string | number>();

  for (let i = 0; i < teams.length - 1 && matches.length < courts; i += 2) {
    matches.push({
      court: matches.length + 1,
      team1: [teams[i]],
      team2: [teams[i + 1]],
    });
    playersInMatches.add(teams[i].id);
    playersInMatches.add(teams[i + 1].id);
  }

  const byes = teams.filter((t) => !playersInMatches.has(t.id));

  return [{ number: 1, matches, byes }];
}

/**
 * Generate Team Mexicano next round based on standings.
 */
export function generateTeamMexicanoNextRound(): Round {
  const sorted: Player[] = [...state.leaderboard].sort(
    (a: Player, b: Player) => (b.points || 0) - (a.points || 0)
  );
  const courts = state.courts;

  const available = sorted.filter((t) => !state.manualByes.includes(t.id));
  const manualByePlayers = sorted.filter((t) =>
    state.manualByes.includes(t.id)
  );

  const matches: Match[] = [];
  const playersInMatches = new Set<string | number>();

  for (let i = 0; i < available.length - 1 && matches.length < courts; i += 2) {
    matches.push({
      court: matches.length + 1,
      team1: [available[i]],
      team2: [available[i + 1]],
    });
    playersInMatches.add(available[i].id);
    playersInMatches.add(available[i + 1].id);
  }

  const byes = [
    ...manualByePlayers,
    ...available.filter((t) => !playersInMatches.has(t.id)),
  ];

  return { number: state.schedule.length + 1, matches, byes };
}
