/**
 * Americano Schedule Generator
 * Round-robin schedule generation for Americano format.
 */

import { state } from "../state.js";

/**
 * Generate Americano schedule (Round Robin).
 * All rounds are pre-generated.
 * @returns {Array} Array of round objects
 */
export function generateAmericanoSchedule() {
  const players = [...state.players];
  const n = players.length;
  const courts = state.courts;

  // Handle odd number of players with a "bye" player
  if (n % 2 !== 0) {
    players.push({ id: -1, name: "BYE", isBye: true });
  }

  const numPlayers = players.length;
  const rounds = [];

  // Circle method for round-robin
  // Fix first player, rotate others
  const fixed = players[0];
  const rotating = players.slice(1);

  for (let round = 0; round < numPlayers - 1; round++) {
    const roundPlayers = [fixed, ...rotating];
    const pairs = [];

    // Create pairs: 0-last, 1-second-last, etc.
    for (let i = 0; i < numPlayers / 2; i++) {
      const p1 = roundPlayers[i];
      const p2 = roundPlayers[numPlayers - 1 - i];
      if (!p1.isBye && !p2.isBye) {
        pairs.push([p1, p2]);
      }
    }

    // Form matches from pairs (2 pairs = 1 match: Team1 vs Team2)
    const matches = [];
    const playersInMatches = new Set();
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

    // Determine byes: players not in matches for this round
    const roundMatches = matches.slice(0, courts);
    const playersInRound = new Set();
    roundMatches.forEach((m) => {
      m.team1.forEach((p) => playersInRound.add(p.id));
      m.team2.forEach((p) => playersInRound.add(p.id));
    });
    const byes = state.players.filter(
      (p) => !p.isBye && !playersInRound.has(p.id)
    );

    if (roundMatches.length > 0) {
      rounds.push({
        number: rounds.length + 1,
        matches: roundMatches,
        byes,
      });
    }

    // Rotate: move last to position 1
    rotating.unshift(rotating.pop());
  }

  return rounds;
}

/**
 * Generate Team Americano schedule (Round Robin 1v1).
 * @returns {Array} Array of round objects
 */
export function generateTeamSchedule() {
  const players = [...state.players];
  const n = players.length;
  const courts = state.courts;

  // Handle odd number of teams with a "bye" team
  if (n % 2 !== 0) {
    players.push({ id: -1, name: "BYE", isBye: true });
  }

  const numPlayers = players.length;
  const rounds = [];

  // Circle method for round-robin
  const fixed = players[0];
  const rotating = players.slice(1);

  for (let round = 0; round < numPlayers - 1; round++) {
    const roundPlayers = [fixed, ...rotating];

    // Create matches directly: 0 vs last, 1 vs second-last, etc.
    const matches = [];
    const playersInMatches = new Set();

    for (let i = 0; i < numPlayers / 2; i++) {
      const p1 = roundPlayers[i]; // Team 1
      const p2 = roundPlayers[numPlayers - 1 - i]; // Team 2

      if (!p1.isBye && !p2.isBye) {
        matches.push({
          court: matches.length + 1,
          team1: [p1], // Array for compatibility
          team2: [p2], // Array for compatibility
        });
        playersInMatches.add(p1.id);
        playersInMatches.add(p2.id);
      }
    }

    // Determine byes
    const roundMatches = matches.slice(0, courts);
    const playersInRound = new Set();
    roundMatches.forEach((m) => {
      m.team1.forEach((p) => playersInRound.add(p.id));
      m.team2.forEach((p) => playersInRound.add(p.id));
    });
    const byes = state.players.filter(
      (p) => !p.isBye && !playersInRound.has(p.id)
    );

    if (roundMatches.length > 0) {
      rounds.push({
        number: rounds.length + 1,
        matches: roundMatches,
        byes,
      });
    }

    // Rotate
    rotating.unshift(rotating.pop());
  }

  return rounds;
}
