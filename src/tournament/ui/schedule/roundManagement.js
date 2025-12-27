/**
 * Round Management Module
 * Handles round completion, editing, and state transitions.
 */

import { state, saveState, pushHistory } from "../../state.js";
import { getCourtName } from "../courts.js";
import { renderLeaderboard, getSortedLeaderboard } from "../leaderboard.js";
import { showConfirmModal } from "../../modals.js";
import { showToast } from "../../../shared/utils.js";
import {
  updatePlayerStats,
  subtractPlayerStats,
  generateMexicanoNextRound,
  generateTeamMexicanoNextRound,
} from "../../scoring.js";
import {
  validateRoundScores,
  checkRaceScores,
  readMatchScores,
} from "./scoreHandling.js";

/**
 * Complete the current round.
 * @param {Function} renderSchedule - Callback to re-render schedule
 */
export function completeRound(renderSchedule) {
  const currentRoundIndex = state.schedule.length - 1;
  const currentRound = state.schedule[currentRoundIndex];

  // 1. Validate all scores
  const { isValid, invalidCourts } = validateRoundScores(
    currentRound,
    currentRoundIndex,
    getCourtName
  );

  if (!isValid) {
    let messageContent = "Some matches have missing or invalid scores.";

    if (invalidCourts.length > 0) {
      const courtsList = invalidCourts
        .map((court) => `<li>${court}</li>`)
        .join("");
      messageContent = `
        <p style="margin-bottom: var(--space-md);">The following matches need scores:</p>
        <ul style="text-align: left; margin: 0 0 var(--space-md) var(--space-lg); list-style: disc;">
          ${courtsList}
        </ul>
        <p>Do you want to complete the round anyway?</p>
      `;
    }

    showConfirmModal(
      "Incomplete/Invalid Scores",
      messageContent,
      "Yes, Complete Anyway",
      () => {
        finalizeCompleteRound(currentRound, currentRoundIndex, renderSchedule);
      },
      true
    );
    return;
  }

  // Special Validation for "Race" Mode
  if (state.scoringMode === "race") {
    const incompleteRaceCourts = checkRaceScores(
      currentRound,
      currentRoundIndex,
      getCourtName
    );

    if (incompleteRaceCourts.length > 0) {
      const courtsStr = incompleteRaceCourts.join(", ");

      showConfirmModal(
        "Low Scores Detected",
        `On ${courtsStr}, neither team reached the target of ${state.pointsPerMatch}. Is this correct?`,
        "Yes, Complete Round",
        () => {
          finalizeCompleteRound(
            currentRound,
            currentRoundIndex,
            renderSchedule
          );
        },
        true
      );
      return;
    }
  }

  // No warnings, proceed directly
  finalizeCompleteRound(currentRound, currentRoundIndex, renderSchedule);
}

/**
 * Finalize round completion - update stats and generate next round.
 */
function finalizeCompleteRound(
  currentRound,
  currentRoundIndex,
  renderSchedule
) {
  // Snapshot current ranks before updating stats
  const currentSorted = getSortedLeaderboard();
  currentSorted.forEach((p, index) => {
    const player = state.leaderboard.find((lp) => lp.id === p.id);
    if (player) {
      player.previousRank = index + 1;
    }
  });

  // Update stats for all matches
  currentRound.matches.forEach((match, matchIndex) => {
    const { score1, score2 } = readMatchScores(currentRoundIndex, matchIndex);

    match.score1 = score1;
    match.score2 = score2;

    const isDraw = score1 === score2;
    const team1Won = score1 > score2;
    const team2Won = score2 > score1;

    if (match.team1[1]) {
      // 2v2 match
      updatePlayerStats(
        match.team1[0].id,
        score1,
        score2,
        team1Won,
        isDraw,
        match.team1[1].id
      );
      updatePlayerStats(
        match.team1[1].id,
        score1,
        score2,
        team1Won,
        isDraw,
        match.team1[0].id
      );
      updatePlayerStats(
        match.team2[0].id,
        score2,
        score1,
        team2Won,
        isDraw,
        match.team2[1].id
      );
      updatePlayerStats(
        match.team2[1].id,
        score2,
        score1,
        team2Won,
        isDraw,
        match.team2[0].id
      );
    } else {
      // 1v1 match
      updatePlayerStats(
        match.team1[0].id,
        score1,
        score2,
        team1Won,
        isDraw,
        null
      );
      updatePlayerStats(
        match.team2[0].id,
        score2,
        score1,
        team2Won,
        isDraw,
        null
      );
    }
  });

  // Animate the button
  const completeBtn = document.querySelector(".complete-round-btn");
  if (completeBtn) {
    completeBtn.classList.add("completing");
    completeBtn.textContent = "✓ Completing...";
  }

  pushHistory();

  currentRound.completed = true;

  // Update bye counts
  if (currentRound.byes && currentRound.byes.length > 0) {
    currentRound.byes.forEach((byePlayer) => {
      const player = state.leaderboard.find((p) => p.id === byePlayer.id);
      if (player) {
        player.byeCount = (player.byeCount || 0) + 1;
      }
    });
  }

  state.manualByes = [];
  state.currentRound++;

  // Generate next round based on format
  generateNextRound();

  renderLeaderboard();
  renderSchedule();
  saveState();

  // Animate completed round
  animateRoundCompletion(currentRoundIndex, currentRound.number);
}

/**
 * Generate the next round based on tournament format.
 */
function generateNextRound() {
  if (
    state.format === "americano" &&
    state.allRounds &&
    state.currentRound <= state.allRounds.length
  ) {
    const nextRound = { ...state.allRounds[state.currentRound - 1] };
    state.schedule.push(nextRound);
  } else if (
    state.format === "team" &&
    state.allRounds &&
    state.currentRound <= state.allRounds.length
  ) {
    const nextRound = { ...state.allRounds[state.currentRound - 1] };
    state.schedule.push(nextRound);
  } else if (state.format === "teamMexicano") {
    if (state.currentRound <= 20) {
      const nextRound = generateTeamMexicanoNextRound();
      if (nextRound.matches.length > 0) {
        state.schedule.push(nextRound);
      }
    }
  } else if (state.format === "mexicano") {
    if (state.currentRound <= 20) {
      const nextRound = generateMexicanoNextRound(state.leaderboard);
      if (nextRound.matches.length > 0) {
        state.schedule.push(nextRound);
      }
    }
  }
}

/**
 * Animate round completion and scroll to next round.
 */
function animateRoundCompletion(currentRoundIndex, completedRoundNum) {
  const completedRoundEl = document.getElementById(
    `round-${currentRoundIndex}`
  );
  if (completedRoundEl) {
    completedRoundEl.classList.add("complete-flash");
    setTimeout(() => completedRoundEl.classList.remove("complete-flash"), 1000);
  }

  const hasNextRound = state.schedule.length > currentRoundIndex + 1;
  if (hasNextRound) {
    showToast(
      `✓ Round ${completedRoundNum} complete! Round ${
        completedRoundNum + 1
      } ready`
    );
  } else {
    showToast(`✓ Round ${completedRoundNum} complete!`);
  }

  setTimeout(() => {
    const newRoundIndex = state.schedule.length - 1;
    const newRoundEl = document.getElementById(`round-${newRoundIndex}`);
    if (newRoundEl) {
      newRoundEl.classList.add("animate-in", "highlight");
      newRoundEl.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        newRoundEl.classList.remove("animate-in", "highlight");
      }, 1600);
    }
  }, 100);
}

/**
 * Edit a completed round.
 * @param {number} roundIndex - Index of round to edit
 * @param {Function} renderSchedule - Callback to re-render schedule
 */
export function editRound(roundIndex, renderSchedule) {
  const round = state.schedule[roundIndex];
  if (!round || !round.completed) return;

  const hasSubsequentRounds = state.schedule.length > roundIndex + 1;
  if (hasSubsequentRounds) {
    const confirmEdit = confirm(
      `Editing Round ${roundIndex + 1} will remove ${
        state.schedule.length - roundIndex - 1
      } subsequent round(s). Continue?`
    );
    if (!confirmEdit) return;
  }

  pushHistory();

  // Subtract stats for all rounds being removed
  for (let i = roundIndex; i < state.schedule.length; i++) {
    const r = state.schedule[i];
    if (r.completed) {
      r.matches.forEach((match) => {
        if (match.team1[1]) {
          subtractPlayerStats(
            match.team1[0].id,
            match.score1 || 0,
            match.score2 || 0,
            match.score1 > match.score2,
            match.score1 === match.score2
          );
          subtractPlayerStats(
            match.team1[1].id,
            match.score1 || 0,
            match.score2 || 0,
            match.score1 > match.score2,
            match.score1 === match.score2
          );
          subtractPlayerStats(
            match.team2[0].id,
            match.score2 || 0,
            match.score1 || 0,
            match.score2 > match.score1,
            match.score1 === match.score2
          );
          subtractPlayerStats(
            match.team2[1].id,
            match.score2 || 0,
            match.score1 || 0,
            match.score2 > match.score1,
            match.score1 === match.score2
          );
        } else {
          subtractPlayerStats(
            match.team1[0].id,
            match.score1 || 0,
            match.score2 || 0,
            match.score1 > match.score2,
            match.score1 === match.score2
          );
          subtractPlayerStats(
            match.team2[0].id,
            match.score2 || 0,
            match.score1 || 0,
            match.score2 > match.score1,
            match.score1 === match.score2
          );
        }
      });
    }
  }

  state.schedule = state.schedule.slice(0, roundIndex + 1);
  round.completed = false;
  state.currentRound = roundIndex;

  renderLeaderboard();
  renderSchedule();
  saveState();

  showToast(`Editing Round ${roundIndex + 1}`);
}

/**
 * Toggle round collapse state.
 * @param {number} roundIndex - Round index
 */
export function toggleRoundCollapse(roundIndex) {
  const roundEl = document.getElementById(`round-${roundIndex}`);
  if (!roundEl) return;

  const isCurrentlyCollapsed = roundEl.classList.contains("collapsed");

  if (isCurrentlyCollapsed) {
    roundEl.classList.remove("collapsed");
    const icon = roundEl.querySelector(".collapse-icon");
    if (icon) icon.textContent = "▼";
    const summary = roundEl.querySelector(".round-summary");
    if (summary) summary.style.display = "none";
  } else {
    roundEl.classList.add("collapsed");
    const icon = roundEl.querySelector(".collapse-icon");
    if (icon) icon.textContent = "▶";
    const summary = roundEl.querySelector(".round-summary");
    if (summary) summary.style.display = "";
  }
}

/**
 * Toggle manual bye selection.
 * @param {number} playerId - Player ID
 * @param {Function} renderSchedule - Callback to re-render
 */
export function toggleManualBye(playerId, renderSchedule) {
  const index = state.manualByes.indexOf(playerId);

  if (index !== -1) {
    state.manualByes.splice(index, 1);
    renderSchedule();
    return;
  }

  const playersNeeded = state.courts * 4;
  const totalPlayers = state.leaderboard.length;
  const maxResting = Math.max(0, totalPlayers - playersNeeded);

  if (maxResting === 0) {
    showToast(`All ${totalPlayers} players needed for ${state.courts} courts.`);
    return;
  }

  if (state.manualByes.length >= maxResting) {
    showToast(`Max ${maxResting} can rest. Deselect someone first.`);
    return;
  }

  state.manualByes.push(playerId);
  renderSchedule();
}
