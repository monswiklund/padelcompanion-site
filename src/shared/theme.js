// Shared Theme Toggle Module
// Used across all pages for consistent dark/light mode

const STORAGE_KEY = "padelcompanion-theme";

/**
 * Initialize theme from localStorage or system preference
 */
export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  // Default to dark if no preference or explicitly dark
  const isDark = !saved || saved === "dark";
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );

  return isDark ? "dark" : "light";
}

/**
 * Toggle between dark and light theme
 * @returns {string} The new theme
 */
export function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(STORAGE_KEY, next);
  return next;
}

/**
 * Get the current theme
 * @returns {string} "dark" or "light"
 */
export function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "dark";
}

/**
 * Update a theme toggle button's icon
 * @param {HTMLElement} button - The toggle button element
 * @param {string} theme - The current theme
 */
export function updateThemeIcon(button, theme) {
  if (!button) return;
  const icon = button.querySelector(".theme-icon");
  if (icon) {
    icon.textContent = theme === "dark" ? "🌙" : "☀️";
  }
}
