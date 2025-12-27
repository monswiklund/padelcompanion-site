// Shared Theme Toggle Module
// Used across all pages for consistent dark/light mode

const STORAGE_KEY = "padelcompanion-theme";

type Theme = "dark" | "light";

/**
 * Initialize theme from localStorage or system preference
 */
export function initTheme(): Theme {
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
 */
export function toggleTheme(): Theme {
  const current = document.documentElement.getAttribute("data-theme");
  const next: Theme = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(STORAGE_KEY, next);
  return next;
}

/**
 * Get the current theme
 */
export function getTheme(): Theme {
  return (
    (document.documentElement.getAttribute("data-theme") as Theme) || "dark"
  );
}

/**
 * Update a theme toggle button's icon
 */
export function updateThemeIcon(
  button: HTMLElement | null,
  theme: Theme
): void {
  if (!button) return;
  const icon = button.querySelector(".theme-icon");
  if (icon) {
    icon.textContent = theme === "dark" ? "🌙" : "☀️";
  }
}
