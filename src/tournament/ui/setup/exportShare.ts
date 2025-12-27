/**
 * Export and share utilities for tournament data.
 */

import { state as globalState, TournamentState } from "../../core/state";

/**
 * Export tournament data as JSON.
 */
export function exportTournamentData(): string {
  const data = {
    name: globalState.tournamentName,
    format: globalState.format,
    players: globalState.players,
    schedule: globalState.schedule,
    leaderboard: globalState.leaderboard,
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Download tournament data as a file.
 */
export function downloadTournamentData(filename?: string): void {
  const data = exportTournamentData();
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `tournament-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Share tournament data via Web Share API.
 */
export async function shareTournamentData(): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  try {
    await navigator.share({
      title: globalState.tournamentName || "Tournament Results",
      text: `Tournament: ${globalState.format}\nPlayers: ${globalState.players.length}`,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Copy leaderboard to clipboard.
 */
export async function copyLeaderboardToClipboard(): Promise<boolean> {
  const lines = globalState.leaderboard.map(
    (p, i) => `${i + 1}. ${p.name}: ${p.points || 0} pts`
  );

  const text = `${globalState.tournamentName || "Tournament"}\n${"=".repeat(
    20
  )}\n${lines.join("\n")}`;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
