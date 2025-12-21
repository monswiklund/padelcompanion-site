// UI Rendering Module
// DOM manipulation and rendering functions

import { state, saveState, pushHistory, canUndo } from "./state.js";
import { showToast } from "../shared/utils.js";
import { showConfirmModal, showInputModal, showAlertModal } from "./modals.js";
import { saveToHistory } from "./history.js";
import {
  generateAmericanoSchedule,
  generateTeamSchedule,
  generateMexicanoFirstRound,
  generateMexicanoNextRound,
  generateTeamMexicanoFirstRound,
  generateTeamMexicanoNextRound,
  updatePlayerStats,
  subtractPlayerStats,
} from "./scoring.js";
import { MatchTimer } from "./timer.js";

// DOM element cache
let elements = null;
let timer = null; // Timer instance

/**
 * Initialize DOM element references
 */
export function initElements() {
  elements = {
    format: document.getElementById("format"),
    courts: document.getElementById("courts"),
    scoringMode: document.getElementById("scoringMode"),
    points: document.getElementById("points"),
    // ... items ...
    matchTimerContainer: document.getElementById("matchTimerContainer"),
    timerDisplay: document.getElementById("timerDisplay"),
    timerStartBtn: document.getElementById("timerStartBtn"),
    timerPauseBtn: document.getElementById("timerPauseBtn"),
    timerResetBtn: document.getElementById("timerResetBtn"),
    timerAddBtn: document.getElementById("timerAddBtn"),
    timerSubBtn: document.getElementById("timerSubBtn"),

    courtFormat: document.getElementById("courtFormat"),
    customCourtNamesSection: document.getElementById("customCourtNamesSection"),
    customCourtNamesList: document.getElementById("customCourtNamesList"),
    maxRepeats: document.getElementById("maxRepeats"),
    pairingStrategy: document.getElementById("pairingStrategy"),
    preferredPartnersList: document.getElementById("preferredPartnersList"),
    addPartnerPairBtn: document.getElementById("addPartnerPairBtn"),
    advancedSettingsContent: document.getElementById("advancedSettingsContent"),
    advancedToggleWrapper: document.getElementById("advancedToggleWrapper"),
    playerList: document.getElementById("playerList"),
    playerCount: document.getElementById("playerCount"),
    playersHint: document.getElementById("playersHint"),
    addPlayerBtn: document.getElementById("addPlayerBtn"),
    playerInputRow: document.getElementById("playerInputRow"),
    playerNameInput: document.getElementById("playerNameInput"),
    confirmAddBtn: document.getElementById("confirmAddBtn"),
    cancelAddBtn: document.getElementById("cancelAddBtn"),
    generateBtn: document.getElementById("generateBtn"),
    scheduleSection: document.getElementById("scheduleSection"),
    roundsContainer: document.getElementById("roundsContainer"),
    leaderboardSection: document.getElementById("leaderboardSection"),
    leaderboardBody: document.getElementById("leaderboardBody"),
    printBtn: document.getElementById("printBtn"),
    resetBtn: document.getElementById("resetBtn"),
    gridColumns: document.getElementById("gridColumns"),
    gridColumnsLabel: document.getElementById("gridColumnsLabel"),
    textSize: document.getElementById("textSize"),
    textSizeLabel: document.getElementById("textSizeLabel"),
    themeToggle: document.getElementById("themeToggle"),
    importPlayersBtn: document.getElementById("importPlayersBtn"),
    importModal: document.getElementById("importModal"),
    closeImportModal: document.getElementById("closeImportModal"),
    importTextarea: document.getElementById("importTextarea"),
    importStatus: document.getElementById("importStatus"),
    cancelImportBtn: document.getElementById("cancelImportBtn"),
    confirmImportBtn: document.getElementById("confirmImportBtn"),
    clearAllPlayersBtn: document.getElementById("clearAllPlayersBtn"),
  };
  return elements;
}

/**
 * Get elements (init if needed)
 */
export function getElements() {
  if (!elements) initElements();
  return elements;
}

// ===== Court Naming =====
export function getCourtName(courtNumber) {
  switch (state.courtFormat) {
    case "number":
      return `${courtNumber}`;
    case "court":
      return `Court ${courtNumber}`;
    case "custom":
      return state.customCourtNames[courtNumber - 1] || `Court ${courtNumber}`;
    default:
      return `Court ${courtNumber}`;
  }
}

// ===== Courts Validation =====
export function validateCourts() {
  const els = getElements();
  const courtsInput = els.courts;
  const warning = document.getElementById("courtsWarning");

  if (!courtsInput || !warning) return true;

  const courts = parseInt(courtsInput.value) || 1;
  const format = els.format?.value || state.format;
  const playersPerCourt =
    format === "team" || format === "teamMexicano" ? 2 : 4;
  const maxCourts = Math.floor(state.players.length / playersPerCourt);

  // Update max attribute dynamically
  courtsInput.max = Math.max(1, maxCourts);

  if (courts > maxCourts && maxCourts > 0) {
    warning.textContent = `⚠️ ${
      state.players.length
    } players can only fill ${maxCourts} court${maxCourts !== 1 ? "s" : ""}`;
    warning.style.display = "block";
    courtsInput.classList.add("input-warning");
    return false;
  } else if (maxCourts === 0 && state.players.length > 0) {
    warning.textContent = `⚠️ Need at least ${playersPerCourt} players for 1 court`;
    warning.style.display = "block";
    courtsInput.classList.add("input-warning");
    return false;
  } else {
    warning.style.display = "none";
    courtsInput.classList.remove("input-warning");
    return true;
  }
}

export function toggleCustomCourtNames() {
  const els = getElements();
  if (!els.customCourtNamesSection) return;

  const isCustom = state.courtFormat === "custom";

  if (isCustom) {
    els.customCourtNamesSection.style.display = "flex";
    renderCustomCourtNames();
  } else {
    els.customCourtNamesSection.style.display = "none";
  }
}

export function renderCustomCourtNames() {
  const els = getElements();
  if (!els.customCourtNamesList) return;

  const count = Math.max(1, state.courts || 2);

  // Ensure array has enough slots
  if (!Array.isArray(state.customCourtNames)) {
    state.customCourtNames = [];
  }

  // Fill with defaults if missing
  while (state.customCourtNames.length < count) {
    state.customCourtNames.push(`Court ${state.customCourtNames.length + 1}`);
  }

  els.customCourtNamesList.innerHTML = Array.from(
    { length: count },
    (_, i) => `
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${(state.customCourtNames[i] || `Court ${i + 1}`).replace(
               /"/g,
               "&quot;"
             )}"
             oninput="window.updateCustomCourtName(${i}, this.value)"
             placeholder="Court ${i + 1}">
    </div>
  `
  ).join("");
}

export function updateCustomCourtName(index, value) {
  state.customCourtNames[index] = value || `Court ${index + 1}`;
  saveState();
}

// ===== Player List Rendering =====
export function renderPlayers() {
  const els = getElements();

  els.playerList.innerHTML = state.players
    .map(
      (player, index) => `
    <li class="player-item" data-id="${player.id}">
      <span><span class="player-number">${index + 1}.</span> ${
        player.name
      }</span>
      <button class="player-remove" onclick="window.removePlayer(${
        player.id
      })">×</button>
    </li>
  `
    )
    .join("");

  els.playerCount.textContent = `(${state.players.length})`;
  els.generateBtn.disabled = state.players.length < 4;

  if (state.players.length >= 4) {
    els.playersHint.textContent = `${state.players.length} players ready`;
    els.playersHint.style.color = "var(--success)";
  } else {
    els.playersHint.textContent = `Add at least ${
      4 - state.players.length
    } more player${4 - state.players.length > 1 ? "s" : ""}`;
    els.playersHint.style.color = "";
  }

  renderPreferredPartners();
  updateAddPartnerPairButton();
  updatePlayerToggleBtn();
  validateCourts();
}

export function showPlayerInput() {
  const els = getElements();
  els.playerInputRow.style.display = "flex";
  els.addPlayerBtn.style.display = "none";
  els.playerNameInput.focus();
}

export function hidePlayerInput() {
  const els = getElements();
  els.playerInputRow.style.display = "none";
  els.addPlayerBtn.style.display = "block";
  els.playerNameInput.value = "";
}

// ===== Collapsible Player List =====
export function togglePlayerList() {
  const wrapper = document.getElementById("playerListWrapper");
  const btn = document.getElementById("expandPlayersBtn");

  if (wrapper.classList.contains("expanded")) {
    wrapper.classList.remove("expanded");
    btn.innerHTML = `Show All Players (${state.players.length}) ▼`;
  } else {
    wrapper.classList.add("expanded");
    btn.innerHTML = "Show Less ▲";
  }
}

function updatePlayerToggleBtn() {
  const btn = document.getElementById("expandPlayersBtn");
  const wrapper = document.getElementById("playerListWrapper");
  if (btn && !wrapper?.classList.contains("expanded")) {
    btn.innerHTML = `Show All Players (${state.players.length}) ▼`;
  }
}

// ===== Preferred Partners Rendering =====
function updateAddPartnerPairButton() {
  const els = getElements();
  const pairedPlayerIds = new Set();
  state.preferredPartners.forEach((pair) => {
    pairedPlayerIds.add(pair.player1Id);
    pairedPlayerIds.add(pair.player2Id);
  });
  const available = state.players.filter((p) => !pairedPlayerIds.has(p.id));
  els.addPartnerPairBtn.disabled = available.length < 2;
}

export function renderPreferredPartners() {
  const els = getElements();

  const getAllPairedIds = (excludePairId) => {
    const ids = new Set();
    state.preferredPartners.forEach((p) => {
      if (p.id !== excludePairId) {
        ids.add(p.player1Id);
        ids.add(p.player2Id);
      }
    });
    return ids;
  };

  els.preferredPartnersList.innerHTML = state.preferredPartners
    .map((pair) => {
      const pairedElsewhere = getAllPairedIds(pair.id);
      const available = state.players.filter(
        (p) =>
          p.id === pair.player1Id ||
          p.id === pair.player2Id ||
          !pairedElsewhere.has(p.id)
      );

      const availableFor1 = available.filter(
        (p) => p.id !== pair.player2Id || p.id === pair.player1Id
      );
      const availableFor2 = available.filter(
        (p) => p.id !== pair.player1Id || p.id === pair.player2Id
      );

      return `
        <div class="partner-pair" data-pair-id="${pair.id}">
          <select class="form-select" onchange="window.updatePreferredPair(${
            pair.id
          }, 1, parseInt(this.value))">
            ${availableFor1
              .map(
                (p) =>
                  `<option value="${p.id}" ${
                    p.id === pair.player1Id ? "selected" : ""
                  }>${p.name}</option>`
              )
              .join("")}
          </select>
          <span class="pair-separator">&</span>
          <select class="form-select" onchange="window.updatePreferredPair(${
            pair.id
          }, 2, parseInt(this.value))">
            ${availableFor2
              .map(
                (p) =>
                  `<option value="${p.id}" ${
                    p.id === pair.player2Id ? "selected" : ""
                  }>${p.name}</option>`
              )
              .join("")}
          </select>
          <button class="remove-pair-btn" onclick="window.removePreferredPair(${
            pair.id
          })">Remove</button>
        </div>
      `;
    })
    .join("");
}

// ===== Import Modal =====
export function showImportModal() {
  const els = getElements();
  els.importModal.style.display = "flex";
  els.importTextarea.value = "";
  els.importStatus.textContent = "";
  els.importTextarea.focus();
}

export function hideImportModal() {
  const els = getElements();
  els.importModal.style.display = "none";
}

// ===== Timer Logic =====
function initTimer() {
  const els = getElements();
  if (!els.matchTimerContainer) return;

  // Check if we need a timer (Time mode)
  if (state.scoringMode !== "time") {
    els.matchTimerContainer.style.display = "none";
    if (timer) {
      timer.pause();
      timer = null;
    }
    return;
  }

  els.matchTimerContainer.style.display = "flex";

  // Create new timer if not exists or if duration changed
  if (!timer) {
    timer = new MatchTimer({
      duration: state.pointsPerMatch || 12, // In time mode, pointsPerMatch is minutes
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
        } else if (status === "paused" || status === "idle") {
          els.timerStartBtn.style.display = "inline-block";
          els.timerPauseBtn.style.display = "none";
          els.matchTimerContainer.classList.remove("running");
          if (status === "idle")
            els.matchTimerContainer.classList.remove("completed");
          document.title = "Tournament Generator - Padel Companion";
        } else if (status === "completed") {
          els.matchTimerContainer.classList.remove("running");
          els.matchTimerContainer.classList.add("completed");
          document.title = "TIME UP!";
        }
      },
    });

    // Initial render
    els.timerDisplay.textContent = timer.formatTime(state.pointsPerMatch * 60);

    // Bind Controls (ensure we don't double bind if init runs multiple times)
    // A cleaner way is to set onclick directly
    els.timerStartBtn.onclick = () => timer.start();
    els.timerPauseBtn.onclick = () => timer.pause();
    els.timerResetBtn.onclick = () => timer.reset();
    els.timerAddBtn.onclick = () => timer.addTime(60);
    if (els.timerSubBtn) els.timerSubBtn.onclick = () => timer.addTime(-60);

    // Add click listener to change duration
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
    // Just update duration if it changed
    if (timer.duration !== state.pointsPerMatch) {
      timer.setDuration(state.pointsPerMatch);
    }
  }
}

// ===== Schedule Rendering =====
export function renderSchedule() {
  const els = getElements();

  // Initialize timer if needed
  initTimer();

  const lastRoundIndex = state.schedule.length - 1;

  els.roundsContainer.innerHTML = state.schedule
    .map((round, roundIndex) => {
      const isLastRound = roundIndex === lastRoundIndex;
      const isCompleted = round.completed;
      // Completed rounds are collapsed by default, current round is always expanded
      const isCollapsed = isCompleted && !isLastRound;

      // Generate a short summary for collapsed view
      const roundSummary = isCompleted
        ? round.matches.map((m) => `${m.score1}-${m.score2}`).join(" · ")
        : "";

      return `
    <div class="round ${isCompleted ? "completed" : ""} ${
        isCollapsed ? "collapsed" : ""
      }" 
         id="round-${roundIndex}" 
         data-round="${roundIndex}">
      <div class="round-header" onclick="window.toggleRoundCollapse(${roundIndex})">
        <span class="round-title">
          Round ${round.number} ${isCompleted ? "(done)" : ""}
        </span>
        ${
          isCollapsed
            ? `<span class="round-summary">${roundSummary}</span>`
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
            <div class="match-card">
              <div class="court-label">${getCourtName(match.court)}</div>
              <div class="match-info-sub" style="font-size: 0.8em; color: var(--text-secondary); margin-bottom: 4px;">
                ${
                  state.scoringMode === "total"
                    ? `Total ${state.pointsPerMatch}`
                    : state.scoringMode === "race"
                    ? `Race to ${state.pointsPerMatch}`
                    : `${state.pointsPerMatch} mins`
                }
              </div>
              <div class="match-teams">
                <div class="team">
                  <span>${match.team1[0].name}</span>
                  ${match.team1[1] ? `<span>${match.team1[1].name}</span>` : ""}
                </div>
                <div class="team">
                  <span>${match.team2[0].name}</span>
                  ${match.team2[1] ? `<span>${match.team2[1].name}</span>` : ""}
                </div>
              </div>
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
                       oninput="window.autoFillScore(${roundIndex}, ${matchIndex}, 1, this.value)">
                <span class="score-separator">-</span>
                <input type="number" class="score-input" id="score-${roundIndex}-${matchIndex}-2" 
                       min="0" max="${
                         state.scoringMode === "total"
                           ? state.pointsPerMatch
                           : 999
                       }" placeholder="0"
                       value="${match.score2 || ""}"
                       oninput="window.autoFillScore(${roundIndex}, ${matchIndex}, 2, this.value)">
              </div>
              `
                  : `
              <div class="score-input-row">
                <span class="score-display">${match.score1} - ${match.score2}</span>
                <button class="btn btn-sm btn-ghost edit-score-btn" onclick="window.editRound(${roundIndex})">Edit</button>
              </div>
              `
              }
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
                      onclick="window.toggleManualBye(${p.id})">
                ${p.name}
                <span class="bye-count">(${p.byeCount || 0})</span>
              </button>
            `
              )
              .join("")}
          </div>
        </div>
        <button class="btn btn-primary complete-round-btn" onclick="window.completeRound()">
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
}

// ===== Leaderboard Rendering =====
export function renderLeaderboard() {
  const els = getElements();

  // Sync toggle buttons state
  const visBtn = document.getElementById("toggleVisibilityBtn");
  if (visBtn) {
    visBtn.textContent = state.hideLeaderboard
      ? "Show Standings"
      : "Hide Standings";
    visBtn.title = state.hideLeaderboard
      ? "Show Leaderboard"
      : "Hide Leaderboard";
  }

  const posBtn = document.getElementById("togglePositionBtn");
  if (posBtn) {
    posBtn.textContent = state.showPositionChanges
      ? "Hide Rank Diff"
      : "Show Rank Diff";
    posBtn.title = state.showPositionChanges
      ? "Hide Rank Changes"
      : "Show Rank Changes";
  }

  if (!state.leaderboard || state.leaderboard.length === 0) {
    els.leaderboardBody.innerHTML =
      '<tr><td colspan="7" class="text-center">No players yet</td></tr>';
    return;
  }

  // Sort Logic
  const sorted = [...state.leaderboard].sort((a, b) => {
    switch (state.rankingCriteria) {
      case "wins":
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.points !== a.points) return b.points - a.points;
        return b.points - b.pointsLost - (a.points - a.pointsLost);

      case "winRatio":
        const aRate = a.played > 0 ? a.wins / a.played : 0;
        const bRate = b.played > 0 ? b.wins / b.played : 0;
        if (Math.abs(bRate - aRate) > 0.001) return bRate - aRate;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.points - a.points;

      case "pointRatio":
        const aTotal = a.points + a.pointsLost;
        const bTotal = b.points + b.pointsLost;
        const aPRate = aTotal > 0 ? a.points / aTotal : 0;
        const bPRate = bTotal > 0 ? b.points / bTotal : 0;
        if (Math.abs(bPRate - aPRate) > 0.001) return bPRate - aPRate;
        return b.points - a.points;

      case "points":
      default:
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.points - b.pointsLost - (a.points - a.pointsLost);
    }
  });

  if (state.hideLeaderboard) {
    const shuffled = [...sorted].sort(() => Math.random() - 0.5);
    els.leaderboardBody.innerHTML = shuffled
      .map(
        (player) => `
    <tr>
      <td>-</td>
      <td>${player.name}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>${player.played}</td>
    </tr>
  `
      )
      .join("");
  } else {
    // Calculate position changes
    sorted.forEach((player, index) => {
      const currentRank = index + 1;
      const prevRank = player.previousRank || currentRank;
      player.rankChange = prevRank - currentRank;
      player.previousRank = currentRank;
    });

    els.leaderboardBody.innerHTML = sorted
      .map((player, index) => {
        let changeIndicator = "";
        if (state.showPositionChanges && player.played > 0) {
          if (player.rankChange > 0) {
            changeIndicator = '<span class="rank-up">▲</span>';
          } else if (player.rankChange < 0) {
            changeIndicator = '<span class="rank-down">▼</span>';
          } else {
            changeIndicator = '<span class="rank-same">●</span>';
          }
        }

        const diff = player.points - (player.pointsLost || 0);
        const winRate =
          player.played > 0
            ? Math.round(((player.wins || 0) / player.played) * 100)
            : 0;
        const diffSign = diff > 0 ? "+" : "";

        return `
    <tr>
      <td>${index + 1} ${changeIndicator}</td>
      <td class="player-name-cell">${player.name}</td>
      <td class="font-bold">${player.points}</td>
      <td>${player.wins || 0}</td>
      <td class="${
        diff > 0 ? "text-success" : diff < 0 ? "text-error" : ""
      }">${diffSign}${diff}</td>
      <td>${winRate}%</td>
      <td>${player.played}</td>
    </tr>
  `;
      })
      .join("");
  }
}

// ===== Settings Lock/Unlock UI =====
export function updateSetupUI() {
  const els = getElements();
  const format = state.format; // Use state.format as the source of truth
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
  const advancedSettingsContent = document.getElementById("advancedSettingsContent");
  const advancedToggleWrapper = document.getElementById("advancedToggleWrapper");
  const maxRepeatsContainer = document.getElementById("maxRepeatsContainer");
  const pairingStrategyContainer = document.getElementById("pairingStrategyContainer");
  const preferredPartnersContainer = document.getElementById("preferredPartnersContainer");

  // Mexicano: All rules
  // Team Mexicano: Only Max Repeats (Strategy is N/A for fixed teams, Partners N/A)
  const isMexicano = format === "mexicano";
  const isTeamMexicano = format === "teamMexicano";
  const isMexicanoRelated = isMexicano || isTeamMexicano;

  if (advancedToggleWrapper) {
    const shouldShowWrapper = isMexicanoRelated;
    advancedToggleWrapper.style.setProperty("display", shouldShowWrapper ? "flex" : "none", "important");
  }

  if (advancedSettingsContent) {
    // If it's a Mexicano format, ensure content is shown if it was hidden
    if (isMexicanoRelated) {
       advancedSettingsContent.style.setProperty("display", "block", "important");
    } else {
      advancedSettingsContent.style.setProperty("display", "none", "important");
    }
    
    // Update toggle button state to match visibility
    const btn = document.getElementById("advancedSettingsToggle");
    if (btn) {
      const isVisible = advancedSettingsContent.style.display !== "none";
      const text = btn.querySelector(".toggle-text");
      const icon = btn.querySelector(".toggle-icon");
      
      btn.classList.toggle("expanded", isVisible);
      if (text) text.textContent = isVisible ? "Hide Advanced Settings" : "Show Advanced Settings";
      if (icon) icon.style.transform = isVisible ? "rotate(180deg)" : "rotate(0deg)";
    }
  }

  if (maxRepeatsContainer) {
    maxRepeatsContainer.style.setProperty("display", isMexicanoRelated ? "flex" : "none", "important");
  }

  if (pairingStrategyContainer) {
    pairingStrategyContainer.style.setProperty("display", isMexicano ? "flex" : "none", "important");
  }
  
  if (preferredPartnersContainer) {
    preferredPartnersContainer.style.setProperty("display", isMexicano ? "block" : "none", "important");
  }

  // Disable "Strict Pattern" if strategy is Optimal (redundant)
  const strictStrategy = document.getElementById("strictStrategy");
  if (strictStrategy && els.pairingStrategy) {
    const isOptimal = els.pairingStrategy.value === "optimal";
    strictStrategy.disabled = isOptimal;
    if (strictStrategy.parentElement) {
      strictStrategy.parentElement.style.opacity = isOptimal ? "0.5" : "1";
    }
  }

  // Update Undo Button
  const undoBtn = document.getElementById("undoBtn");
  if (undoBtn) {
    undoBtn.disabled = !canUndo();
  }
}

// ===== Grid and Text Size Controls =====
let isManualMode = false;

export function updateGridColumns() {
  const els = getElements();
  const cols = state.gridColumns;
  const grids = document.querySelectorAll(".matches-grid");

  if (els.gridColumns) {
    els.gridColumns.value = cols;
  }

  if (cols === 0) {
    if (els.gridColumnsLabel) els.gridColumnsLabel.textContent = "Auto";
    grids.forEach((grid) => {
      grid.style.gridTemplateColumns = "";
    });
  } else {
    if (els.gridColumnsLabel) els.gridColumnsLabel.textContent = cols;
    grids.forEach((grid) => {
      grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    });
  }
}

// ===== Scoring Label =====
export function updateScoringLabel() {
  const mode = document.getElementById("scoringMode")?.value || state.scoringMode;
  const label = document.getElementById("scoringValueLabel");
  const input = document.getElementById("points");

  if (!label || !input) return;

  if (mode === "total") {
    label.textContent = "Total Points (Score A + B)";
    input.value = 24;
  } else if (mode === "race") {
    label.textContent = "Winning Score (First to...)";
    input.value = 21;
  } else if (mode === "time") {
    label.textContent = "Match Duration (Minutes)";
    input.value = 12;
  }
}

function updateSliderMax() {
  const els = getElements();
  if (!els.gridColumns) return;

  let maxCourts = state.courts || 2;
  if (state.schedule.length > 0) {
    const currentRound = state.schedule[state.schedule.length - 1];
    if (currentRound && currentRound.matches) {
      maxCourts = Math.max(maxCourts, currentRound.matches.length);
    }
  }

  maxCourts = Math.min(Math.max(maxCourts, 1), 6);
  els.gridColumns.max = maxCourts;
  state.maxCourts = maxCourts;

  if (state.gridColumns > maxCourts && state.gridColumns !== 0) {
    state.gridColumns = maxCourts;
    updateGridColumns();
  }
}

function calculateAutoColumns() {
  const grid = document.querySelector(".matches-grid");
  if (!grid) return state.maxCourts || 2;

  const gridWidth = grid.offsetWidth;
  const minCardWidth = 180;
  const optimalColumns = Math.floor(gridWidth / minCardWidth);

  const maxCourts = state.maxCourts || state.courts || 2;
  return Math.min(Math.max(optimalColumns, 1), maxCourts);
}

export function handleResize() {
  const els = getElements();
  if (isManualMode || state.gridColumns !== 0) return;

  const autoCols = calculateAutoColumns();
  const grids = document.querySelectorAll(".matches-grid");

  grids.forEach((grid) => {
    grid.style.gridTemplateColumns = `repeat(${autoCols}, 1fr)`;
  });

  if (els.gridColumns) {
    els.gridColumns.value = autoCols;
  }
  if (els.gridColumnsLabel) {
    els.gridColumnsLabel.textContent = `Auto (${autoCols})`;
  }
}

export function onSliderManualChange() {
  const els = getElements();
  const value = parseInt(els.gridColumns.value);
  if (value === 0) {
    isManualMode = false;
    handleResize();
  } else {
    isManualMode = true;
  }
  state.gridColumns = value;
  updateGridColumns();
  saveState();
}

export function updateTextSize() {
  const els = getElements();
  const size = state.textSize;
  const scale = size / 100;

  const scheduleSection = document.getElementById("scheduleSection");
  if (scheduleSection) {
    scheduleSection.style.setProperty("--text-scale", scale);
  }

  if (els.textSize) {
    els.textSize.value = size;
  }
  if (els.textSizeLabel) {
    els.textSizeLabel.textContent = `${size}%`;
  }
}

export function updateRoundScale() {
  const roundScaleInput = document.getElementById("roundScale");
  const roundScaleLabel = document.getElementById("roundScaleLabel");
  const scheduleSection = document.getElementById("scheduleSection");

  if (!roundScaleInput) return;

  const size = parseInt(roundScaleInput.value);
  const scale = size / 100;

  if (scheduleSection) {
    scheduleSection.style.setProperty("--round-scale", scale);
  }

  if (roundScaleLabel) {
    roundScaleLabel.textContent = `${size}%`;
  }
}

// ===== Custom Select Logic =====
export function setupCustomSelects() {
  const selects = document.querySelectorAll(".form-select");

  selects.forEach((select) => {
    // Skip if already initialized or if explicitly excluded
    if (
      select.closest(".custom-select-wrapper") ||
      select.classList.contains("no-custom")
    )
      return;

    const wrapper = document.createElement("div");
    wrapper.classList.add("custom-select-wrapper");
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    // Create custom UI
    const customSelect = document.createElement("div");
    customSelect.classList.add("custom-select");

    const trigger = document.createElement("div");
    trigger.classList.add("custom-select-trigger");
    if (select.classList.contains("btn-sm")) {
      trigger.classList.add("btn-sm");
    }
    trigger.innerHTML = `<span>${
      select.options[select.selectedIndex].text
    }</span>`;

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("custom-options");

    // Populate options
    Array.from(select.options).forEach((option) => {
      const optionEl = document.createElement("div");
      optionEl.classList.add("custom-option");
      optionEl.textContent = option.text;
      optionEl.dataset.value = option.value;
      if (option.selected) optionEl.classList.add("selected");

      optionEl.addEventListener("click", () => {
        // Update original select
        select.value = option.dataset.value;
        // Dispatch event with bubbling to ensure all listeners (including global ones) catch it
        select.dispatchEvent(new Event("change", { bubbles: true }));

        // Update UI
        trigger.innerHTML = `<span>${option.text}</span>`;
        optionsDiv
          .querySelectorAll(".custom-option")
          .forEach((el) => el.classList.remove("selected"));
        optionEl.classList.add("selected");

        // Close
        customSelect.classList.remove("open");
        optionsDiv.classList.remove("show");
      });

      optionsDiv.appendChild(optionEl);
    });

    customSelect.appendChild(trigger);
    customSelect.appendChild(optionsDiv);
    wrapper.appendChild(customSelect);

    // Toggle logic
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();

      // Close other open selects
      document.querySelectorAll(".custom-select.open").forEach((el) => {
        if (el !== customSelect) {
          el.classList.remove("open");
          el.querySelector(".custom-options").classList.remove("show");
        }
      });

      customSelect.classList.toggle("open");
      optionsDiv.classList.toggle("show");
    });

    // Hide original select visually but keep it for logic
    select.style.display = "none";
  });

  // Global click outside to close
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-select")) {
      document.querySelectorAll(".custom-select.open").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".custom-options").classList.remove("show");
      });
    }
  });
}

// ===== Score Auto-Fill =====
export function autoFillScore(roundIndex, matchIndex, team, value) {
  let parsed = parseInt(value);
  if (isNaN(parsed) || parsed < 0) return;

  // Only apply for "Total Points" mode (e.g. Americano 24/32 pts)
  if (state.scoringMode !== "total") return;

  // Ensure pointsPerMatch is valid
  const maxPoints = parseInt(state.pointsPerMatch);
  if (isNaN(maxPoints) || maxPoints <= 0) return;

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

    // Also update class for validation styling
    const currentInput = document.getElementById(
      `score-${roundIndex}-${matchIndex}-${team}`
    );
    if (currentInput) currentInput.classList.remove("error");
    otherInput.classList.remove("error");
  }
}

// ===== Toggle Round Collapse =====
export function toggleRoundCollapse(roundIndex) {
  const roundEl = document.getElementById(`round-${roundIndex}`);
  if (!roundEl) return;

  const isCurrentlyCollapsed = roundEl.classList.contains("collapsed");

  if (isCurrentlyCollapsed) {
    // Expand
    roundEl.classList.remove("collapsed");
    const icon = roundEl.querySelector(".collapse-icon");
    if (icon) icon.textContent = "▼";
    // Hide summary when expanded
    const summary = roundEl.querySelector(".round-summary");
    if (summary) summary.style.display = "none";
  } else {
    // Collapse
    roundEl.classList.add("collapsed");
    const icon = roundEl.querySelector(".collapse-icon");
    if (icon) icon.textContent = "▶";
    // Show summary when collapsed
    const summary = roundEl.querySelector(".round-summary");
    if (summary) summary.style.display = "";
  }
}

// ===== Manual Bye Selection =====
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

// ===== Complete Round =====
export function completeRound() {
  const currentRoundIndex = state.schedule.length - 1;
  const currentRound = state.schedule[currentRoundIndex];

  let allScoresValid = true;
  currentRound.matches.forEach((match, matchIndex) => {
    const score1Input = document.getElementById(
      `score-${currentRoundIndex}-${matchIndex}-1`
    );
    const score2Input = document.getElementById(
      `score-${currentRoundIndex}-${matchIndex}-2`
    );

    const score1 = parseInt(score1Input?.value) || 0;
    const score2 = parseInt(score2Input?.value) || 0;

    if (state.scoringMode === "total") {
      if (score1 + score2 !== state.pointsPerMatch) {
        allScoresValid = false;
        score1Input?.classList.add("error");
        score2Input?.classList.add("error");
      } else {
        score1Input?.classList.remove("error");
        score2Input?.classList.remove("error");
      }
    } else {
      if (score1 < 0 || score2 < 0) {
        allScoresValid = false;
        score1Input?.classList.add("error");
        score2Input?.classList.add("error");
      } else {
        score1Input?.classList.remove("error");
        score2Input?.classList.remove("error");
      }
    }

    match.score1 = score1;
    match.score2 = score2;

    const isDraw = score1 === score2;
    const team1Won = score1 > score2;
    const team2Won = score2 > score1;

    // Update stats - handle both 1v1 and 2v2
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

  if (!allScoresValid) {
    if (state.scoringMode === "total") {
      showToast(`Scores must sum to ${state.pointsPerMatch}`);
    } else {
      showToast("Please enter valid positive scores");
    }
    return;
  }

  pushHistory();

  currentRound.completed = true;

  // Increment byeCount
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

  // Generate next round
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
    if (state.currentRound <= 8) {
      const nextRound = generateTeamMexicanoNextRound();
      if (nextRound.matches.length > 0) {
        state.schedule.push(nextRound);
      }
    }
  } else if (state.format === "mexicano") {
    if (state.currentRound <= 8) {
      const nextRound = generateMexicanoNextRound(state.leaderboard);
      if (nextRound.matches.length > 0) {
        state.schedule.push(nextRound);
      }
    }
  }

  const els = getElements();
  renderLeaderboard();
  renderSchedule();
  saveState();

  // Scroll to the new round with a slight delay to ensure DOM is updated
  setTimeout(() => {
    const newRoundIndex = state.schedule.length - 1;
    const newRoundEl = document.getElementById(`round-${newRoundIndex}`);
    if (newRoundEl) {
      newRoundEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 100);
}

// ===== Edit Round =====
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

  // Subtract points
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

// ===== Generate Schedule =====
export function generateSchedule() {
  const els = getElements();

  state.format = els.format.value;
  state.courts = parseInt(els.courts.value);
  state.scoringMode = els.scoringMode.value;
  state.pointsPerMatch = parseInt(els.points.value);
  state.currentRound = 1;

  // Validate player count vs courts
  const playersNeededPerCourt =
    state.format === "team" || state.format === "teamMexicano" ? 2 : 4;
  const maxPossibleCourts = Math.floor(
    state.players.length / playersNeededPerCourt
  );

  const startGeneration = () => {
    pushHistory();
    // Reset leaderboard
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
    renderSchedule();
    els.scheduleSection.style.display = "block";

    // Show tournament actions footer
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

    // Auto-adjust courts with toast notification
    const oldCourts = state.courts;
    state.courts = maxPossibleCourts;
    if (els.courts) els.courts.value = state.courts;
    showToast(`Adjusted courts: ${oldCourts} → ${maxPossibleCourts}`);
  }

  startGeneration();
}

// ===== Reset Schedule =====
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
    true // isDanger
  );
}

// ===== Leaderboard Visibility Toggles =====
export function toggleLeaderboardVisibility() {
  state.hideLeaderboard = !state.hideLeaderboard;

  const btn = document.getElementById("toggleVisibilityBtn");
  if (btn) {
    btn.textContent = state.hideLeaderboard
      ? "Show Standings"
      : "Hide Standings";
    btn.title = state.hideLeaderboard ? "Show Leaderboard" : "Hide Leaderboard";
  }

  renderLeaderboard();
  saveState();
}

export function togglePositionChanges() {
  state.showPositionChanges = !state.showPositionChanges;

  const btn = document.getElementById("togglePositionBtn");
  if (btn) {
    btn.textContent = state.showPositionChanges
      ? "Hide Rank Diff"
      : "Show Rank Diff";
    btn.title = state.showPositionChanges
      ? "Hide Rank Changes"
      : "Show Rank Changes";
  }

  renderLeaderboard();
  saveState();
}

export function updateRankingCriteria() {
  const select = document.getElementById("rankingCriteria");
  if (select) {
    state.rankingCriteria = select.value;
    renderLeaderboard();
    saveState();
  }
}

// ===== End Tournament =====
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

      // Save to history before showing standings
      saveToHistory();
      showToast("Tournament saved to history");

      if (showFinalStandingsCallback) {
        showFinalStandingsCallback(sorted);
      }

      saveState();
    },
    true // isDanger
  );
}

// ===== Advanced Settings Toggle =====
export function toggleAdvancedSettings() {
  const content = document.getElementById("advancedSettingsContent");
  const btn = document.getElementById("advancedSettingsToggle");
  if (!content || !btn) return;

  const text = btn.querySelector(".toggle-text");
  const icon = btn.querySelector(".toggle-icon");

  if (content.style.display === "none") {
    content.style.display = "block";
    btn.classList.add("expanded");
    if (text) text.textContent = "Hide Advanced Settings";
    if (icon) icon.style.transform = "rotate(180deg)";
  } else {
    content.style.display = "none";
    btn.classList.remove("expanded");
    if (text) text.textContent = "Show Advanced Settings";
    if (icon) icon.style.transform = "rotate(0deg)";
  }
}

// ===== Toolbar Toggle =====
export function toggleToolbar() {
  const toolbar = document.getElementById("scheduleToolbar");
  toolbar.classList.toggle("collapsed");
}

// ===== Export Data =====
export function exportTournamentData(data = null) {
  const target = data || state;
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();
  let csvContent = `data:text/csv;charset=utf-8,`;

  // 1. Header Info
  csvContent += `Tournament Results\n`;
  csvContent += `Date,${date} ${time}\n`;
  csvContent += `Format,${target.format}\n`;
  csvContent += `Scoring,${target.scoringMode} (${target.pointsPerMatch})\n\n`;

  // 2. Standings
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

  // 3. Match History
  csvContent += `Match History\n`;
  csvContent += `Round,Court,Team 1,Score T1,Score T2,Team 2\n`;

  target.schedule.forEach((round) => {
    if (!round.completed) return;

    round.matches.forEach((match) => {
      const team1Names = match.team1.map((p) => p.name).join(" & ");
      const team2Names = match.team2.map((p) => p.name).join(" & ");

      // Helper for court name
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

  // Download Trigger
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

// ===== Share Results =====
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
