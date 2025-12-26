/**
 * Generator Page Module
 * Americano/Mexicano tournament generator.
 * This is the default page shown at /tournament/ and /tournament/#/generator
 */

import { getGeneratorTemplate } from "../ui/generatorTemplates.js";
import {
  initElements,
  updateSetupUI,
  updateScoringLabel,
  renderTournamentConfig,
  renderPlayers,
  renderSchedule,
  renderLeaderboard,
  updateGridColumns,
  renderPreferredPartners,
  renderCustomCourtNames,
  updateRankingCriteria,
  setupCustomSelects,
} from "../ui/index.js";
import { state, loadState } from "../state.js";
import { initHistory, renderHistory } from "../history.js";
import { showToast } from "../../shared/utils.js";
import { getAvailablePlayersForPairing, addPreferredPair } from "../players.js";
import { renderPlayerList } from "../ui/components/playerList.js";

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
 * Re-attach event listeners to the newly rendered DOM.
 * This effectively "re-hydrates" the UI since main.js initEventListeners
 * runs once on init, but we just replaced the DOM.
 *
 * Ideally, main.js should be refactored to export its listener attachers,
 * but for now we'll rely on the fact that most listeners are delegated
 * or we need to manually re-bind specific ones if they werent delegated.
 */
function reattachLocalListeners() {
  // Most core listeners in main.js are attached to elements by ID.
  // Since we destroyed and recreated them, we need to re-bind them.
  // However, main.js is a module with private scope for its listeners.
  //
  // CRITICAL: We cannot easily "re-run" main.js's initEventListeners.
  // Refactoring Strategy:
  // 1. We should ideally move specific event handling to components.
  // 2. For now, since main.js logic is complex, we will rely on `initElements`
  //    re-fetching references, but `main.js` listeners won't auto-reattach
  //    to these new elements.
  //
  // WAIT - If we replace innerHTML, all event listeners attached to those elements are LOST.
  // This is a dangerous refactor if main.js holds all the logic.
  //
  // ALTERNATIVE: The specific elements that have direct listeners (not delegated)
  // need their listeners re-attached.
  //
  // Looking at main.js:
  // - elements.format.addEventListener...
  // - elements.courts.addEventListener...
  // - elements.addPartnerPairBtn.addEventListener...
  //
  // To make this work without rewriting main.js entirely, we need to signal main.js
  // to re-initialize listeners for these elements.
  //
  // We will dispatch a custom event that main.js can listen to.
  window.dispatchEvent(new CustomEvent("tournament-generator-mounted"));
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
    const newElements = initElements();

    // Dispatch event to tell main.js to re-bind listeners
    // We will add this handler to main.js in the next step
    window.dispatchEvent(new CustomEvent("tournament-generator-mounted"));

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
    // Note: initHistory attaches listeners to history search/buttons
    initHistory();
    // We might need to manually trigger renderHistory if it's not called automatically
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
  },

  /**
   * Unmount the generator page.
   */
  unmount() {
    console.log("[GeneratorPage] Unmounting...");
    // Since we destroy the container content, most cleanup is automatic.
    // We just need to stop any timers if running?
    // (Timer logic is in schedule.js, which checks state).
  },
};
