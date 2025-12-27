/**
 * Generator Page Module
 * Americano/Mexicano tournament generator.
 * This is the default page shown at /tournament/ and /tournament/#/generator
 *
 * This module is self-contained, handling its own event listeners and lifecycle.
 */

import { getGeneratorTemplate } from "../ui/generatorTemplates.js";
import {
  initElements,
  getElements,
  updateSetupUI,
  updateScoringLabel,
  renderTournamentConfig,
  renderPlayers,
  renderSchedule,
  renderLeaderboard,
  updateGridColumns,
  renderPreferredPartners,
  renderCustomCourtNames,
  toggleCustomCourtNames,
  updateRankingCriteria,
  setupCustomSelects,
  showImportModal,
  hideImportModal,
  togglePlayerList,
  autoFillScore,
  toggleManualBye,
  toggleRoundCollapse,
  completeRound,
  editRound,
  generateSchedule,
  resetSchedule,
  toggleLeaderboardVisibility,
  togglePositionChanges,
  endTournament,
  onSliderManualChange,
  updateTextSize,
  updateRoundScale,
  toggleToolbar,
  exportTournamentData,
  shareResults,
  renderGameDetails,
  updateCustomCourtName,
  validateCourts,
} from "../ui/index.js";
import { state, loadState, saveState, undoLastAction } from "../state.js";
import { initHistory, renderHistory } from "../history/index.js";
import { showToast } from "../../shared/utils.js";
import { StorageService } from "../../shared/storage.js";
import {
  addPlayer,
  removePlayer,
  removeAllPlayers,
  importPlayers as importPlayersData,
  addLatePlayer,
  addPreferredPair,
  removePreferredPair,
  updatePreferredPair,
  getAvailablePlayersForPairing,
} from "../players.js";
import {
  HELP_FORMATS,
  HELP_SCORING,
  HELP_MATCHUP,
  HELP_LEADERBOARD,
} from "../content/help.js";
import {
  showInputModal,
  showFinalStandings,
  showConfirmModal,
  showInfoModal,
} from "../modals.js";

// Import extracted modules
import { initEventDelegation } from "./eventDelegation.js";
import { setupLegacyWindowFunctions } from "./legacyCompat.js";

// Track attached listeners for cleanup
const listeners = [];

/**
 * Track a listener for cleanup on unmount.
 * @param {Element} el
 * @param {string} event
 * @param {Function} handler
 */
function addListener(el, event, handler) {
  if (!el) return;
  el.addEventListener(event, handler);
  listeners.push({ el, event, handler });
}

/**
 * Remove all tracked listeners.
 */
function removeAllListeners() {
  listeners.forEach(({ el, event, handler }) => {
    el.removeEventListener(event, handler);
  });
  listeners.length = 0;
}

/**
 * Prompt to add a late player to the tournament.
 */
function promptAddLatePlayer() {
  const isTeam = state.format === "team" || state.format === "teamMexicano";
  const entityName = isTeam ? "team" : "player";

  const description = `The new ${entityName} will join with 0 points and be included starting from the next round. Their ranking will adjust based on future match results.`;

  showInputModal(
    isTeam ? "Add Late Team" : "Add Late Player",
    isTeam ? "Enter new team name:" : "Enter new player name:",
    (name) => {
      if (name && name.trim()) {
        if (state.format === "americano" || state.format === "team") {
          const confirmSwitch = confirm(
            "Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"
          );
          if (!confirmSwitch) return;
          state.format = "mexicano";
          state.allRounds = null;
          showToast("Switched to Mexicano format");
        }

        addLatePlayer(name.trim());

        const countSpan = document.getElementById("playerCount");
        if (countSpan) {
          countSpan.textContent = `(${state.players.length})`;
        }

        renderLeaderboard();
        showToast(`Added ${name.trim()} to tournament`);
      }
    },
    description
  );
}

/**
 * Attach all event listeners for the Generator page.
 * This is called from mount() and handles all user interactions.
 */
function attachListeners() {
  const elements = getElements();

  // ===== Undo Button =====
  const undoBtn = document.getElementById("undoBtn");
  if (undoBtn) {
    addListener(undoBtn, "click", () => {
      if (undoLastAction()) {
        showToast("Undo successful");

        // Refresh UI
        if (elements.format) elements.format.value = state.format;
        renderPlayers();
        renderSchedule();
        renderLeaderboard();
        updateSetupUI();
        updateGridColumns();

        // Toggle sections based on schedule
        if (state.schedule.length > 0) {
          if (elements.scheduleSection)
            elements.scheduleSection.style.display = "block";
          if (elements.leaderboardSection)
            elements.leaderboardSection.style.display = "block";
          const actions = document.getElementById("tournamentActionsSection");
          if (actions) actions.style.display = "block";
        } else {
          if (elements.scheduleSection)
            elements.scheduleSection.style.display = "none";
          if (elements.leaderboardSection)
            elements.leaderboardSection.style.display = "none";
          const actions = document.getElementById("tournamentActionsSection");
          if (actions) actions.style.display = "none";
        }
      }
    });
  }

  // ===== Clear All Players =====
  if (elements.clearAllPlayersBtn) {
    addListener(elements.clearAllPlayersBtn, "click", () => {
      removeAllPlayers(() => {
        renderPlayers();
        renderPreferredPartners();
        updateSetupUI();
      });
    });
  }

  // ===== Bulk Import =====
  if (elements.importPlayersBtn) {
    addListener(elements.importPlayersBtn, "click", showImportModal);
  }
  if (elements.closeImportModal) {
    addListener(elements.closeImportModal, "click", hideImportModal);
  }
  if (elements.cancelImportBtn) {
    addListener(elements.cancelImportBtn, "click", hideImportModal);
  }
  if (elements.confirmImportBtn) {
    addListener(elements.confirmImportBtn, "click", () => {
      const text = elements.importTextarea ? elements.importTextarea.value : "";
      const result = importPlayersData(text);

      let statusMsg = `Added ${result.added} players.`;
      if (result.duplicates > 0)
        statusMsg += ` Skipped ${result.duplicates} duplicates.`;
      if (result.hitLimit) statusMsg += ` Stopped at 24 max limit.`;

      if (elements.importStatus) elements.importStatus.textContent = statusMsg;
      renderPlayers();

      if (result.added > 0 && result.duplicates === 0 && !result.hitLimit) {
        setTimeout(hideImportModal, 1500);
        showToast(`Imported ${result.added} players`);
      }
    });
  }

  // ===== Add Player Button =====
  if (elements.confirmAddBtn) {
    addListener(elements.confirmAddBtn, "click", () => {
      if (addPlayer(elements.playerNameInput.value)) {
        elements.playerNameInput.value = "";
        elements.playerNameInput.focus();
        renderPlayers();
      }
    });
  }

  // ===== Player Input Enter Key =====
  if (elements.playerNameInput) {
    addListener(elements.playerNameInput, "keydown", (e) => {
      if (e.key === "Enter") {
        if (addPlayer(elements.playerNameInput.value)) {
          elements.playerNameInput.value = "";
          renderPlayers();
        }
      }
    });
  }

  // ===== Format Change =====
  if (elements.format) {
    addListener(elements.format, "change", () => {
      state.format = elements.format.value;
      updateSetupUI();
      saveState();
      if (state.schedule.length > 0) {
        renderGameDetails();
      }
    });
  }

  // ===== Courts Change =====
  if (elements.courts) {
    addListener(elements.courts, "change", () => {
      state.courts = parseInt(elements.courts.value);
      saveState();
      renderTournamentConfig();
      if (state.schedule.length > 0) {
        renderGameDetails();
      }
      if (state.courtFormat === "custom") {
        renderCustomCourtNames();
      }
    });

    addListener(elements.courts, "input", () => {
      const MAX_COURTS = 50;
      const rawVal = elements.courts.value;

      // Allow empty input while typing
      if (rawVal === "") return;

      let val = parseInt(rawVal) || 1;
      val = Math.max(1, Math.min(MAX_COURTS, val));

      // If locked, do not update state actively
      if (state.isLocked) return;

      elements.courts.value = val;
      state.courts = val;
      saveState();
      if (state.courtFormat === "custom") {
        renderCustomCourtNames();
      }
      if (state.schedule.length > 0) {
        renderGameDetails();
      }
    });
  }

  // ===== Points Change =====
  if (elements.points) {
    addListener(elements.points, "change", () => {
      state.pointsPerMatch = parseInt(elements.points.value);
      saveState();
      renderTournamentConfig();
      if (state.schedule.length > 0) {
        renderSchedule();
      }
    });
  }

  // ===== Scoring Mode Change =====
  if (elements.scoringMode) {
    addListener(elements.scoringMode, "change", () => {
      state.scoringMode = elements.scoringMode.value;
      updateScoringLabel();
      saveState();
      renderTournamentConfig();
      if (state.schedule.length > 0) {
        renderSchedule();
      }
    });
  }

  // ===== Ranking Criteria =====
  const rankingCriteriaSelect = document.getElementById("rankingCriteria");
  if (rankingCriteriaSelect) {
    addListener(rankingCriteriaSelect, "change", () => {
      state.rankingCriteria = rankingCriteriaSelect.value;
      updateRankingCriteria();
      saveState();
    });
  }

  // ===== Court Format Change =====
  if (elements.courtFormat) {
    addListener(elements.courtFormat, "change", () => {
      state.courtFormat = elements.courtFormat.value;
      toggleCustomCourtNames();
      saveState();
    });
  }

  // ===== Matchup Settings =====
  if (elements.maxRepeats) {
    addListener(elements.maxRepeats, "change", (e) => {
      const newValue = parseInt(e.target.value);
      const oldValue = state.maxRepeats;

      if (state.isLocked) {
        // Revert visually first
        e.target.value = oldValue;

        showConfirmModal(
          "Change Matchup Setting?",
          "The tournament is running. This change will affect how future rounds are generated.",
          "Apply Change",
          () => {
            state.maxRepeats = newValue;
            elements.maxRepeats.value = newValue;
            saveState();
            renderTournamentConfig();
            showToast("Max Partner Repeats updated");
          },
          true // isDanger
        );
      } else {
        state.maxRepeats = newValue;
        saveState();
        renderTournamentConfig();
      }
    });
  }

  // ===== Strict Strategy =====
  const strictStrategy = document.getElementById("strictStrategy");
  if (strictStrategy) {
    addListener(strictStrategy, "change", (e) => {
      // Feedback: Not available with Optimal strategy
      if (state.pairingStrategy === "optimal") {
        e.target.checked = false;
        showToast(
          "Strict Pattern is not available with Optimal pairing",
          "info"
        );
        return;
      }

      const newValue = e.target.checked;
      const oldValue = state.strictStrategy;

      if (state.isLocked) {
        e.target.checked = !!oldValue; // Revert
        showConfirmModal(
          "Update Strict Mode?",
          "The tournament is running. This change will affect how future rounds are generated.",
          "Apply Change",
          () => {
            state.strictStrategy = newValue;
            strictStrategy.checked = newValue;
            saveState();
            showToast("Strict Mode updated");
          },
          true // isDanger
        );
      } else {
        state.strictStrategy = newValue;
        saveState();
      }
    });
  }

  // ===== Pairing Strategy =====
  if (elements.pairingStrategy) {
    addListener(elements.pairingStrategy, "change", (e) => {
      const newValue = e.target.value;
      const oldValue = state.pairingStrategy;

      if (state.isLocked) {
        // Revert visually first
        e.target.value = oldValue;

        showConfirmModal(
          "Change Matchup Setting?",
          "The tournament is running. This change will affect how future rounds are generated.",
          "Apply Change",
          () => {
            state.pairingStrategy = newValue;
            elements.pairingStrategy.value = newValue;
            // Reset strictStrategy when switching to optimal
            if (newValue === "optimal") {
              state.strictStrategy = false;
              const strictCheckbox = document.getElementById("strictStrategy");
              if (strictCheckbox) strictCheckbox.checked = false;
            }
            saveState();
            updateSetupUI(); // Update visibility of Strict toggle
            showToast("Pairing Strategy updated");
          },
          true // isDanger
        );
      } else {
        state.pairingStrategy = newValue;
        // Reset strictStrategy when switching to optimal
        if (newValue === "optimal") {
          state.strictStrategy = false;
          const strictCheckbox = document.getElementById("strictStrategy");
          if (strictCheckbox) strictCheckbox.checked = false;
        }
        saveState();
        updateSetupUI(); // Update visibility of Strict toggle
      }
    });
  }

  // ===== Add Partner Pair =====
  if (elements.addPartnerPairBtn) {
    addListener(elements.addPartnerPairBtn, "click", () => {
      const available = getAvailablePlayersForPairing();
      if (available.length < 2) {
        showToast("Not enough available players to form a pair", "error");
        return;
      }

      addPreferredPair();
      renderPreferredPartners();
      updateSetupUI();
      setupCustomSelects();
      showToast("Fixed pair added", "success");
    });
  }

  // ===== Help Buttons =====
  attachHelpListeners();

  // ===== Schedule Actions =====
  if (elements.generateBtn) {
    addListener(elements.generateBtn, "click", generateSchedule);
  }
  if (elements.printBtn) {
    addListener(elements.printBtn, "click", () => window.print());
  }
  if (elements.resetBtn) {
    addListener(elements.resetBtn, "click", resetSchedule);
  }

  // ===== Grid Columns Slider =====
  if (elements.gridColumns) {
    addListener(elements.gridColumns, "input", onSliderManualChange);
  }

  // ===== Text Size Slider =====
  if (elements.textSize) {
    addListener(elements.textSize, "input", () => {
      state.textSize = parseInt(elements.textSize.value);
      updateTextSize();
      saveState();
    });
  }

  // ===== Factory Reset =====
  const factoryResetBtn = document.getElementById("factoryResetBtn");
  if (factoryResetBtn) {
    addListener(factoryResetBtn, "click", () => {
      showConfirmModal(
        "⚠️ Factory Reset",
        "This will clear the current tournament and reset the app. Your saved history will NOT be deleted. Are you sure?",
        "Yes, Reset App",
        () => {
          StorageService.removeItem("tournament-state");
          window.location.reload();
        },
        true // isDanger
      );
    });
  }

  // ===== Round Scale Slider =====
  const roundScaleInput = document.getElementById("roundScale");
  if (roundScaleInput) {
    addListener(roundScaleInput, "input", updateRoundScale);
  }

  // ===== Global Keyboard Shortcut (Ctrl/Cmd + Z for Undo) =====
  // Only attach once, even if mount is called multiple times
  if (!window._undoListenerAttached) {
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        const btn = document.getElementById("undoBtn");
        if (btn && !btn.disabled) btn.click();
      }
    });
    window._undoListenerAttached = true;
  }
}

/**
 * Attach help button event listeners.
 */
function attachHelpListeners() {
  const helpFormat = document.getElementById("helpFormat");
  if (helpFormat) {
    addListener(helpFormat, "click", () => {
      showInfoModal("Tournament Formats", HELP_FORMATS);
    });
  }

  const helpScoring = document.getElementById("helpScoring");
  if (helpScoring) {
    addListener(helpScoring, "click", () => {
      showInfoModal("Scoring Modes", HELP_SCORING);
    });
  }

  const helpMatchup = document.getElementById("helpMatchup");
  if (helpMatchup) {
    addListener(helpMatchup, "click", () => {
      showInfoModal("Matchup Rules", HELP_MATCHUP);
    });
  }

  const helpLeaderboard = document.getElementById("helpLeaderboard");
  if (helpLeaderboard) {
    addListener(helpLeaderboard, "click", () => {
      showInfoModal("Leaderboard Guide", HELP_LEADERBOARD);
    });
  }
}

export const generatorPage = {
  /**
   * Mount the generator page.
   * @param {HTMLElement} container - The page container
   * @param {URLSearchParams} params - URL query params
   */
  mount(container, params) {
    console.log("[GeneratorPage] Mounting...");
    if (!container) {
      console.error("[GeneratorPage] Mount failed: Container is null");
      return;
    }

    // Render the template
    container.innerHTML = getGeneratorTemplate();

    // Re-initialize element references in the UI module
    // This updates the 'elements' object that main.js and others use
    initElements();

    // Attach all event listeners for this page
    attachListeners();

    // Initialize event delegation for dynamically rendered content
    initEventDelegation(
      container,
      addListener,
      promptAddLatePlayer,
      endTournament
    );

    // Setup legacy window functions for onclick handlers
    setupLegacyWindowFunctions(endTournament, promptAddLatePlayer);

    // Initialize UI State
    updateSetupUI();
    updateScoringLabel();
    renderTournamentConfig();
    renderPlayers();
    renderPreferredPartners();

    // Trigger animations for section headers (they start with opacity: 0)
    const playersHeader = document.querySelector(".players-header h3");
    if (playersHeader) playersHeader.classList.add("animate-in");

    // Setup specific UI components
    setupCustomSelects();

    // History
    // We need to re-init history to find the new elements
    initHistory();
    // Render history if the section exists
    const historySection = document.getElementById("historySectionPage");
    if (historySection) {
      renderHistory();
    }

    // Restore active tournament view if needed
    if (state.schedule.length > 0) {
      const els = getElements();
      if (els.scheduleSection) els.scheduleSection.style.display = "block";
      if (els.leaderboardSection)
        els.leaderboardSection.style.display = "block";
      const actions = document.getElementById("tournamentActionsSection");
      if (actions) actions.style.display = "block";

      renderSchedule();
      renderLeaderboard();
      updateGridColumns();
    }

    console.log("[GeneratorPage] Mounted successfully");
  },

  /**
   * Unmount the generator page.
   */
  unmount() {
    console.log("[GeneratorPage] Unmounting...");
    // Remove all tracked listeners to prevent leaks
    removeAllListeners();
  },
};
