import { state } from "../../state.js";
import { initHistory, renderHistory } from "../../history.js";
import { getHistoryTemplate } from "../../ui/historyTemplate.js";
import { renderSetup, cleanupSetupListeners } from "./setup.js";
import { renderView, cleanupViewListeners } from "./view.js";

/**
 * Bracket page module.
 */
export const bracketPage = {
  /**
   * Mount the bracket page.
   * @param {HTMLElement} container - The page container
   * @param {URLSearchParams} params - URL query params
   */
  mount(container, params) {
    console.log("[BracketPage] Mounting...");

    // Main render application
    this.render(container);

    // Listen for clear event to re-render (switch back to setup)
    container.addEventListener("tournament-cleared", () => {
      this.render(container);
    });

    // Append History Section (always visible at bottom)
    // We append specific history container to ensure it stays at bottom
    // But we need to make sure we don't wipe it on re-render if it's outside the main content
    // Actually our render functions overwrite container.innerHTML
    // So we should structure container: [Main Content] [History]

    // Let's create a main wrapper to target for render
    // If we just append to container after render, it works, but re-render wipes it.
    // Better: Helper wrapper.
  },

  render(container) {
    container.innerHTML = "";

    const mainContent = document.createElement("div");
    mainContent.id = "bracket-main-content";
    container.appendChild(mainContent);

    // Check if we have bracket data
    if (!state.tournament?.matches?.length) {
      renderSetup(mainContent, () => {
        // On Setup Complete
        this.render(container);
      });
    } else {
      renderView(mainContent);
    }

    // Append History Section
    const historyContainer = document.createElement("div");
    historyContainer.innerHTML = getHistoryTemplate();
    container.appendChild(historyContainer);

    // Initialize History
    initHistory();
    renderHistory();
  },

  /**
   * Unmount the bracket page.
   */
  unmount() {
    console.log("[BracketPage] Unmounting...");
    cleanupSetupListeners();
    cleanupViewListeners();
  },
};
