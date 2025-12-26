// Schedule Module
// Schedule rendering, timer, round completion, and score handling

import { state, saveState, pushHistory } from "../state.js";
import { getElements } from "./elements.js";
import { getCourtName } from "./courts.js";
import {
  updateGridColumns,
  updateSliderMax,
  updateTextSize,
} from "./controls.js";
import { renderLeaderboard, getSortedLeaderboard } from "./leaderboard.js";
import { setRenderScheduleCallback } from "./setup.js";
import { showToast } from "../../shared/utils.js";
import { showConfirmModal, showInputModal } from "../modals.js";
import { renderRoundCard } from "./components/roundCard.js";
import { initTimer } from "./components/timerDisplay.js";

// timer variable removed (managed by timerDisplay.js implicitly, or returned)
// Actually timerDisplay.js module-level 'let timer' maintains the state across calls if we import the module.
// But we should probably rely on `initTimer` executing the side effects.

/**
 * Initialize match timer
 */
// initTimer moved to components/timerDisplay.js

/**
 * Render schedule/rounds
 */
export function renderSchedule() {
  const els = getElements();

  // Use extracted components
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
 * Render Game Details (Format, Scoring, etc)
 */
/**
 * Render Game Details (Format, Scoring, etc)
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

/**
 * Auto-fill score for total points mode
 */
export function autoFillScore(roundIndex, matchIndex, team, value) {
  // Always validate the round state, regardless of whether autofill logic runs
  // We use setTimeout to allow the value to settle in the DOM if needed,
  // though typically 'value' param is passed. validateRoundState checks DOM.
  setTimeout(validateRoundState, 0);

  let parsed = parseInt(value);
  if (isNaN(parsed) || parsed < 0) return;

  const maxPoints = parseInt(state.pointsPerMatch);
  if (isNaN(maxPoints) || maxPoints <= 0) return;

  if (state.scoringMode === "total") {
    if (parsed > maxPoints) {
      parsed = maxPoints;
      const currentInput = document.getElementById(
        `score-${roundIndex}-${matchIndex}-${team}`
      );
      if (currentInput) currentInput.value = parsed;
    }

    const otherTeam = team === 1 || team === "1" ? 2 : 1;
    const otherScore = maxPoints - parsed;
    const otherInput = document.getElementById(
      `score-${roundIndex}-${matchIndex}-${otherTeam}`
    );

    if (otherInput && otherScore >= 0) {
      otherInput.value = otherScore;
    }
  } else if (state.scoringMode === "race") {
    // Race Mode: If one team scores < Max, other MUST be Max.
    // If one team is Max, other can be anything < Max.

    // If entered score is LESS than target, assume they lost
    // Therefore, the OTHER team must have won (reached target)
    if (parsed < maxPoints) {
      const otherTeam = team === 1 || team === "1" ? 2 : 1;
      const otherInput = document.getElementById(
        `score-${roundIndex}-${matchIndex}-${otherTeam}`
      );

      if (otherInput) {
        otherInput.value = maxPoints;
      }
    } else if (parsed === maxPoints) {
      // If entered score IS target, set other to 0 (if empty)
      const otherTeam = team === 1 || team === "1" ? 2 : 1;
      const otherInput = document.getElementById(
        `score-${roundIndex}-${matchIndex}-${otherTeam}`
      );

      if (otherInput && otherInput.value === "") {
        otherInput.value = 0;
      }
    }
  }

  // Clear errors if valid inputs exist
  if (score1Input?.value !== "" && score2Input?.value !== "") {
    score1Input?.classList.remove("error");
    score2Input?.classList.remove("error");
  }
}

/**
 * Validate current round scores and toggle button
 */
export function validateRoundState() {
  const currentRoundIndex = state.schedule.findIndex((r) => !r.completed);
  if (currentRoundIndex === -1) return;

  const currentRound = state.schedule[currentRoundIndex];
  const btn = document.querySelector(".complete-round-btn");
  if (!btn) return;

  let isValid = true;
  const maxPoints = parseInt(state.pointsPerMatch);

  for (let i = 0; i < currentRound.matches.length; i++) {
    const s1Input = document.getElementById(
      `score-${currentRoundIndex}-${i}-1`
    );
    const s2Input = document.getElementById(
      `score-${currentRoundIndex}-${i}-2`
    );

    if (!s1Input || !s2Input) continue;

    const s1Val = s1Input.value;
    const s2Val = s2Input.value;

    if (s1Val === "" || s2Val === "") {
      isValid = false;
      break;
    }

    const s1 = parseInt(s1Val);
    const s2 = parseInt(s2Val);

    if (state.scoringMode === "total") {
      if (s1 + s2 !== maxPoints) {
        isValid = false;
        break;
      }
    } else {
      // For Race/Time, just ensure non-negative
      if (s1 < 0 || s2 < 0) {
        isValid = false;
        break;
      }
    }
  }

  // Never disable completely, just warn
  btn.disabled = false;

  if (!isValid) {
    btn.classList.add("btn-warning");
    btn.classList.remove("btn-success");
    btn.textContent = "Complete Anyway";
  } else {
    btn.classList.remove("btn-warning");
    btn.classList.add("btn-success");
    btn.textContent = `Complete Round ${currentRound.number}`;
  }
}

/**
 * Toggle round collapse
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
 * Toggle manual bye selection
 */
export function toggleManualBye(playerId) {
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

/**
 * Complete current round
 */
export function completeRound() {
  const currentRoundIndex = state.schedule.length - 1;
  const currentRound = state.schedule[currentRoundIndex];

  // 1. Validate all scores first
  let allScoresValid = true;
  const invalidCourts = [];

  currentRound.matches.forEach((match, matchIndex) => {
    const score1Input = document.getElementById(
      `score-${currentRoundIndex}-${matchIndex}-1`
    );
    const score2Input = document.getElementById(
      `score-${currentRoundIndex}-${matchIndex}-2`
    );

    const score1Value = score1Input?.value;
    const score2Value = score2Input?.value;

    let isMatchValid = true;

    // Check for empty inputs
    if (score1Value === "" || score2Value === "") {
      isMatchValid = false;
      if (score1Value === "") score1Input?.classList.add("error");
      if (score2Value === "") score2Input?.classList.add("error");
    }

    const score1 = parseInt(score1Value) || 0;
    const score2 = parseInt(score2Value) || 0;

    if (state.scoringMode === "total") {
      const maxPoints = parseInt(state.pointsPerMatch, 10);
      if (score1 + score2 !== maxPoints) {
        isMatchValid = false;
        score1Input?.classList.add("error");
        score2Input?.classList.add("error");
      } else if (score1Value !== "" && score2Value !== "") {
        score1Input?.classList.remove("error");
        score2Input?.classList.remove("error");
      }
    } else {
      if (score1 < 0 || score2 < 0) {
        isMatchValid = false;
        score1Input?.classList.add("error");
        score2Input?.classList.add("error");
      } else if (score1Value !== "" && score2Value !== "") {
        score1Input?.classList.remove("error");
        score2Input?.classList.remove("error");
      }
    }

    if (!isMatchValid) {
      allScoresValid = false;
      invalidCourts.push(getCourtName(match.court));
    }
  });

  if (!allScoresValid) {
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
        finalizeCompleteRound(currentRound);
      },
      true // isDanger
    );
    return;
  }

  // Special Validation for "Race" Mode
  // Warn if neither team reached the target score
  if (state.scoringMode === "race") {
    const incompleteRaceCourts = [];
    const targetScore = state.pointsPerMatch;

    currentRound.matches.forEach((match, matchIndex) => {
      const score1Input = document.getElementById(
        `score-${currentRoundIndex}-${matchIndex}-1`
      );
      const score2Input = document.getElementById(
        `score-${currentRoundIndex}-${matchIndex}-2`
      );
      const s1 = parseInt(score1Input?.value) || 0;
      const s2 = parseInt(score2Input?.value) || 0;

      if (s1 < targetScore && s2 < targetScore) {
        incompleteRaceCourts.push(getCourtName(match.court));
      }
    });

    if (incompleteRaceCourts.length > 0) {
      const courtsStr = incompleteRaceCourts.join(", ");

      // We must defer the rest of the function execution
      showConfirmModal(
        "Low Scores Detected",
        `On ${courtsStr}, neither team reached the target of ${targetScore}. Is this correct?`,
        "Yes, Complete Round",
        () => {
          finalizeCompleteRound(currentRound);
        },
        true // isDanger
      );
      return; // Stop here, wait for confirm
    }
  }

  // If no warnings, proceed directly
  finalizeCompleteRound(currentRound);
}

/**
 * The actual logic to complete the round, extracted for callback usage
 */
function finalizeCompleteRound(currentRound) {
  const currentRoundIndex = state.schedule.findIndex((r) => r === currentRound);

  // 2. Snapshot current ranks before updating stats
  // This ensures 'rank change' shows the diff from THIS round
  const currentSorted = getSortedLeaderboard();
  currentSorted.forEach((p, index) => {
    const player = state.leaderboard.find((lp) => lp.id === p.id);
    if (player) {
      player.previousRank = index + 1;
    }
  });

  // 3. Update stats
  currentRound.matches.forEach((match, matchIndex) => {
    const score1Input = document.getElementById(
      `score-${currentRoundIndex}-${matchIndex}-1`
    );
    const score2Input = document.getElementById(
      `score-${currentRoundIndex}-${matchIndex}-2`
    );

    const score1 = parseInt(score1Input?.value) || 0;
    const score2 = parseInt(score2Input?.value) || 0;

    match.score1 = score1;
    match.score2 = score2;

    const isDraw = score1 === score2;
    const team1Won = score1 > score2;
    const team2Won = score2 > score1;

    if (match.team1[1]) {
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

  // Animate the button before completing
  const completeBtn = document.querySelector(".complete-round-btn");
  if (completeBtn) {
    completeBtn.classList.add("completing");
    completeBtn.textContent = "✓ Completing...";
  }

  pushHistory();

  currentRound.completed = true;

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

  renderLeaderboard();
  renderSchedule();
  saveState();

  // Animate completed round with flash
  const completedRoundEl = document.getElementById(
    `round-${currentRoundIndex}`
  );
  if (completedRoundEl) {
    completedRoundEl.classList.add("complete-flash");
    setTimeout(() => completedRoundEl.classList.remove("complete-flash"), 1000);
  }

  // Show completion toast with indication of new round
  const completedRoundNum = currentRound.number;
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
      // Add entrance animation
      newRoundEl.classList.add("animate-in", "highlight");
      newRoundEl.scrollIntoView({ behavior: "smooth", block: "start" });

      // Remove animation classes after animation completes
      setTimeout(() => {
        newRoundEl.classList.remove("animate-in", "highlight");
      }, 1600);
    }
  }, 100);
}

/**
 * Edit a completed round
 */
export function editRound(roundIndex) {
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
