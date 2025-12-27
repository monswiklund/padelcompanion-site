/**
 * Export/Share Module
 * Handles tournament data export and sharing.
 */

import { state } from "../../core/state.js";
import { showToast } from "../../../shared/utils.js";

/**
 * Export tournament data to CSV.
 * @param {Object|null} data - Tournament data or null to use current state
 */
export function exportTournamentData(data = null) {
  const target = data || state;
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  let csvContent = `data:text/csv;charset=utf-8,`;

  csvContent += `Tournament Results\n`;
  csvContent += `Date,${date} ${time}\n`;
  csvContent += `Format,${target.format}\n`;
  csvContent += `Scoring,${target.scoringMode} (${target.pointsPerMatch})\n\n`;

  csvContent += `Final Standings\n`;
  csvContent += `Rank,Player,Points,Wins,Played,Points Lost,Diff\n`;

  const sortedPlayers = [...target.leaderboard].sort(
    (a, b) => b.points - a.points
  );

  sortedPlayers.forEach((p, index) => {
    const diff = (p.points || 0) - (p.pointsLost || 0);
    csvContent += `${index + 1},"${p.name}",${p.points},${p.wins},${p.played},${
      p.pointsLost || 0
    },${diff}\n`;
  });
  csvContent += `\n`;

  csvContent += `Match History\n`;
  csvContent += `Round,Court,Team 1,Score T1,Score T2,Team 2\n`;

  target.schedule.forEach((round) => {
    if (!round.completed) return;

    round.matches.forEach((match) => {
      const team1Names = match.team1.map((p) => p.name).join(" & ");
      const team2Names = match.team2.map((p) => p.name).join(" & ");

      let courtName = `Court ${match.court}`;
      if (
        target.courtFormat === "custom" &&
        target.customCourtNames &&
        target.customCourtNames[match.court - 1]
      ) {
        courtName = target.customCourtNames[match.court - 1];
      } else if (target.courtFormat === "number") {
        courtName = `${match.court}`;
      }

      csvContent += `Round ${round.number},"${courtName}","${team1Names}",${match.score1},${match.score2},"${team2Names}"\n`;
    });
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `padel_tournament_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Share tournament results.
 * @param {Object|null} data - Tournament data or null to use current state
 */
export async function shareResults(data = null) {
  const target = data || state;
  const date = new Date().toLocaleDateString();

  let text = `Padel Tournament Results - ${date}\n\n`;
  text += `Winner: ${target.leaderboard[0]?.name || "Unknown"}\n`;
  text += `Format: ${target.format}\n\n`;

  text += `Top Standings:\n`;
  const topPlayers = [...target.leaderboard]
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);
  topPlayers.forEach((p, i) => {
    text += `${i + 1}. ${p.name}: ${p.points} pts (${p.wins}W)\n`;
  });

  text += `\nFull results: https://padelcompanion.se/tournament/`;

  try {
    await navigator.clipboard.writeText(text);
    showToast("Results copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
    showToast("Failed to copy results", "error");
  }
}
