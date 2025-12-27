/**
 * Generator Actions Listeners
 * Handles schedule actions, toolbar, and utility listeners.
 */

import { state, saveState, undoLastAction } from "../../core/state.js";
import { showToast } from "../../../shared/utils.js";
import { showConfirmModal, showInputModal } from "../../core/modals.js";
import { StorageService } from "../../../shared/storage.js";
import { addLatePlayer } from "../../players.js";
import {
  getElements,
  renderSchedule,
  renderLeaderboard,
  updateGridColumns,
  updateTextSize,
  updateRoundScale,
  onSliderManualChange,
  generateSchedule,
  resetSchedule,
} from "../../ui/index.js";

/**
 * Prompt to add a late player to the tournament.
 */
export function promptAddLatePlayer() {
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
 * Attach schedule and utility action listeners.
 * @param {Function} addListener - Listener tracker function
 */
export function attachActionListeners(addListener) {
  const elements = getElements();

  // ===== Undo Button =====
  const undoBtn = document.getElementById("undoBtn");
  if (undoBtn) {
    addListener(undoBtn, "click", () => {
      if (undoLastAction()) {
        showToast("Undo successful");

        if (elements.format) elements.format.value = state.format;
        renderSchedule();
        renderLeaderboard();
        updateGridColumns();

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
        true
      );
    });
  }

  // ===== Round Scale Slider =====
  const roundScaleInput = document.getElementById("roundScale");
  if (roundScaleInput) {
    addListener(roundScaleInput, "input", updateRoundScale);
  }

  // ===== Global Keyboard Shortcut (Ctrl/Cmd + Z for Undo) =====
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
