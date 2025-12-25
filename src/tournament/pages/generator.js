/**
 * Generator Page Module
 * Americano/Mexicano tournament generator.
 * This is the default page shown at /tournament/ and /tournament/#/generator
 *
 * For Phase 1, this is a thin wrapper that delegates to existing UI modules.
 * Future refactoring will move all generator UI logic here.
 */

import { getElements } from "../ui/elements.js";

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
 * Generator page module.
 */
export const generatorPage = {
  /**
   * Mount the generator page.
   * @param {HTMLElement} container - The page container
   * @param {URLSearchParams} params - URL query params
   */
  mount(container, params) {
    console.log("[GeneratorPage] Mounting...");

    // Show generator-specific content
    const elements = getElements();

    // Show players section and config
    if (elements.playersSection) elements.playersSection.style.display = "";
    if (elements.tournamentConfig) elements.tournamentConfig.style.display = "";
    if (elements.generateBtn) elements.generateBtn.style.display = "";

    // Show schedule section if tournament is active
    // (handled by existing main.js logic)
  },

  /**
   * Unmount the generator page.
   * Clean up listeners to prevent leaks.
   */
  unmount() {
    console.log("[GeneratorPage] Unmounting...");

    // Clean up tracked listeners
    listeners.forEach(({ el, event, handler }) => {
      el.removeEventListener(event, handler);
    });
    listeners.length = 0;
  },
};
