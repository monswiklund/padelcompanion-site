/**
 * History Repository
 * Pure data layer for tournament history storage.
 * No UI dependencies - just CRUD operations.
 */

import { StorageService } from "../../shared/storage.js";

const HISTORY_KEY = "padel_history_v1";
const MAX_HISTORY_ITEMS = 20;

/**
 * Get all past tournaments.
 * @returns {Array} List of tournament records
 */
export function getHistory() {
  return StorageService.getItem(HISTORY_KEY, []);
}

/**
 * Get a specific tournament by ID.
 * @param {string} id - Tournament ID
 * @returns {Object|null} Tournament record or null
 */
export function getHistoryItem(id) {
  const history = getHistory();
  return history.find((item) => item.id === id) || null;
}

/**
 * Save a tournament to history.
 * @param {Object} stateSnapshot - Complete state snapshot from getStateSnapshot()
 * @returns {Object} The saved record
 */
export function saveToHistory(stateSnapshot) {
  const history = getHistory();

  const record = {
    id: Date.now().toString(),
    savedAt: new Date().toISOString(),
    summary: {
      date: new Date().toISOString(),
      name: stateSnapshot.tournamentName || "",
      notes: stateSnapshot.tournamentNotes || "",
      format: stateSnapshot.format,
      winner: stateSnapshot.leaderboard[0]?.name || "Unknown",
      playerCount: stateSnapshot.players.length,
      roundCount: stateSnapshot.schedule.length,
    },
    data: stateSnapshot,
  };

  history.unshift(record);

  // Limit history to prevent storage issues
  if (history.length > MAX_HISTORY_ITEMS) {
    history.pop();
  }

  StorageService.setItem(HISTORY_KEY, history);
  return record;
}

/**
 * Delete a tournament from history.
 * @param {string} id - Tournament ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteFromHistory(id) {
  const history = getHistory();
  const index = history.findIndex((item) => item.id === id);

  if (index === -1) return false;

  history.splice(index, 1);
  StorageService.setItem(HISTORY_KEY, history);
  return true;
}

/**
 * Clear all history.
 */
export function clearAllHistory() {
  StorageService.removeItem(HISTORY_KEY);
}
