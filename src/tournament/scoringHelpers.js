/**
 * Scoring Helper Utilities
 * Reusable functions for tournament scheduling logic.
 */

import { state } from "./state.js";

/**
 * Get the preferred partner ID for a player.
 * @param {number} playerId - The player ID to find partner for
 * @returns {number|null} Partner ID or null if no preferred partner
 */
export function getPreferredPartnerId(playerId) {
  if (!state.preferredPartners) return null;
  const pair = state.preferredPartners.find(
    (pp) => pp.player1Id === playerId || pp.player2Id === playerId
  );
  if (!pair) return null;
  return pair.player1Id === playerId ? pair.player2Id : pair.player1Id;
}

/**
 * Get repeat count for how many times two players have partnered.
 * @param {number} pid1 - First player ID
 * @param {number} pid2 - Second player ID
 * @param {Array} leaderboard - Current leaderboard with playedWith data
 * @returns {number} Number of times they've played together
 */
export function getRepeatCount(pid1, pid2, leaderboard) {
  const player = leaderboard.find((p) => p.id === pid1);
  if (!player?.playedWith) return 0;
  return player.playedWith.filter((id) => id === pid2).length;
}

/**
 * Build available entities from players (singles and pairs).
 * @param {Array} players - Array of player objects
 * @param {Set} excludeIds - Set of IDs to exclude (e.g., manual byes)
 * @returns {Array} Array of entity objects { type: 'single'|'pair', players: [] }
 */
export function buildAvailableEntities(players, excludeIds = new Set()) {
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
          // Partner excluded, treat player as single
          entities.push({ type: "single", players: [p] });
        } else {
          // Valid pair
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
 * Sort entities by priority for selection (bye count, then played count).
 * @param {Array} entities - Array of entity objects
 * @returns {Array} Sorted entities (mutates in place for efficiency)
 */
export function sortEntitiesByPriority(entities) {
  return entities.sort((a, b) => {
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

    // Higher bye count = more priority (played less)
    if (Math.abs(mB.bye - mA.bye) > 0.1) return mB.bye - mA.bye;
    // Less played = more priority
    return mA.play - mB.play;
  });
}

/**
 * Select entities to fill a target count of players.
 * @param {Array} entities - Sorted entities
 * @param {number} targetCount - Number of players needed
 * @returns {{ selected: Array, remaining: Array }} Selected and remaining entities
 */
export function selectEntitiesToFill(entities, targetCount) {
  const selected = [];
  const remaining = [];
  let currentCount = 0;

  for (const entity of entities) {
    if (currentCount + entity.players.length <= targetCount) {
      selected.push(entity);
      currentCount += entity.players.length;
    } else {
      remaining.push(entity);
    }
  }

  return { selected, remaining };
}

/**
 * Form teams from selected entities (pairs stay as teams, singles get paired).
 * @param {Array} entities - Selected entities
 * @returns {{ teams: Array, leftover: Array }} Array of teams and any unpaired players
 */
export function formTeamsFromEntities(entities) {
  const teams = [];
  const singles = [];

  entities.forEach((e) => {
    if (e.type === "pair") {
      teams.push(e.players);
    } else {
      singles.push(e.players[0]);
    }
  });

  // Sort singles by points for pairing
  singles.sort((a, b) => b.points - a.points);

  // Pair singles (handled by caller for strategy-based pairing)
  return { teams, singles };
}

/**
 * Assign court numbers to matches, respecting locked courts.
 * @param {Array} matchCandidates - Array of { team1, team2, lockedCourt? }
 * @param {number} maxCourts - Maximum number of courts available
 * @returns {Array} Array of matches with court assignments
 */
export function assignCourtsToMatches(matchCandidates, maxCourts) {
  const matches = [];
  const assignedCourts = new Set();

  // Separate locked and normal matches
  const locked = matchCandidates.filter((m) => m.lockedCourt);
  const normal = matchCandidates.filter((m) => !m.lockedCourt);

  // Assign locked matches first
  for (const match of locked) {
    if (matches.length >= maxCourts) break;

    let court = match.lockedCourt;
    if (assignedCourts.has(court) || court > maxCourts) {
      // Lock failed, treat as normal
      normal.push(match);
      continue;
    }

    assignedCourts.add(court);
    matches.push({
      court,
      team1: match.team1,
      team2: match.team2,
    });
  }

  // Assign normal matches to remaining courts
  for (const match of normal) {
    if (matches.length >= maxCourts) break;

    let court = 1;
    while (assignedCourts.has(court)) court++;

    if (court <= maxCourts) {
      assignedCourts.add(court);
      matches.push({
        court,
        team1: match.team1,
        team2: match.team2,
      });
    }
  }

  // Sort by court number
  matches.sort((a, b) => a.court - b.court);

  return matches;
}
