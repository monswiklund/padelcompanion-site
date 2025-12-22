// Scoring Algorithms Module
// Americano, Mexicano, Team Americano, and Team Mexicano scheduling

import { state } from "./state.js";
import { shuffleArray } from "../shared/utils.js";

/**
 * Generate Americano schedule (Round Robin)
 * All rounds are pre-generated
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
 * Generate Team Americano schedule (Round Robin 1v1)
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

/**
 * Generate Team Mexicano first round
 * Fixed teams with random initial pairing
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
 * Generate Team Mexicano next round based on standings
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

/**
 * Generate Mexicano first round
 * Dynamic pairing with random initial teams
 * @returns {Array} Array with single round object
 */
export function generateMexicanoFirstRound() {
  const courts = state.courts;
  const playersNeeded = courts * 4;

  const availableEntities = [];
  const processedIds = new Set();
  const allPlayers = [...state.players];
  const byes = [];

  allPlayers.forEach((p) => {
    if (processedIds.has(p.id)) return;

    const partnerId = getPreferredPartnerId(p.id);
    if (partnerId) {
      const partner = allPlayers.find((pl) => pl.id === partnerId);
      if (partner) {
        availableEntities.push({ type: "pair", players: [p, partner] });
        processedIds.add(partner.id);
      } else {
        availableEntities.push({ type: "single", players: [p] });
      }
    } else {
      availableEntities.push({ type: "single", players: [p] });
    }
    processedIds.add(p.id);
  });

  // Sort Entities Randomly for First Round
  shuffleArray(availableEntities);

  // Select
  const selectedEntities = [];
  let currentCount = 0;

  for (const entity of availableEntities) {
    if (currentCount + entity.players.length <= playersNeeded) {
      selectedEntities.push(entity);
      currentCount += entity.players.length;
    } else {
      byes.push(...entity.players);
    }
  }

  // Form Teams
  const teams = [];
  const singles = [];

  selectedEntities.forEach((e) => {
    if (e.type === "pair") {
      teams.push(e.players);
    } else {
      singles.push(e.players[0]);
    }
  });

  // Pair singles randomly
  shuffleArray(singles);
  for (let i = 0; i < singles.length - 1; i += 2) {
    teams.push([singles[i], singles[i + 1]]);
  }

  // Match Teams Randomly
  shuffleArray(teams);

  // Create matches with Court Locking Logic
  const matches = [];
  const assignedCourts = new Set();

  // 1. Identify Locked Matches
  const teamsWithLocks = [];
  const normalTeams = [];

  for (let i = 0; i < teams.length - 1; i += 2) {
    const t1 = teams[i];
    const t2 = teams[i + 1];

    // Check if any player has a lock
    const lock = [...t1, ...t2].find((p) => p.lockedCourt);
    if (lock) {
      teamsWithLocks.push({
        team1: t1,
        team2: t2,
        lockedCourt: lock.lockedCourt,
      });
    } else {
      normalTeams.push({ team1: t1, team2: t2 });
    }
  }

  // 2. Assign Locked Matches
  teamsWithLocks.forEach((match) => {
    if (matches.length >= courts) return; // Full

    let court = match.lockedCourt;
    // If court taken or invalid, fallback to next free
    if (assignedCourts.has(court) || court > courts) {
      court = null;
    }

    if (court) {
      assignedCourts.add(court);
      matches.push({
        court: court,
        team1: match.team1,
        team2: match.team2,
      });
    } else {
      // Treat as normal if lock fails
      normalTeams.push({ team1: match.team1, team2: match.team2 });
    }
  });

  // 3. Assign Remaining Matches to Free Courts
  normalTeams.forEach((match) => {
    if (matches.length >= courts) return;

    // Find first free court
    let court = 1;
    while (assignedCourts.has(court)) court++;

    if (court <= courts) {
      assignedCourts.add(court);
      matches.push({
        court: court,
        team1: match.team1,
        team2: match.team2,
      });
    }
  });

  // Sort matches by court for clean display
  matches.sort((a, b) => a.court - b.court);

  // Extra byes if odd teams
  if (teams.length % 2 !== 0 && matches.length < teams.length / 2) {
    // The last team didn't play
    byes.push(...teams[teams.length - 1]);
  }

  return [{ number: 1, matches, byes }];
}

/**
 * Generate Mexicano next round based on standings
 * @param {Array} leaderboard - Current standings
 * @returns {Object} Round object
 */
// Helper to find partner
function getPreferredPartnerId(pid) {
  if (!state.preferredPartners) return null;
  const pair = state.preferredPartners.find(
    (pp) => pp.player1Id === pid || pp.player2Id === pid
  );
  if (!pair) return null;
  return pair.player1Id === pid ? pair.player2Id : pair.player1Id;
}

export function generateMexicanoNextRound(leaderboard) {
  const courts = state.courts;
  const playersNeeded = courts * 4;

  // 1. Identify valid players (not mutually excluded)
  const manualByIds = new Set(state.manualByes);

  // Group available players into "Entities" (Single or Pair)
  // to ensure we select atomic units
  const availableEntities = [];
  const processedIds = new Set();
  const allPlayers = [...leaderboard]; // Copy

  allPlayers.forEach((p) => {
    if (processedIds.has(p.id)) return;
    if (manualByIds.has(p.id)) return; // Manual bye

    const partnerId = getPreferredPartnerId(p.id);
    if (partnerId) {
      // It's a pair
      const partner = allPlayers.find((pl) => pl.id === partnerId);
      if (partner) {
        if (manualByIds.has(partner.id)) {
          // If partner is manually bye-d, this player must also sit out?
          // Or treated as single? treating as single relies on "partner available".
          // Let's assume if partner is Bye, this player is Single for this round.
          availableEntities.push({ type: "single", players: [p] });
        } else {
          // Valid pair
          availableEntities.push({ type: "pair", players: [p, partner] });
          processedIds.add(partner.id);
        }
      } else {
        // Partner not found in list (weird), treat as single
        availableEntities.push({ type: "single", players: [p] });
      }
    } else {
      // Single
      availableEntities.push({ type: "single", players: [p] });
    }
    processedIds.add(p.id);
  });

  // 2. Sort Entities by priority (Bye Count > Points)
  // Avg stats for pairs
  availableEntities.sort((a, b) => {
    const getM = (e) => {
      const totBye = e.players.reduce((sum, p) => sum + (p.byeCount || 0), 0);
      const totPlay = e.players.reduce((sum, p) => sum + (p.played || 0), 0);
      return {
        bye: totBye / e.players.length,
        play: totPlay / e.players.length,
      };
    };
    const mA = getM(a);
    const mB = getM(b);

    if (Math.abs(mB.bye - mA.bye) > 0.1) return mB.bye - mA.bye;
    return mA.play - mB.play; // Less played priority
  });

  // 3. Select Entities to fill slots
  const selectedPlayers = [];
  const selectedEntities = [];
  let currentCount = 0;

  for (const entity of availableEntities) {
    if (currentCount + entity.players.length <= playersNeeded) {
      selectedEntities.push(entity);
      selectedPlayers.push(...entity.players);
      currentCount += entity.players.length;
    }
  }

  // Byes are everyone else
  const selectedIds = new Set(selectedPlayers.map((p) => p.id));
  const byes = allPlayers.filter((p) => !selectedIds.has(p.id));

  // 4. Form Teams from Selected
  const teams = [];
  const singles = [];

  selectedEntities.forEach((e) => {
    if (e.type === "pair") {
      teams.push(e.players);
    } else {
      singles.push(e.players[0]);
    }
  });

  // Pair up singles using Strategy (Chunks of 4)
  singles.sort((a, b) => b.points - a.points);

  let i = 0;
  for (; i < singles.length - 3; i += 4) {
    const p1 = singles[i],
      p2 = singles[i + 1],
      p3 = singles[i + 2],
      p4 = singles[i + 3];

    const pairings = [
      { name: "oneThree", team1: [p1, p3], team2: [p2, p4] },
      { name: "oneTwo", team1: [p1, p2], team2: [p3, p4] },
      { name: "oneFour", team1: [p1, p4], team2: [p2, p3] },
    ];

    let selectedPairing;

    // "Smart Default": Calculate scores if Optimal OR Not Strict (to check for penalties)
    if (state.pairingStrategy === "optimal" || !state.strictStrategy) {
      const scoredPairings = pairings.map((pairing) => {
        let score = 0;
        const p1Id = pairing.team1[0].id;
        const p1PartnerId = pairing.team1[1].id;
        const p2Id = pairing.team2[0].id;
        const p2PartnerId = pairing.team2[1].id;

        const getPenalty = (pid1, pid2) => {
          // 1. Total repeats
          const player = leaderboard.find((p) => p.id === pid1);
          let penalty = 0;
          if (player?.playedWith) {
            penalty += player.playedWith.filter((id) => id === pid2).length;
          }

          // 2. Consecutive repeats (hard penalty)
          const maxRep = state.maxRepeats !== undefined ? state.maxRepeats : 99;
          if (maxRep < 99 && state.schedule && state.schedule.length > 0) {
            let consecutive = 0;
            for (let k = state.schedule.length - 1; k >= 0; k--) {
              const round = state.schedule[k];
              if (!round.completed) continue;
              const wasPartners = round.matches.some(
                (m) =>
                  (m.team1[0].id === pid1 && m.team1[1]?.id === pid2) ||
                  (m.team1[0].id === pid2 && m.team1[1]?.id === pid1) ||
                  (m.team2[0].id === pid1 && m.team2[1]?.id === pid2) ||
                  (m.team2[0].id === pid2 && m.team2[1]?.id === pid1)
              );
              if (wasPartners) consecutive++;
              else break;
            }
            if (consecutive > maxRep) penalty += 1000;
          }
          return penalty;
        };

        score += getPenalty(p1Id, p1PartnerId);
        score += getPenalty(p2Id, p2PartnerId);
        return { ...pairing, score };
      });

      const bestOption = [...scoredPairings].sort(
        (a, b) => a.score - b.score
      )[0];

      if (state.pairingStrategy === "optimal") {
        selectedPairing = bestOption;
      } else {
        const userChoice =
          scoredPairings.find((p) => p.name === state.pairingStrategy) ||
          scoredPairings[0];

        // Smart Override:
        // If !Strict AND user choice has penalty AND better option exists -> Override
        if (
          !state.strictStrategy &&
          userChoice.score >= 1000 &&
          bestOption.score < 1000
        ) {
          selectedPairing = bestOption;
        } else {
          selectedPairing = userChoice;
        }
      }
    } else {
      // Strict Mode / No Calc: Just pick strategy
      selectedPairing =
        pairings.find((p) => p.name === state.pairingStrategy) || pairings[0];
    }

    teams.push(selectedPairing.team1);
    teams.push(selectedPairing.team2);
  }

  // Handle remaining singles (2 left)
  // Just pair them up
  if (i < singles.length - 1) {
    teams.push([singles[i], singles[i + 1]]);
  }

  // Calculate Team Strength & Match
  const teamObjs = teams.map((t) => ({
    players: t,
    points: t.reduce((sum, p) => sum + p.points, 0),
  }));

  teamObjs.sort((a, b) => b.points - a.points);

  const matches = [];
  const pInMatch = new Set();
  const assignedCourts = new Set();

  const teamsWithLocks = [];
  const normalTeams = [];

  // Group into potential matches first
  for (let j = 0; j < teamObjs.length - 1; j += 2) {
    const t1 = teamObjs[j];
    const t2 = teamObjs[j + 1];

    const lock = [...t1.players, ...t2.players].find((p) => p.lockedCourt);
    if (lock) {
      teamsWithLocks.push({ t1, t2, lockedCourt: lock.lockedCourt });
    } else {
      normalTeams.push({ t1, t2 });
    }
  }

  // Assign Locked
  teamsWithLocks.forEach((m) => {
    if (matches.length >= courts) return;

    let court = m.lockedCourt;
    if (assignedCourts.has(court) || court > courts) court = null;

    if (court) {
      assignedCourts.add(court);
      matches.push({
        court: court,
        team1: m.t1.players,
        team2: m.t2.players,
      });
      m.t1.players.forEach((p) => pInMatch.add(p.id));
      m.t2.players.forEach((p) => pInMatch.add(p.id));
    } else {
      normalTeams.push({ t1: m.t1, t2: m.t2 });
    }
  });

  // Assign Normal
  normalTeams.forEach((m) => {
    if (matches.length >= courts) return;

    let court = 1;
    while (assignedCourts.has(court)) court++;

    if (court <= courts) {
      assignedCourts.add(court);
      matches.push({
        court: court,
        team1: m.t1.players,
        team2: m.t2.players,
      });
      m.t1.players.forEach((p) => pInMatch.add(p.id));
      m.t2.players.forEach((p) => pInMatch.add(p.id));
    }
  });

  matches.sort((a, b) => a.court - b.court);

  // Update Byes
  teamObjs.forEach((t) => {
    if (!t.players.some((p) => pInMatch.has(p.id))) {
      t.players.forEach((p) => byes.push(p));
    }
  });

  return { number: state.schedule.length + 1, matches, byes };
}

/**
 * Update player stats after a match
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
 * Subtract player stats (for editing rounds)
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
