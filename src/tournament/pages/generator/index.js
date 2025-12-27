/**
 * Generator Page Module
 * Americano/Mexicano tournament generator.
 * This is the default page shown at /tournament/ and /tournament/#/generator
 */

import { getGeneratorTemplate } from "../../ui/generatorTemplates.js";
import { state } from "../../core/state.js";
import { initHistory, renderHistory } from "../../history/index.js";
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
  setupCustomSelects,
  endTournament,
} from "../../ui/index.js";

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
    if (!container) {
      console.error("[GeneratorPage] Mount failed: Container is null");
      return;
    }

    // Render the template
    container.innerHTML = getGeneratorTemplate();

    // Re-initialize element references
    initElements();

    // Attach all event listeners
    attachListeners();

    // Initialize event delegation for dynamically rendered content
    initEventDelegation(
      container,
      addListener,
      promptAddLatePlayer,
      endTournament
    );

    // Setup legacy window functions
    setupLegacyWindowFunctions(endTournament, promptAddLatePlayer);

    // Initialize UI State
    updateSetupUI();
    updateScoringLabel();
    renderTournamentConfig();
    renderPlayers();
    renderPreferredPartners();

    // Trigger animations for section headers
    const playersHeader = document.querySelector(".players-header h3");
    if (playersHeader) playersHeader.classList.add("animate-in");

    // Setup UI components
    setupCustomSelects();

    // History
    initHistory();
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
    removeAllListeners();
  },
};
