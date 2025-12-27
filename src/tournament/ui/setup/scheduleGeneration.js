/**
 * Schedule Generation Module
 * Handles tournament schedule generation and lifecycle.
 */

import { state, saveState, pushHistory } from "../../core/state.js";
import { getElements } from "../elements.js";
import { showToast } from "../../../shared/utils.js";
import {
  showConfirmModal,
  showAlertModal,
  showCountdown,
} from "../../core/modals.js";
import { saveToHistory, renderHistoryList } from "../../history/index.js";
import {
  generateAmericanoSchedule,
  generateTeamSchedule,
  generateMexicanoFirstRound,
  generateTeamMexicanoFirstRound,
} from "../../scoring/index.js";
import { renderLeaderboard } from "../leaderboard.js";
import { updateSetupUI } from "./setupUI.js";

// Forward declaration for renderSchedule
let renderScheduleCallback = null;

/**
 * Set callback for schedule rendering.
 * @param {Function} fn - Callback function
 */
export function setRenderScheduleCallback(fn) {
  renderScheduleCallback = fn;
}

/**
 * Generate tournament schedule.
 */
export function generateSchedule() {
  const els = getElements();

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

    // Animate first round
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

  showCountdown().then(() => {
    startGeneration();
  });
}

/**
 * Reset tournament schedule.
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
 * End tournament and show final standings.
 * @param {Function} showFinalStandingsCallback - Callback to show standings
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
 * Toggle toolbar visibility.
 */
export function toggleToolbar() {
  const toolbar = document.getElementById("scheduleToolbar");
  toolbar.classList.toggle("collapsed");
}
