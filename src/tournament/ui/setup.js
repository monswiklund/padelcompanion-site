// Setup Module
// Tournament setup and configuration UI

import { state, saveState, pushHistory } from "../state.js";
import { getElements } from "./elements.js";
import { showToast } from "../../shared/utils.js";
import { showConfirmModal, showAlertModal } from "../modals.js";
import { saveToHistory } from "../history.js";
import {
  generateAmericanoSchedule,
  generateTeamSchedule,
  generateMexicanoFirstRound,
  generateTeamMexicanoFirstRound,
} from "../scoring.js";
import { renderLeaderboard } from "./leaderboard.js";

// Forward declaration - will be imported from schedule.js to avoid circular dep
let renderScheduleCallback = null;
export function setRenderScheduleCallback(fn) {
  renderScheduleCallback = fn;
}

/**
 * Update setup UI based on state
 */
export function updateSetupUI() {
  const els = getElements();
  const format = state.format;
  const isTeam = format === "team" || format === "teamMexicano";

  // Update UI labels for Team Mode
  const playersHeader = document.getElementById("playersHeader");
  if (playersHeader) {
    if (playersHeader.firstChild) {
      playersHeader.firstChild.textContent = isTeam ? "Teams " : "Players ";
    }
  }

  if (els.addPlayerBtn) {
    els.addPlayerBtn.textContent = isTeam ? "+ Add Team" : "+ Add Player";
  }

  if (els.playerNameInput) {
    els.playerNameInput.placeholder = isTeam
      ? "Enter team name..."
      : "Enter name...";
  }

  const setupCard = document.querySelector(".setup-card");
  if (!setupCard) return;

  // Disable form inputs when locked
  const inputs = setupCard.querySelectorAll("input, select, button");
  inputs.forEach((input) => {
    if (state.isLocked && !input.classList.contains("always-enabled")) {
      input.disabled = true;
      input.classList.add("locked");
    } else {
      input.disabled = false;
      input.classList.remove("locked");
    }
  });

  // Update generate button text
  const runningBadge = document.getElementById("runningBadge");
  if (state.isLocked) {
    els.generateBtn.style.display = "none";
    if (runningBadge) runningBadge.style.display = "inline-flex";
  } else {
    els.generateBtn.style.display = "block";
    if (runningBadge) runningBadge.style.display = "none";
    els.generateBtn.textContent = "Generate Schedule";
    els.generateBtn.disabled = state.players.length < 4;
  }

  // Toggle Advanced Settings visibility based on Format
  const fmt = String(format).trim();
  const isMexicano = fmt.toLowerCase() === "mexicano";
  const isTeamMexicano = fmt === "teamMexicano";
  const isMexicanoRelated = isMexicano || isTeamMexicano;

  const advancedContent = els.advancedSettingsContent;
  if (advancedContent) {
    if (isMexicanoRelated) {
      advancedContent.classList.remove("collapsed");
      advancedContent.classList.add("expanded");
    } else {
      advancedContent.classList.remove("expanded");
      advancedContent.classList.add("collapsed");
    }
  }
}

/**
 * Generate tournament schedule
 */
export function generateSchedule() {
  const els = getElements();

  state.format = els.format.value;
  state.courts = parseInt(els.courts.value);
  state.scoringMode = els.scoringMode.value;
  state.pointsPerMatch = parseInt(els.points.value);
  state.currentRound = 1;

  const playersNeededPerCourt =
    state.format === "team" || state.format === "teamMexicano" ? 2 : 4;
  const maxPossibleCourts = Math.floor(
    state.players.length / playersNeededPerCourt
  );

  const startGeneration = () => {
    pushHistory();
    state.leaderboard = state.players.map((p) => ({
      ...p,
      points: 0,
      wins: 0,
      losses: 0,
      pointsLost: 0,
      played: 0,
      byeCount: 0,
      playedWith: [],
    }));

    if (state.format === "americano") {
      state.allRounds = generateAmericanoSchedule();
      state.schedule = [state.allRounds[0]];
    } else if (state.format === "team") {
      state.allRounds = generateTeamSchedule();
      state.schedule = [state.allRounds[0]];
    } else if (state.format === "teamMexicano") {
      state.schedule = generateTeamMexicanoFirstRound();
      state.allRounds = null;
    } else {
      state.schedule = generateMexicanoFirstRound();
      state.allRounds = null;
    }

    els.leaderboardSection.style.display = "block";
    renderLeaderboard();
    if (renderScheduleCallback) renderScheduleCallback();
    els.scheduleSection.style.display = "block";

    const actionsSection = document.getElementById("tournamentActionsSection");
    if (actionsSection) actionsSection.style.display = "block";

    els.scheduleSection.scrollIntoView({ behavior: "smooth" });

    state.isLocked = true;
    updateSetupUI();

    saveState();
  };

  if (state.courts > maxPossibleCourts) {
    if (maxPossibleCourts === 0) {
      showAlertModal(
        "Not Enough Players",
        `You need at least ${playersNeededPerCourt} players/teams to start!`
      );
      return;
    }

    const oldCourts = state.courts;
    state.courts = maxPossibleCourts;
    if (els.courts) els.courts.value = state.courts;
    showToast(`Adjusted courts: ${oldCourts} → ${maxPossibleCourts}`);
  }

  startGeneration();
}

/**
 * Reset tournament schedule
 */
export function resetSchedule() {
  const els = getElements();

  showConfirmModal(
    "Reset Tournament?",
    "This will clear all rounds and scores.",
    "Reset",
    () => {
      pushHistory();
      state.schedule = [];
      state.currentRound = 0;
      state.leaderboard = [];
      state.allRounds = null;
      state.isLocked = false;
      state.hideLeaderboard = false;
      state.manualByes = [];

      els.scheduleSection.style.display = "none";
      els.leaderboardSection.style.display = "none";

      updateSetupUI();
      saveState();
      showToast("Tournament reset");
    },
    true
  );
}

/**
 * End tournament and show final standings
 */
export function endTournament(showFinalStandingsCallback) {
  showConfirmModal(
    "End Tournament?",
    "This will show final standings. This action cannot be undone.",
    "End Tournament",
    () => {
      state.isLocked = false;
      state.hideLeaderboard = false;
      updateSetupUI();

      const sorted = [...state.leaderboard].sort((a, b) => b.points - a.points);

      saveToHistory();
      showToast("Tournament saved to history");

      if (showFinalStandingsCallback) {
        showFinalStandingsCallback(sorted);
      }

      saveState();
    },
    true
  );
}

/**
 * Toggle toolbar visibility
 */
export function toggleToolbar() {
  const toolbar = document.getElementById("scheduleToolbar");
  toolbar.classList.toggle("collapsed");
}

/**
 * Export tournament data to CSV
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
 * Share tournament results
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
