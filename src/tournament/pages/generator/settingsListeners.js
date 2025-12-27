/**
 * Generator Settings Listeners
 * Handles matchup settings and advanced configuration listeners.
 */

import { state, saveState } from "../../core/state.js";
import { showToast } from "../../../shared/utils.js";
import { showConfirmModal } from "../../core/modals.js";
import {
  getElements,
  updateSetupUI,
  renderTournamentConfig,
} from "../../ui/index.js";

/**
 * Attach matchup/settings event listeners.
 * @param {Function} addListener - Listener tracker function
 */
export function attachSettingsListeners(addListener) {
  const elements = getElements();

  // ===== Max Repeats =====
  if (elements.maxRepeats) {
    addListener(elements.maxRepeats, "change", (e) => {
      const newValue = parseInt(e.target.value);
      const oldValue = state.maxRepeats;

      if (state.isLocked) {
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
          true
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
        e.target.checked = !!oldValue;
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
          true
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
        e.target.value = oldValue;

        showConfirmModal(
          "Change Matchup Setting?",
          "The tournament is running. This change will affect how future rounds are generated.",
          "Apply Change",
          () => {
            state.pairingStrategy = newValue;
            elements.pairingStrategy.value = newValue;
            if (newValue === "optimal") {
              state.strictStrategy = false;
              const strictCheckbox = document.getElementById("strictStrategy");
              if (strictCheckbox) strictCheckbox.checked = false;
            }
            saveState();
            updateSetupUI();
            showToast("Pairing Strategy updated");
          },
          true
        );
      } else {
        state.pairingStrategy = newValue;
        if (newValue === "optimal") {
          state.strictStrategy = false;
          const strictCheckbox = document.getElementById("strictStrategy");
          if (strictCheckbox) strictCheckbox.checked = false;
        }
        saveState();
        updateSetupUI();
      }
    });
  }
}
