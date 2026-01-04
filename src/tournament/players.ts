// Player Management Module
// CRUD operations for tournament players

import { state, saveState } from "./core/state";
import { showToast, createId } from "../shared/utils";
import { showConfirmModal } from "./core/modals";

interface Player {
  id: string | number;
  name: string;
  points: number;
  wins: number;
  losses: number;
  pointsLost: number;
  played: number;
  byeCount?: number;
  playedWith?: (string | number)[];
}

interface PreferredPair {
  id: string | number;
  player1Id: string | number;
  player2Id: string | number;
}

/**
 * Add a new player to the tournament
 */
export function addPlayer(name: string): boolean {
  if (!name.trim()) return false;

  const trimmedName = name.trim();

  if (state.players.length >= 24) {
    showToast("Maximum 24 players allowed");
    return false;
  }

  if (
    state.players.some(
      (p: Player) => p.name.toLowerCase() === trimmedName.toLowerCase()
    )
  ) {
    showToast(`Player "${trimmedName}" already exists`);
    return false;
  }

  state.players.push({
    id: createId(),
    name: trimmedName,
    points: 0,
    wins: 0,
    losses: 0,
    pointsLost: 0,
    played: 0,
  });

  if (state.players.length % 4 === 0) {
    state.courts = state.players.length / 4;
  }

  saveState();
  return true;
}

/**
 * Remove a player by ID
 */
export function removePlayer(id: string | number): void {
  state.players = state.players.filter((p: Player) => p.id !== id);
  saveState();
}

/**
 * Remove all players with confirmation
 */
export function removeAllPlayers(onCleared?: () => void): void {
  if (state.players.length === 0) return;

  showConfirmModal(
    "Remove All Players?",
    "Are you sure you want to clear the entire player list? This action cannot be undone.",
    "Yes, Remove All",
    () => {
      state.players = [];
      state.preferredPartners = [];
      saveState();
      if (onCleared) onCleared();
    },
    true
  );
}

interface ImportResult {
  added: number;
  duplicates: number;
  hitLimit: boolean;
}

/**
 * Import multiple players from text
 */
export function importPlayers(text: string): ImportResult {
  if (!text.trim()) return { added: 0, duplicates: 0, hitLimit: false };

  const rawNames = text
    .split(/[\n,]+/)
    .map((n) => n.trim())
    .filter((n) => n);

  if (rawNames.length === 0)
    return { added: 0, duplicates: 0, hitLimit: false };

  let addedCount = 0;
  let duplicates = 0;
  let hitLimit = false;

  for (const name of rawNames) {
    if (state.players.length >= 24) {
      hitLimit = true;
      break;
    }

    if (
      state.players.some(
        (p: Player) => p.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      duplicates++;
      continue;
    }

    state.players.push({
      id: createId(),
      name: name,
      points: 0,
      wins: 0,
      losses: 0,
      pointsLost: 0,
      played: 0,
    });
    addedCount++;
  }

  const suggestedCourts = Math.floor(state.players.length / 4);
  if (suggestedCourts > state.courts) {
    state.courts = suggestedCourts;
  }

  saveState();
  return { added: addedCount, duplicates, hitLimit };
}

/**
 * Add a late-joining player to an ongoing tournament
 */
export function addLatePlayer(name: string): boolean {
  const newPlayer: Player = {
    id: createId(),
    name: name,
    points: 0,
    wins: 0,
    losses: 0,
    played: 0,
    pointsLost: 0,
    byeCount: 0,
    playedWith: [],
  };

  state.players.push(newPlayer);
  state.leaderboard.push(newPlayer);
  saveState();

  return true;
}

/**
 * Get players available for pairing (not already in a preferred pair)
 */
export function getAvailablePlayersForPairing(): Player[] {
  const pairedPlayerIds = new Set<string | number>();
  state.preferredPartners.forEach((pair: PreferredPair) => {
    pairedPlayerIds.add(pair.player1Id);
    pairedPlayerIds.add(pair.player2Id);
  });
  return state.players.filter((p: Player) => !pairedPlayerIds.has(p.id));
}

/**
 * Add a new preferred partner pair
 */
export function addPreferredPair(): void {
  const available = getAvailablePlayersForPairing();
  if (available.length < 2) return;

  state.preferredPartners.push({
    id: createId(),
    player1Id: available[0].id,
    player2Id: available[1].id,
  });

  saveState();
}

/**
 * Remove a preferred partner pair
 */
export function removePreferredPair(pairId: string | number): void {
  state.preferredPartners = state.preferredPartners.filter(
    (p: PreferredPair) => p.id !== pairId
  );
  saveState();
}

/**
 * Update a preferred partner pair
 */
export function updatePreferredPair(
  pairId: string | number,
  which: 1 | 2,
  playerId: string | number
): void {
  const pair = state.preferredPartners.find(
    (p: PreferredPair) => p.id === pairId
  );
  if (pair) {
    if (which === 1) pair.player1Id = playerId;
    else pair.player2Id = playerId;
    saveState();
  }
}
