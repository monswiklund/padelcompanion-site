/**
 * Schedule Generation Module
 * Pure logic for tournament schedule generation.
 * Refactored to work with React context - no DOM dependencies.
 */

import { state, saveState, pushHistory } from "../../core/state";
import { showToast } from "../../../shared/utils";
import {
  showConfirmModal,
  showAlertModal,
  showCountdown,
} from "../../core/modals";
import { saveToHistory } from "../../history/repository";
import {
  generateAmericanoSchedule,
  generateTeamSchedule,
  generateMexicanoFirstRound,
  generateTeamMexicanoFirstRound,
} from "../../scoring/index.js";

// Forward declaration for renderSchedule
let renderScheduleCallback: (() => void) | null = null;

/**
 * Set callback for schedule rendering (called after generation).
 */
export function setRenderScheduleCallback(fn: () => void): void {
  renderScheduleCallback = fn;
}

/**
 * Generate tournament schedule.
 * Updates legacy state and triggers re-render.
 */
export function generateSchedule(): Promise<any> {
  const isTeam = state.format === "team" || state.format === "teamMexicano";
  const minPlayers = isTeam ? 2 : 4;

  if (state.players.length < minPlayers) {
    showToast(
      `Not enough ${isTeam ? "teams" : "players"} (min ${minPlayers})`,
      "error"
    );
    return Promise.resolve();
  }

  state.currentRound = 1;

  const playersNeededPerCourt =
    state.format === "team" || state.format === "teamMexicano" ? 2 : 4;
  const maxPossibleCourts = Math.floor(
    state.players.length / playersNeededPerCourt
  );

  const startGeneration = () => {
    pushHistory();
    state.leaderboard = state.players.map((p: any) => ({
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

    state.isLocked = true;
    saveState();

    if (renderScheduleCallback) renderScheduleCallback();
    showToast(`🎾 Tournament started! Round 1 ready`);
  };

  if (state.courts > maxPossibleCourts) {
    if (maxPossibleCourts === 0) {
      showAlertModal(
        "Not Enough Players",
        `You need at least ${playersNeededPerCourt} players/teams to start!`
      );
      return Promise.resolve();
    }

    const oldCourts = state.courts;
    state.courts = maxPossibleCourts;
    showToast(`Adjusted courts: ${oldCourts} → ${maxPossibleCourts}`);
  }

  return showCountdown().then(() => {
    startGeneration();
    return {
      schedule: state.schedule,
      allRounds: state.allRounds,
      leaderboard: state.leaderboard,
      currentRound: state.currentRound,
      isLocked: state.isLocked,
    };
  });
}

/**
 * Reset tournament schedule (confirmation modal).
 */
export function resetSchedule(): void {
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
      saveState();
      showToast("Tournament reset");
    },
    true
  );
}

/**
 * End tournament and show final standings.
 */
export function endTournament(
  showFinalStandingsCallback?: (standings: any[]) => void
): void {
  showConfirmModal(
    "End Tournament?",
    "This will show final standings. This action cannot be undone.",
    "End Tournament",
    () => {
      state.isLocked = false;
      state.hideLeaderboard = false;

      const sorted = [...state.leaderboard].sort(
        (a: any, b: any) => b.points - a.points
      );

      saveToHistory(state);
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
 * Toggle toolbar visibility (legacy).
 */
export function toggleToolbar(): void {
  const toolbar = document.getElementById("scheduleToolbar");
  if (toolbar) toolbar.classList.toggle("collapsed");
}
