/**
 * History Repository
 * Pure data layer for tournament history storage.
 */

import { StorageService } from "@/shared/storage";
import type { TournamentState } from "@/context/TournamentContext";

const HISTORY_KEY = "padel_history_v1";
const MAX_HISTORY_ITEMS = 20;

export interface HistorySummary {
  date: string;
  name: string;
  notes: string;
  format: string;
  winner: string;
  playerCount: number;
  roundCount: number;
}

export interface HistoryItem {
  id: string;
  savedAt: string;
  summary: HistorySummary;
  data: TournamentState;
}

/**
 * Get all past tournaments.
 */
export function getHistory(): HistoryItem[] {
  return StorageService.getItem<HistoryItem[]>(HISTORY_KEY, []) || [];
}

/**
 * Get a specific tournament by ID.
 */
export function getHistoryItem(id: string): HistoryItem | null {
  const history = getHistory();
  return history.find((item) => item.id === id) || null;
}

/**
 * Save a tournament to history.
 */
export function saveToHistory(stateSnapshot: TournamentState): HistoryItem {
  const history = getHistory();

  const record: HistoryItem = {
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
 */
export function deleteFromHistory(id: string): boolean {
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
export function clearAllHistory(): void {
  StorageService.removeItem(HISTORY_KEY);
}
