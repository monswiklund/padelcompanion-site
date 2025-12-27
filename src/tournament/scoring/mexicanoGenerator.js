/**
 * Mexicano Schedule Generator
 * Dynamic pairing for Mexicano format with preferred partners.
 */

import { state } from "../state.js";
import { shuffleArray } from "../../shared/utils.js";

/**
 * Get the preferred partner ID for a player.
 * @param {number} pid - Player ID
 * @returns {number|null} Partner ID or null
 */
function getPreferredPartnerId(pid) {
  if (!state.preferredPartners) return null;
  const pair = state.preferredPartners.find(
    (pp) => pp.player1Id === pid || pp.player2Id === pid
  );
  if (!pair) return null;
  return pair.player1Id === pid ? pair.player2Id : pair.player1Id;
}

/**
 * Build available entities (singles and pairs) from players.
 * @param {Array} players - Player list
 * @param {Set} excludeIds - IDs to exclude
 * @returns {Array} Array of entities
 */
function buildEntities(players, excludeIds = new Set()) {
  const entities = [];
  const processedIds = new Set();

  players.forEach((p) => {
    if (processedIds.has(p.id)) return;
    if (excludeIds.has(p.id)) return;

    const partnerId = getPreferredPartnerId(p.id);
    if (partnerId) {
      const partner = players.find((pl) => pl.id === partnerId);
      if (partner) {
        if (excludeIds.has(partner.id)) {
          entities.push({ type: "single", players: [p] });
        } else {
          entities.push({ type: "pair", players: [p, partner] });
          processedIds.add(partner.id);
        }
      } else {
        entities.push({ type: "single", players: [p] });
      }
    } else {
      entities.push({ type: "single", players: [p] });
    }
    processedIds.add(p.id);
  });

  return entities;
}

/**
 * Assign courts to matches, respecting locked courts.
 * @param {Array} teamsWithLocks - Matches with court locks
 * @param {Array} normalTeams - Matches without locks
 * @param {number} courts - Number of courts
 * @returns {{ matches: Array, pInMatch: Set }}
 */
function assignCourts(teamsWithLocks, normalTeams, courts) {
  const matches = [];
  const pInMatch = new Set();
  const assignedCourts = new Set();

  // Assign locked matches first
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

  // Assign normal matches
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

  return { matches, pInMatch };
}

/**
 * Generate Mexicano first round.
 * Dynamic pairing with random initial teams.
 * @returns {Array} Array with single round object
 */
export function generateMexicanoFirstRound() {
  const courts = state.courts;
  const playersNeeded = courts * 4;

  const availableEntities = buildEntities(state.players);
  const byes = [];

  // Shuffle for first round
  shuffleArray(availableEntities);

  // Select entities
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

  // Match Teams
  shuffleArray(teams);

  // Separate locked and normal matches
  const teamsWithLocks = [];
  const normalTeams = [];

  for (let i = 0; i < teams.length - 1; i += 2) {
    const t1 = teams[i];
    const t2 = teams[i + 1];

    const lock = [...t1, ...t2].find((p) => p.lockedCourt);
    if (lock) {
      teamsWithLocks.push({
        t1: { players: t1 },
        t2: { players: t2 },
        lockedCourt: lock.lockedCourt,
      });
    } else {
      normalTeams.push({ t1: { players: t1 }, t2: { players: t2 } });
    }
  }

  const { matches } = assignCourts(teamsWithLocks, normalTeams, courts);

  // Handle odd team count
  if (teams.length % 2 !== 0 && matches.length < teams.length / 2) {
    byes.push(...teams[teams.length - 1]);
  }

  return [{ number: 1, matches, byes }];
}

/**
 * Generate Mexicano next round based on standings.
 * @param {Array} leaderboard - Current standings
 * @returns {Object} Round object
 */
export function generateMexicanoNextRound(leaderboard) {
  const courts = state.courts;
  const playersNeeded = courts * 4;
  const manualByIds = new Set(state.manualByes);
  const allPlayers = [...leaderboard];

  // Build entities
  const availableEntities = buildEntities(allPlayers, manualByIds);

  // Sort by priority (bye count, then played count)
  availableEntities.sort((a, b) => {
    const getMetrics = (e) => {
      const totBye = e.players.reduce((sum, p) => sum + (p.byeCount || 0), 0);
      const totPlay = e.players.reduce((sum, p) => sum + (p.played || 0), 0);
      return {
        bye: totBye / e.players.length,
        play: totPlay / e.players.length,
      };
    };
    const mA = getMetrics(a);
    const mB = getMetrics(b);

    if (Math.abs(mB.bye - mA.bye) > 0.1) return mB.bye - mA.bye;
    return mA.play - mB.play;
  });

  // Select entities
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

  // Byes
  const selectedIds = new Set(selectedPlayers.map((p) => p.id));
  const byes = allPlayers.filter((p) => !selectedIds.has(p.id));

  // Form teams
  const teams = [];
  const singles = [];

  selectedEntities.forEach((e) => {
    if (e.type === "pair") {
      teams.push(e.players);
    } else {
      singles.push(e.players[0]);
    }
  });

  // Pair singles using strategy
  singles.sort((a, b) => b.points - a.points);
  pairSinglesWithStrategy(singles, teams, leaderboard);

  // Handle remaining singles
  const remainingSingles = singles.filter(
    (s) => !teams.some((t) => t.includes(s))
  );
  for (let i = 0; i < remainingSingles.length - 1; i += 2) {
    teams.push([remainingSingles[i], remainingSingles[i + 1]]);
  }

  // Calculate team strength and match
  const teamObjs = teams.map((t) => ({
    players: t,
    points: t.reduce((sum, p) => sum + p.points, 0),
  }));

  teamObjs.sort((a, b) => b.points - a.points);

  // Separate locked and normal matches
  const teamsWithLocks = [];
  const normalTeams = [];

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

  const { matches, pInMatch } = assignCourts(
    teamsWithLocks,
    normalTeams,
    courts
  );

  // Update byes
  teamObjs.forEach((t) => {
    if (!t.players.some((p) => pInMatch.has(p.id))) {
      t.players.forEach((p) => byes.push(p));
    }
  });

  return { number: state.schedule.length + 1, matches, byes };
}

/**
 * Pair singles using the configured strategy.
 * @param {Array} singles - Sorted singles
 * @param {Array} teams - Teams array (mutated)
 * @param {Array} leaderboard - Current leaderboard
 */
function pairSinglesWithStrategy(singles, teams, leaderboard) {
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

    const selectedPairing = selectPairing(pairings, leaderboard);
    teams.push(selectedPairing.team1);
    teams.push(selectedPairing.team2);
  }

  // Handle remaining 2 singles
  if (i < singles.length - 1) {
    teams.push([singles[i], singles[i + 1]]);
  }
}

/**
 * Select the best pairing based on strategy and constraints.
 * @param {Array} pairings - Possible pairings
 * @param {Array} leaderboard - Current leaderboard
 * @returns {Object} Selected pairing
 */
function selectPairing(pairings, leaderboard) {
  const patternHard =
    state.pairingStrategy !== "optimal" && state.strictStrategy;
  const maxRep = state.maxRepeats !== undefined ? state.maxRepeats : 99;

  const getRepeatCount = (pid1, pid2) => {
    const player = leaderboard.find((p) => p.id === pid1);
    if (!player?.playedWith) return 0;
    return player.playedWith.filter((id) => id === pid2).length;
  };

  const scoredPairings = pairings.map((pairing) => {
    const repeatPenalty =
      getRepeatCount(pairing.team1[0].id, pairing.team1[1].id) +
      getRepeatCount(pairing.team2[0].id, pairing.team2[1].id);

    const team1Rank = pairing.team1[0].points + pairing.team1[1].points;
    const team2Rank = pairing.team2[0].points + pairing.team2[1].points;
    const rankingImbalance = Math.abs(team1Rank - team2Rank);

    const violatesRepeats = maxRep < 99 && repeatPenalty > maxRep;
    const isPreferred = pairing.name === state.pairingStrategy;

    const tieBreaker =
      pairing.team1[0].id * 1000000 +
      pairing.team1[1].id * 10000 +
      pairing.team2[0].id * 100 +
      pairing.team2[1].id;

    return {
      ...pairing,
      repeatPenalty,
      violatesRepeats,
      isPreferred,
      rankingImbalance,
      tieBreaker,
    };
  });

  scoredPairings.sort((a, b) => a.tieBreaker - b.tieBreaker);

  if (state.pairingStrategy === "optimal") {
    const sorted = [...scoredPairings].sort((a, b) => {
      if (a.repeatPenalty !== b.repeatPenalty)
        return a.repeatPenalty - b.repeatPenalty;
      if (a.rankingImbalance !== b.rankingImbalance)
        return a.rankingImbalance - b.rankingImbalance;
      return a.tieBreaker - b.tieBreaker;
    });
    return sorted[0];
  }

  const userChoice =
    scoredPairings.find((p) => p.isPreferred) || scoredPairings[0];

  if (!userChoice.violatesRepeats) {
    return userChoice;
  }

  if (patternHard) {
    return userChoice;
  }

  const validOptions = scoredPairings.filter((p) => !p.violatesRepeats);
  if (validOptions.length > 0) {
    const sortedValid = [...validOptions].sort((a, b) => {
      if (a.isPreferred !== b.isPreferred) return a.isPreferred ? -1 : 1;
      if (a.rankingImbalance !== b.rankingImbalance)
        return a.rankingImbalance - b.rankingImbalance;
      return a.tieBreaker - b.tieBreaker;
    });
    return sortedValid[0];
  }

  const sorted = [...scoredPairings].sort((a, b) => {
    if (a.repeatPenalty !== b.repeatPenalty)
      return a.repeatPenalty - b.repeatPenalty;
    if (a.isPreferred !== b.isPreferred) return a.isPreferred ? -1 : 1;
    if (a.rankingImbalance !== b.rankingImbalance)
      return a.rankingImbalance - b.rankingImbalance;
    return a.tieBreaker - b.tieBreaker;
  });
  return sorted[0];
}
