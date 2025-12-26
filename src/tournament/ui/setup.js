// Setup Module
// Tournament setup and configuration UI

import { state, saveState, pushHistory } from "../state.js";
import { getElements } from "./elements.js";
import { showToast } from "../../shared/utils.js";
import { showConfirmModal, showAlertModal, showCountdown } from "../modals.js";
import { saveToHistory, renderHistoryList } from "../history.js";
import {
  generateAmericanoSchedule,
  generateTeamSchedule,
  generateMexicanoFirstRound,
  generateTeamMexicanoFirstRound,
} from "../scoring.js";
import { renderLeaderboard } from "./leaderboard.js";
import { updateAddPartnerPairButton } from "./partners.js";

// Forward declaration - will be imported from schedule.js to avoid circular dep
let renderScheduleCallback = null;
export function setRenderScheduleCallback(fn) {
  renderScheduleCallback = fn;
}

// Forward declaration for tournament config render
let renderTournamentConfigCallback = null;
export function setRenderTournamentConfigCallback(fn) {
  renderTournamentConfigCallback = fn;
}

/**
 * Update setup UI based on state
 */
export function updateSetupUI() {
  const els = getElements();
  const format = state.format;
  const isTeam = format === "team" || format === "teamMexicano";

  // Update labels based on format
  const labels = {
    americano: {
      title: "Americano Setup",
      description: "Add players and configure your tournament settings.",
    },
    mexicano: {
      title: "Mexicano Setup",
      description:
        "Dynamic schedule that adjusts pairings based on leaderboard.",
    },
    team: {
      title: "Team Americano Setup",
      description: "Play with fixed teams.",
    },
    teamMexicano: {
      title: "Team Mexicano Setup",
      description: "Dynamic schedule for fixed teams.",
    },
  };

  const current = labels[state.format] || labels.americano;
  const titleEl = document.querySelector(".page-title");
  const descEl = document.querySelector(".page-subtitle");

  if (titleEl) titleEl.textContent = current.title;
  if (descEl) descEl.textContent = current.description;

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

  // Legacy setup-card code removed - locking is now handled by tournament-config

  // Ensure Matchup Rules are NOT disabled
  const matchupContainer = document.getElementById("advancedSettingsContent");
  if (matchupContainer) {
    const matchupInputs = matchupContainer.querySelectorAll(
      "input, select, button"
    );
    matchupInputs.forEach((input) => {
      // Re-enable everything in matchup section
      input.disabled = false;
      input.classList.remove("locked");

      if (input.tagName === "SELECT") {
        const wrapper = input.closest(".custom-select-wrapper");
        if (wrapper) {
          const customSelect = wrapper.querySelector(".custom-select");
          if (customSelect) customSelect.classList.remove("disabled");
        }
      }
    });

    // Handle the "Add Fixed Pair" button state specifically based on availability
    updateAddPartnerPairButton();
  }

  // Update generate button text
  const runningBadge = document.getElementById("runningBadge");
  if (state.isLocked) {
    if (els.generateBtn) els.generateBtn.style.display = "none";
    if (runningBadge) runningBadge.style.display = "inline-flex";
  } else {
    if (els.generateBtn) {
      els.generateBtn.style.display = "block";
      els.generateBtn.textContent = "Generate Schedule";
      // Always enable to allow validation feedback on click
      els.generateBtn.disabled = false;
    }
    if (runningBadge) runningBadge.style.display = "none";
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

  // Disable Strict Pattern checkbox when Optimal pairing strategy is selected
  const strictStrategy = document.getElementById("strictStrategy");
  // const strictStrategyWrapper = strictStrategy?.closest(".form-check");
  if (strictStrategy) {
    // const isOptimal = state.pairingStrategy === "optimal";
    // strictStrategy.disabled = isOptimal;
    // if (strictStrategyWrapper) {
    //   strictStrategyWrapper.style.opacity = isOptimal ? "0.5" : "1";
    //   strictStrategyWrapper.style.pointerEvents = isOptimal ? "none" : "auto";
    // }
    // Always enable to allow click feedback
    strictStrategy.disabled = false;
  }

  // Update tournament config (use callback to avoid circular dependency)
  if (renderTournamentConfigCallback) {
    renderTournamentConfigCallback();
  }
}

/**
 * Render tournament summary bullet points
 */
export function renderTournamentSummary() {
  const summaryList = document.getElementById("summaryList");
  const summarySection = document.getElementById("tournamentSummary");
  if (!summaryList || !summarySection) return;

  // Hide summary if tournament is running
  if (state.isLocked) {
    summarySection.style.display = "none";
    return;
  }
  summarySection.style.display = "block";

  const formatLabels = {
    americano: "Americano",
    mexicano: "Mexicano",
    team: "Team Americano",
    teamMexicano: "Team Mexicano",
  };

  const isTeam = state.format === "team" || state.format === "teamMexicano";
  const isMexicano =
    state.format === "mexicano" || state.format === "teamMexicano";
  const playerCount = state.players?.length || 0;
  const playerLabel = isTeam ? "teams" : "players";

  // Build summary items
  const items = [
    {
      label: "Format",
      value: formatLabels[state.format] || state.format,
    },
    {
      label: isTeam ? "Teams" : "Players",
      value: playerCount > 0 ? `${playerCount} ${playerLabel}` : "None added",
    },
    {
      label: "Courts",
      value: state.courts || 2,
    },
    {
      label: "Scoring",
      value:
        state.scoringMode === "time"
          ? `${state.pointsPerMatch} minutes`
          : state.scoringMode === "race"
          ? `First to ${state.pointsPerMatch}`
          : `${state.pointsPerMatch} total points`,
    },
  ];

  // Add Matchup Rules for Mexicano formats
  if (isMexicano) {
    // Max Partner Repeats
    const maxRepeatsLabel =
      state.maxRepeats === 99
        ? "Unlimited"
        : state.maxRepeats === 0
        ? "No repeats"
        : `Max ${state.maxRepeats}x`;
    items.push({
      label: "Repeats",
      value: maxRepeatsLabel,
    });

    // Pairing Strategy
    const strategyLabels = {
      oneThree: "1&3 vs 2&4",
      oneTwo: "1&2 vs 3&4",
      oneFour: "1&4 vs 2&3",
      optimal: "Optimal",
    };
    items.push({
      label: "Pairing",
      value: strategyLabels[state.pairingStrategy] || state.pairingStrategy,
    });

    // Preferred Partners (if any configured)
    if (state.preferredPartners?.length > 0) {
      // Get player names for each pair
      const pairNames = state.preferredPartners
        .map((pair) => {
          const p1 = state.players.find((p) => p.id === pair.player1Id);
          const p2 = state.players.find((p) => p.id === pair.player2Id);
          if (p1 && p2) {
            return `${p1.name} & ${p2.name}`;
          }
          return null;
        })
        .filter(Boolean);

      if (pairNames.length > 0) {
        items.push({
          label: "Fixed Pairs",
          value: pairNames,
          isChips: true,
        });
      }
    }
  }

  summaryList.innerHTML = items
    .map((item) => {
      if (item.isChips) {
        return `
          <li class="summary-item summary-item-chips">
            <span class="summary-label">${item.label}:</span>
            <div class="summary-chips">
              ${item.value
                .map((name) => `<span class="summary-chip">${name}</span>`)
                .join("")}
            </div>
          </li>
        `;
      }
      return `
        <li class="summary-item">
          <span class="summary-label">${item.label}:</span>
          <span class="summary-value">${item.value}</span>
        </li>
      `;
    })
    .join("");
}

/**
 * Generate tournament schedule
 */
export function generateSchedule() {
  const els = getElements();

  // Validation: Check minimum players
  const format = els.format.value;
  const isTeam = format === "team" || format === "teamMexicano";
  const minPlayers = isTeam ? 2 : 4;

  if (state.players.length < minPlayers) {
    showToast(
      `Not enough ${isTeam ? "teams" : "players"} (min ${minPlayers})`,
      "error"
    );
    return;
  }

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

    // Animate first round with entrance effect
    setTimeout(() => {
      const firstRound = document.getElementById("round-0");
      if (firstRound) {
        firstRound.classList.add("animate-in", "highlight");
        setTimeout(() => {
          firstRound.classList.remove("animate-in", "highlight");
        }, 1600);
      }
    }, 100);

    state.isLocked = true;
    updateSetupUI();

    saveState();

    // Celebration toast
    showToast(`🎾 Tournament started! Round 1 ready`);
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

  // Show countdown animation before starting
  showCountdown().then(() => {
    startGeneration();
  });
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
      renderHistoryList();
      showToast("Tournament saved to history");

      if (showFinalStandingsCallback) {
        showFinalStandingsCallback(sorted);
      }

      renderLeaderboard();

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
