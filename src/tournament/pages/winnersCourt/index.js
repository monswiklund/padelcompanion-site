/**
 * Winners Court Page Module
 * Skill-based court placement for balanced 2v2 matches.
 * Shown at /tournament/#/winners-court
 */

import { getWinnersCourtState } from "../../winnersCourtLogic.js";
import { showInfoModal } from "../../modals.js";
import { HELP_WINNERS_INTRO } from "../../content/help.js";
import { getHistoryTemplate } from "../../ui/historyTemplate.js";
import { initHistory, renderHistory } from "../../history.js";
import { StorageService } from "../../../shared/storage.js";

// Sub-modules
import { renderSetup } from "./setup.js";
import { renderActiveGame } from "./gameView.js";

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
 * Winners Court page module.
 */
export const winnersCourtPage = {
  // Page state
  tempPlayers: [],
  splitSidesEnabled: false,
  listExpanded: false,

  /**
   * Mount the winners court page.
   * @param {HTMLElement} container - The page container
   * @param {URLSearchParams} params - URL query params
   */
  mount(container, params) {
    console.log("[WinnersCourtPage] Mounting...");

    // Load Setup State (Players)
    this.tempPlayers = StorageService.getItem("wc_setup_players", []);
    // Load split sides preference
    this.splitSidesEnabled =
      StorageService.getItem("wc_split_sides", "false") === "true";

    // Render initial structure
    this.render(container);
  },

  /**
   * Save setup state to persistent storage.
   */
  saveSetup() {
    StorageService.setItem("wc_setup_players", this.tempPlayers);
  },

  /**
   * Show help modal.
   */
  showHelp() {
    showInfoModal("How to Play", HELP_WINNERS_INTRO);
  },

  /**
   * Main Render Orchestrator.
   * @param {HTMLElement} container - Main container
   */
  render(container) {
    // Clear existing listeners before re-render
    removeAllListeners();

    container.innerHTML = `
      <div class="page-intro-header">
        <h2>Winners Court</h2>
        <p>Skill-based court promotion</p>
      </div>

      <div id="wcSetupContainer"></div>
      <div id="wcActiveContainer"></div>
    `;

    // Create page state object to pass to sub-modules
    const pageState = {
      tempPlayers: this.tempPlayers,
      splitSidesEnabled: this.splitSidesEnabled,
      listExpanded: this.listExpanded,
      saveSetup: () => this.saveSetup(),
    };

    // Render sub-modules
    renderSetup(
      container.querySelector("#wcSetupContainer"),
      pageState,
      addListener,
      () => this.render(container)
    );

    renderActiveGame(
      container.querySelector("#wcActiveContainer"),
      addListener,
      () => this.render(container)
    );

    // Attach help button listener
    const helpBtn = container.querySelector("#wcHelpBtn");
    if (helpBtn) {
      addListener(helpBtn, "click", () => this.showHelp());
    }

    // Append History Section
    const historyContainer = document.createElement("div");
    historyContainer.innerHTML = getHistoryTemplate();
    container.appendChild(historyContainer);

    // Initialize History
    initHistory();
    renderHistory();

    // Sync state back from pageState (for side effects during render)
    this.tempPlayers = pageState.tempPlayers;
    this.splitSidesEnabled = pageState.splitSidesEnabled;
    this.listExpanded = pageState.listExpanded;
  },

  /**
   * Unmount the winners court page.
   */
  unmount() {
    console.log("[WinnersCourtPage] Unmounting...");
    removeAllListeners();
  },
};
