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
import { MatchTimer } from "../timer.js";
import {
  generateMexicanoNextRound,
  generateTeamMexicanoNextRound,
  updatePlayerStats,
  subtractPlayerStats,
} from "../scoring.js";

let timer = null;

/**
 * Initialize match timer
 */
function initTimer() {
  const els = getElements();
  if (!els.matchTimerContainer) return;

  if (state.scoringMode !== "time") {
    els.matchTimerContainer.style.display = "none";
    if (timer) {
      timer.pause();
      timer = null;
    }
    return;
  }

  els.matchTimerContainer.style.display = "flex";

  if (!timer) {
    timer = new MatchTimer({
      duration: state.pointsPerMatch || 12,
      onTimeUpdate: (time) => {
        if (els.timerDisplay) els.timerDisplay.textContent = time;
        document.title = `${time} - Tournament`;
      },
      onStatusChange: (status) => {
        if (status === "running") {
          els.timerStartBtn.style.display = "none";
          els.timerPauseBtn.style.display = "inline-block";
          els.matchTimerContainer.classList.add("running");
          els.matchTimerContainer.classList.remove("completed");

          if (els.runningBadge) {
            els.runningBadge.style.display = "inline-flex";
            els.runningBadge.classList.add("running");
          }
        } else if (status === "paused" || status === "idle") {
          els.timerStartBtn.style.display = "inline-block";
          els.timerPauseBtn.style.display = "none";
          els.matchTimerContainer.classList.remove("running");

          if (els.runningBadge) {
            els.runningBadge.style.display = "none";
            els.runningBadge.classList.remove("running");
          }

          if (status === "idle")
            els.matchTimerContainer.classList.remove("completed");
          document.title = "Tournament Generator - Padel Companion";
        } else if (status === "completed") {
          els.matchTimerContainer.classList.remove("running");
          els.matchTimerContainer.classList.add("completed");
          document.title = "TIME UP!";

          // Flash screen green
          document.body.classList.add("timer-finished-flash");
          setTimeout(() => {
            document.body.classList.remove("timer-finished-flash");
          }, 1000);
        }
      },
    });

    els.timerDisplay.textContent = timer.formatTime(state.pointsPerMatch * 60);

    els.timerStartBtn.onclick = () => timer.start();
    els.timerPauseBtn.onclick = () => timer.pause();
    els.timerResetBtn.onclick = () => timer.reset();
    els.timerAddBtn.onclick = () => timer.addTime(60);
    if (els.timerSubBtn) els.timerSubBtn.onclick = () => timer.addTime(-60);

    const editHandler = () => {
      const openModal = () => {
        showInputModal(
          "Set Timer Duration",
          "Enter minutes (e.g. 12)",
          (val) => {
            const minutes = parseInt(val);
            if (minutes > 0) {
              state.pointsPerMatch = minutes;
              saveState();
              timer.setDuration(minutes);
              showToast(`Timer set to ${minutes} minutes`);
            } else {
              showToast("Invalid minutes", "error");
            }
          }
        );
      };

      if (timer.isRunning) {
        showConfirmModal(
          "Pause Timer?",
          "The timer is currently running. Pause to change duration?",
          "Pause & Edit",
          () => {
            timer.pause();
            openModal();
          }
        );
      } else {
        openModal();
      }
    };

    els.timerDisplay.onclick = editHandler;
  } else {
    if (timer.duration !== state.pointsPerMatch) {
      timer.setDuration(state.pointsPerMatch);
    }
  }
}

/**
 * Render schedule/rounds
 */
export function renderSchedule() {
  const els = getElements();

  initTimer();
  renderGameDetails();

  const lastRoundIndex = state.schedule.length - 1;

  els.roundsContainer.innerHTML = state.schedule
    .map((round, roundIndex) => {
      const isLastRound = roundIndex === lastRoundIndex;
      const isCompleted = round.completed;
      const isCollapsed = isCompleted && !isLastRound;

      const roundSummary = isCompleted
        ? round.matches.map((m) => `${m.score1}-${m.score2}`).join(" · ")
        : "";

      return `
    <div class="round ${isCompleted ? "completed" : "ongoing"} ${
        isCollapsed ? "collapsed" : ""
      }" 
         id="round-${roundIndex}" 
         data-round="${roundIndex}">
      <div class="round-header" data-action="toggle-round" data-round="${roundIndex}">
        <span class="round-title">
          Round ${round.number}
          ${
            isCompleted
              ? `<span class="round-status completed">✓ Completed</span>`
              : `<span class="round-status ongoing">● Ongoing</span>`
          }
        </span>
        ${
          isCompleted
            ? `<span class="round-summary" style="${
                isCollapsed ? "" : "display: none"
              }">${roundSummary}</span>`
            : ""
        }
        ${
          isCompleted
            ? `<span class="collapse-icon">${isCollapsed ? "▶" : "▼"}</span>`
            : ""
        }
      </div>
      <div class="round-content">
        <div class="matches-grid">
          ${round.matches
            .map(
              (match, matchIndex) => `
            <div class="match-card-wrapper">
              <div class="match-card-header">
                <span class="court-label">${getCourtName(match.court)}</span>
                <span class="match-info-sub">
                  ${
                    state.scoringMode === "total"
                      ? `Total ${state.pointsPerMatch}`
                      : state.scoringMode === "race"
                      ? `Race to ${state.pointsPerMatch}`
                      : `${state.pointsPerMatch} mins`
                  }
                </span>
                ${
                  match.relaxedConstraint
                    ? `<span class="constraint-badge" title="${
                        match.relaxedConstraint === "repeats"
                          ? "Repeat allowed (Priority: Pattern)"
                          : match.relaxedConstraint === "pattern"
                          ? "Pattern override (Priority: Repeats)"
                          : "Constraint relaxed (Best effort)"
                      }">i</span>`
                    : ""
                }
              </div>
              <div class="match-card">
                <div class="match-teams">
                  <div class="team">
                    <span>${match.team1[0].name}</span>
                    ${
                      match.team1[1]
                        ? `<span>${match.team1[1].name}</span>`
                        : ""
                    }
                  </div>
                  <div class="team">
                    <span>${match.team2[0].name}</span>
                    ${
                      match.team2[1]
                        ? `<span>${match.team2[1].name}</span>`
                        : ""
                    }
                  </div>
                </div>
              </div>
              <div class="match-card-footer">
                ${
                  !isCompleted
                    ? `
                <div class="score-input-row">
                  <input type="number" class="score-input" id="score-${roundIndex}-${matchIndex}-1" 
                         min="0" max="${
                           state.scoringMode === "total"
                             ? state.pointsPerMatch
                             : 999
                         }" placeholder="0" 
                         value="${match.score1 || ""}"
                         data-action="autofill-score" data-round="${roundIndex}" data-match="${matchIndex}" data-team="1">
                  <span class="score-separator">-</span>
                  <input type="number" class="score-input" id="score-${roundIndex}-${matchIndex}-2" 
                         min="0" max="${
                           state.scoringMode === "total"
                             ? state.pointsPerMatch
                             : 999
                         }" placeholder="0"
                         value="${match.score2 || ""}"
                         data-action="autofill-score" data-round="${roundIndex}" data-match="${matchIndex}" data-team="2">
                </div>
                `
                    : `
                <div class="score-input-row">
                  <span class="score-display">${match.score1} - ${match.score2}</span>
                  <button class="btn btn-sm btn-ghost edit-score-btn" data-action="edit-round" data-round="${roundIndex}">Edit</button>
                </div>
                `
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        ${
          round.byes && round.byes.length > 0
            ? `
        <div class="waiting-players">
          <span class="waiting-label">Resting:</span>
          <span class="waiting-names">${round.byes
            .map((p) => p.name)
            .join(", ")}</span>
        </div>
        `
            : ""
        }
        ${
          !isCompleted && isLastRound
            ? `
        <div class="bye-selector">
          <div class="bye-selector-header">
            <span class="bye-selector-label">Toggle who rests next round:</span>
            <small class="bye-hint">(${
              state.manualByes.length
            } selected)</small>
          </div>
          <div class="bye-chips">
            ${state.leaderboard
              .map(
                (p) => `
              <button class="bye-chip ${
                state.manualByes.includes(p.id) ? "selected" : ""
              }" 
                      data-action="toggle-bye" data-id="${p.id}">
                ${p.name}
                <span class="bye-count">(${p.byeCount || 0})</span>
              </button>
            `
              )
              .join("")}
          </div>
        </div>
        <button class="btn btn-success complete-round-btn" data-action="complete-round">
          Complete Round ${round.number}
        </button>
        `
            : ""
        }
      </div>
    </div>
  `;
    })
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
