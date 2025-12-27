/**
 * Team Mexicano Schedule Generator
 * Dynamic pairing for Team Mexicano format.
 */

import { state } from "../core/state.js";
import { shuffleArray } from "../../shared/utils.js";

/**
 * Generate Team Mexicano first round.
 * Fixed teams with random initial pairing.
 * @returns {Array} Array with single round object
 */
export function generateTeamMexicanoFirstRound() {
  const teams = [...state.players];
  shuffleArray(teams);

  const courts = state.courts;
  const matches = [];
  const playersInMatches = new Set();

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
 * @returns {Object} Round object
 */
export function generateTeamMexicanoNextRound() {
  const sorted = [...state.leaderboard].sort((a, b) => b.points - a.points);
  const courts = state.courts;

  const available = sorted.filter((t) => !state.manualByes.includes(t.id));
  const manualByePlayers = sorted.filter((t) =>
    state.manualByes.includes(t.id)
  );

  const matches = [];
  const playersInMatches = new Set();

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
