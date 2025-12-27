/**
 * Schedule Module
 * Main orchestrator for schedule rendering and interactions.
 */

import { state, saveState } from "../../state.js";
import { getElements } from "../elements.js";
import {
  updateGridColumns,
  updateSliderMax,
  updateTextSize,
} from "../controls.js";
import { setRenderScheduleCallback } from "../setup.js";
import { renderRoundCard } from "../components/roundCard.js";
import { initTimer } from "../components/timerDisplay.js";

// Sub-modules
import { autoFillScore, validateRoundState } from "./scoreHandling.js";
import {
  completeRound as completeRoundImpl,
  editRound as editRoundImpl,
  toggleRoundCollapse,
  toggleManualBye as toggleManualByeImpl,
} from "./roundManagement.js";

/**
 * Render schedule/rounds.
 */
export function renderSchedule() {
  const els = getElements();

  // Initialize timer
  initTimer(state, saveState);
  renderGameDetails();

  const lastRoundIndex = state.schedule.length - 1;

  els.roundsContainer.innerHTML = state.schedule
    .map((round, roundIndex) =>
      renderRoundCard(round, roundIndex, {
        scoringMode: state.scoringMode,
        pointsPerMatch: state.pointsPerMatch,
        manualByes: state.manualByes,
        leaderboard: state.leaderboard,
        lastRoundIndex,
      })
    )
    .join("");

  updateSliderMax();
  updateGridColumns();
  updateTextSize();
  validateRoundState();

  // Scroll to current (incomplete) round
  const currentRoundIndex = state.schedule.findIndex((r) => !r.completed);
  const targetRoundIndex = currentRoundIndex >= 0 ? currentRoundIndex : 0;
  const roundEl = document.getElementById(`round-${targetRoundIndex}`);
  if (roundEl) {
    setTimeout(() => {
      roundEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}

/**
 * Render Game Details (Format, Scoring, etc).
 */
export function renderGameDetails() {
  const container = document.getElementById("gameDetails");
  if (!container) return;

  const formatLabels = {
    americano: "Americano",
    mexicano: "Mexicano",
    team: "Team Americano",
    teamMexicano: "Team Mexicano",
  };

  const scoringLabels = {
    total: "Total Points",
    race: "Race to Points",
    time: "Time Based",
  };

  const details = [
    { label: formatLabels[state.format] || "Tournament" },
    { label: `${state.courts} Courts` },
    { label: scoringLabels[state.scoringMode] },
    {
      label:
        state.scoringMode === "time"
          ? `${state.pointsPerMatch} Mins`
          : `${state.pointsPerMatch} Pts`,
    },
  ];

  container.innerHTML = details
    .map(
      (d) => `
    <div class="game-detail-item">
      <span class="detail-label">${d.label}</span>
    </div>
  `
    )
    .join("");
}

// Register callback for setup.js
setRenderScheduleCallback(renderSchedule);

// Re-export functions with bound renderSchedule callback
export { autoFillScore, validateRoundState, toggleRoundCollapse };

/**
 * Complete the current round.
 */
export function completeRound() {
  completeRoundImpl(renderSchedule);
}

/**
 * Edit a completed round.
 * @param {number} roundIndex - Round index
 */
export function editRound(roundIndex) {
  editRoundImpl(roundIndex, renderSchedule);
}

/**
 * Toggle manual bye selection.
 * @param {number} playerId - Player ID
 */
export function toggleManualBye(playerId) {
  toggleManualByeImpl(playerId, renderSchedule);
}
