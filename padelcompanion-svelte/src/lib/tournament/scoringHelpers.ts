/**
 * Scoring Helper Utilities
 * Reusable functions for tournament scheduling logic.
 */

import { state } from "./core/state";

interface Player {
  id: string | number;
  name: string;
  byeCount?: number;
  played?: number;
  points?: number;
  playedWith?: (string | number)[];
}

interface PreferredPartner {
  player1Id: string | number;
  player2Id: string | number;
}

interface Entity {
  type: "single" | "pair";
  players: Player[];
}

interface MatchCandidate {
  team1: Player[];
  team2: Player[];
  lockedCourt?: number;
}

interface Match {
  court: number;
  team1: Player[];
  team2: Player[];
}

/**
 * Get the preferred partner ID for a player.
 */
export function getPreferredPartnerId(
  playerId: string | number
): string | number | null {
  if (!state.preferredPartners) return null;
  const pair = state.preferredPartners.find(
    (pp: PreferredPartner) =>
      pp.player1Id === playerId || pp.player2Id === playerId
  );
  if (!pair) return null;
  return pair.player1Id === playerId ? pair.player2Id : pair.player1Id;
}

/**
 * Get repeat count for how many times two players have partnered.
 */
export function getRepeatCount(
  pid1: string | number,
  pid2: string | number,
  leaderboard: Player[]
): number {
  const player = leaderboard.find((p) => p.id === pid1);
  if (!player?.playedWith) return 0;
  return player.playedWith.filter((id) => id === pid2).length;
}

/**
 * Build available entities from players (singles and pairs).
 */
export function buildAvailableEntities(
  players: Player[],
  excludeIds: Set<string | number> = new Set()
): Entity[] {
  const entities: Entity[] = [];
  const processedIds = new Set<string | number>();

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
 * Sort entities by priority for selection (bye count, then played count).
 */
export function sortEntitiesByPriority(entities: Entity[]): Entity[] {
  return entities.sort((a, b) => {
    const getMetrics = (e: Entity) => {
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
}

/**
 * Select entities to fill a target count of players.
 */
export function selectEntitiesToFill(
  entities: Entity[],
  targetCount: number
): { selected: Entity[]; remaining: Entity[] } {
  const selected: Entity[] = [];
  const remaining: Entity[] = [];
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
 */
export function formTeamsFromEntities(entities: Entity[]): {
  teams: Player[][];
  singles: Player[];
} {
  const teams: Player[][] = [];
  const singles: Player[] = [];

  entities.forEach((e) => {
    if (e.type === "pair") {
      teams.push(e.players);
    } else {
      singles.push(e.players[0]);
    }
  });

  singles.sort((a, b) => (b.points || 0) - (a.points || 0));

  return { teams, singles };
}

/**
 * Assign court numbers to matches, respecting locked courts.
 */
export function assignCourtsToMatches(
  matchCandidates: MatchCandidate[],
  maxCourts: number
): Match[] {
  const matches: Match[] = [];
  const assignedCourts = new Set<number>();

  const locked = matchCandidates.filter((m) => m.lockedCourt);
  const normal = matchCandidates.filter((m) => !m.lockedCourt);

  for (const match of locked) {
    if (matches.length >= maxCourts) break;

    const court = match.lockedCourt!;
    if (assignedCourts.has(court) || court > maxCourts) {
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

  matches.sort((a, b) => a.court - b.court);

  return matches;
}
