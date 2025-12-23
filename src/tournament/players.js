// Player Management Module
// CRUD operations for tournament players

import { state, saveState } from "./state.js";
import { showToast, createId } from "../shared/utils.js";
import { showConfirmModal } from "./modals.js";

/**
 * Add a new player to the tournament
 * @param {string} name - Player name
 * @returns {boolean} True if player was added
 */
export function addPlayer(name) {
  if (!name.trim()) return false;

  const trimmedName = name.trim();

  if (state.players.length >= 24) {
    showToast("Maximum 24 players allowed");
    return false;
  }

  // Check for duplicates (case-insensitive)
  if (
    state.players.some(
      (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
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

  // Auto-increment courts every 4 players
  if (state.players.length % 4 === 0) {
    state.courts = state.players.length / 4;
  }

  saveState();
  return true;
}

/**
 * Remove a player by ID
 * @param {number} id - Player ID
 */
export function removePlayer(id) {
  state.players = state.players.filter((p) => p.id !== id);
  saveState();
}

/**
 * Remove all players with confirmation
 * @param {Function} onCleared - Callback after players are cleared
 */
export function removeAllPlayers(onCleared) {
  console.log("removeAllPlayers called, players:", state.players.length);
  if (state.players.length === 0) {
    console.log("No players to remove");
    return;
  }

  showConfirmModal(
    "Remove All Players?",
    "Are you sure you want to clear the entire player list? This action cannot be undone.",
    "Yes, Remove All",
    () => {
      console.log("Confirm callback executed");
      state.players = [];
      state.preferredPartners = [];
      saveState();
      console.log("Players cleared, state:", state.players);
      if (onCleared) onCleared();
    },
    true // isDanger
  );
}

/**
 * Import multiple players from text
 * @param {string} text - Newline or comma-separated names
 * @returns {{ added: number, duplicates: number, hitLimit: boolean }}
 */
export function importPlayers(text) {
  if (!text.trim()) return { added: 0, duplicates: 0, hitLimit: false };

  // Split by newline or comma
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
    // Check global limit
    if (state.players.length >= 24) {
      hitLimit = true;
      break;
    }

    // Check duplicate (case-insensitive)
    if (
      state.players.some((p) => p.name.toLowerCase() === name.toLowerCase())
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

  // Auto-increment courts based on total players after import
  // But let's only do it if it increases the court count to avoid surprising reductions
  const suggestedCourts = Math.floor(state.players.length / 4);
  if (suggestedCourts > state.courts) {
    state.courts = suggestedCourts;
  }

  saveState();
  return { added: addedCount, duplicates, hitLimit };
}

/**
 * Add a late-joining player to an ongoing tournament
 * @param {string} name - Player name
 * @returns {boolean} True if added successfully
 */
export function addLatePlayer(name) {
  const newPlayer = {
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
 * @returns {Array} Available players
 */
export function getAvailablePlayersForPairing() {
  const pairedPlayerIds = new Set();
  state.preferredPartners.forEach((pair) => {
    pairedPlayerIds.add(pair.player1Id);
    pairedPlayerIds.add(pair.player2Id);
  });
  return state.players.filter((p) => !pairedPlayerIds.has(p.id));
}

/**
 * Add a new preferred partner pair
 */
export function addPreferredPair() {
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
 * @param {number} pairId - Pair ID
 */
export function removePreferredPair(pairId) {
  state.preferredPartners = state.preferredPartners.filter(
    (p) => p.id !== pairId
  );
  saveState();
}

/**
 * Update a preferred partner pair
 * @param {number} pairId - Pair ID
 * @param {1|2} which - Which player in the pair
 * @param {number} playerId - New player ID
 */
export function updatePreferredPair(pairId, which, playerId) {
  const pair = state.preferredPartners.find((p) => p.id === pairId);
  if (pair) {
    if (which === 1) pair.player1Id = playerId;
    else pair.player2Id = playerId;
    saveState();
  }
}
