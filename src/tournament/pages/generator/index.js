/**
 * Generator Page Module
 * Americano/Mexicano tournament generator.
 * This is the default page shown at /tournament/ and /tournament/#/generator
 */

import { getGeneratorActiveTemplate } from "../../ui/generatorTemplates.js";
import { renderSetup } from "./setup.js";
import {
  generateSchedule,
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
  setupCustomSelects,
  endTournament,
} from "../../ui/index.js";
import { getHistoryTemplate } from "../../ui/historyTemplate.js";
import { state } from "../../core/state.js";
import { initHistory, renderHistory } from "../../history/index.js";

// Listener modules
import { attachFormListeners } from "./formListeners.js";
import { attachSettingsListeners } from "./settingsListeners.js";
import {
  attachActionListeners,
  promptAddLatePlayer,
} from "./actionListeners.js";
import { attachHelpListeners } from "./helpListeners.js";
import { initEventDelegation } from "../eventDelegation.js";
import { setupLegacyWindowFunctions } from "../legacyCompat.js";

// Track attached listeners for cleanup
const listeners = [];

/**
 * Track a listener for cleanup on unmount.
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
 * Attach all event listeners for the Generator page.
 */
function attachListeners() {
  attachFormListeners(addListener);
  attachSettingsListeners(addListener);
  attachActionListeners(addListener);
  attachHelpListeners(addListener);
}

export const generatorPage = {
  /**
   * Mount the generator page.
   * @param {HTMLElement} container - The page container
   * @param {URLSearchParams} params - URL query params
   */
  mount(container, params) {
    console.log("[GeneratorPage] Mounting...");
    if (!container) return;

    // Structure: Setup (New) + Active (Legacy Template) + History
    // We toggle visibility based on state
    const isGameActive = state.schedule && state.schedule.length > 0;

    container.innerHTML = `
        <div id="genSetupContainer" style="display: ${
          isGameActive ? "none" : "block"
        }"></div>
        <div id="genActiveContainer" style="display: ${
          isGameActive ? "block" : "none"
        }" class="tournament-active-view">
             ${getGeneratorActiveTemplate()}
        </div>
        ${getHistoryTemplate()}
    `;

    // --- Setup View ---
    if (!isGameActive) {
      renderSetup(document.getElementById("genSetupContainer"), () => {
        // Generate clicked
        generateSchedule();
        // After generation, switch visibility if successful
        if (state.schedule.length > 0) {
          document.getElementById("genSetupContainer").style.display = "none";
          document.getElementById("genActiveContainer").style.display = "block";
          // Trigger active view renders
          renderSchedule();
          renderLeaderboard();
        }
      });
    }

    // --- Active View & General ---
    // Re-initialize element references (vital for getElements to work on Active container)
    initElements();

    // Attach all event listeners
    attachListeners();

    // Initialize event delegation
    initEventDelegation(
      container,
      addListener,
      promptAddLatePlayer,
      endTournament
    );

    // Setup legacy window functions
    setupLegacyWindowFunctions(endTournament, promptAddLatePlayer);

    // Initialize UI State for Active View
    if (isGameActive) {
      updateScoringLabel();
      renderSchedule();
      renderLeaderboard();
      // renderPreferredPartners only relevant if element exists,
      // but active template might not have it. it's fine.
    }

    // History
    initHistory();
    const historySection = document.getElementById("historySectionPage");
    if (historySection) {
      renderHistory();
    }

    console.log("[GeneratorPage] Mounted successfully");
  },

  /**
   * Unmount the generator page.
   */
  unmount() {
    console.log("[GeneratorPage] Unmounting...");
    removeAllListeners();
  },
};
