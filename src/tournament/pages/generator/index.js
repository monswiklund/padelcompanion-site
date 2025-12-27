/**
 * Generator Page Module
 * Americano/Mexicano tournament generator.
 * This is the default page shown at /tournament/ and /tournament/#/generator
 */

import { getGeneratorActiveTemplate } from "../../ui/generatorTemplates.js";
import { renderSetup } from "./setup.jsx";
import {
  generateSchedule,
  resetSchedule,
  initElements,
  renderSchedule,
  renderLeaderboard,
  endTournament,
} from "../../ui/index.js";
import { getHistoryTemplate } from "../../ui/historyTemplate.js";
import { state } from "../../core/state.js";
import { initHistory, renderHistory } from "../../history/index.js";

// Listener modules
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
    this.render(container);
  },

  /**
   * Main Render Orchestrator.
   */
  render(container) {
    if (!container) return;
    removeAllListeners();

    // Structure: Setup (New) + Active (Legacy Template) + History
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
        // Re-render to switch to active view
        if (state.schedule.length > 0) {
          this.render(container);
        }
      });
    }

    // --- Active View & General ---
    initElements();
    attachListeners();

    // Wrapped end/reset to trigger re-render
    const handleEnd = (cb) => {
      endTournament(cb);
      // We don't re-render immediately because endTournament has a confirm modal.
      // But we can hook into the core state change if we wanted.
      // For now, most transitions work via the confirm callbacks.
    };

    const handleReset = () => {
      resetSchedule();
      // If reset happened, we want to re-render
      // But resetSchedule also has a confirmation.
    };

    // Initialize event delegation
    initEventDelegation(container, addListener, promptAddLatePlayer, (stan) => {
      endTournament(stan);
      this.render(container);
    });

    // Setup legacy window functions
    setupLegacyWindowFunctions((stan) => {
      endTournament(stan);
      this.render(container);
    }, promptAddLatePlayer);

    // Initialize UI State for Active View
    if (isGameActive) {
      renderSchedule();
      renderLeaderboard();

      // Hook into the RESET button which is usually in the active view
      const resetBtn = document.getElementById("resetTournamentBtn");
      if (resetBtn) {
        addListener(resetBtn, "click", () => {
          // The actual reset logic is in scheduleGeneration.js
          // We just need to know when it finishes to re-render.
          // Since it's synchronous after confirmation, we can't easily hook it
          // unless we pass a callback to resetSchedule.
        });
      }
    }

    // History
    initHistory();
    renderHistory();

    console.log("[GeneratorPage] Rendered successfully");
  },

  /**
   * Unmount the generator page.
   */
  unmount() {
    console.log("[GeneratorPage] Unmounting...");
    removeAllListeners();
  },
};
