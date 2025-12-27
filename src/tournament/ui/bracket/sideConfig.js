/**
 * Bracket Side Configuration
 * Side definitions and utilities for bracket rendering.
 */

/**
 * Default side configurations
 */
export const SIDE_CONFIGS = {
  A: {
    name: "Side A",
    color: "var(--accent)",
    bgColor: "rgba(59, 130, 246, 0.05)",
  },
  B: {
    name: "Side B",
    color: "var(--warning)",
    bgColor: "rgba(245, 158, 11, 0.05)",
  },
  C: {
    name: "Side C",
    color: "#22c55e", // Green
    bgColor: "rgba(34, 197, 94, 0.05)",
  },
  D: {
    name: "Side D",
    color: "#ef4444", // Red
    bgColor: "rgba(239, 68, 68, 0.05)",
  },
  E: {
    name: "Side E",
    color: "#a855f7", // Purple
    bgColor: "rgba(168, 85, 247, 0.05)",
  },
  F: {
    name: "Side F",
    color: "#06b6d4", // Cyan
    bgColor: "rgba(6, 182, 212, 0.05)",
  },
};

/**
 * Get side config by letter (A, B, C, D, E, F).
 * @param {string} letter - Side letter
 * @returns {Object} Side configuration
 */
export function getSideConfig(letter) {
  return SIDE_CONFIGS[letter] || SIDE_CONFIGS.A;
}

/**
 * Get array of side configs for N brackets.
 * @param {number} count - Number of brackets
 * @returns {Array} Array of side configurations
 */
export function getSideConfigs(count) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  return letters.slice(0, count).map((l) => SIDE_CONFIGS[l]);
}

/**
 * Create a custom side configuration.
 * @param {string} name - Display name
 * @param {string} color - CSS color for accents
 * @param {string} bgColor - CSS background color
 * @returns {Object} Side configuration object
 */
export function createSideConfig(name, color, bgColor = null) {
  const computedBg =
    bgColor || color.replace(")", ", 0.05)").replace("rgb", "rgba");
  return { name, color, bgColor: computedBg };
}

/**
 * Get round name based on position.
 * @param {number} round - Round number (1-indexed)
 * @param {number} totalRounds - Total number of rounds
 * @returns {string} Round name
 */
export function getRoundName(round, totalRounds) {
  const fromEnd = totalRounds - round;
  if (fromEnd === 0) return "Final";
  if (fromEnd === 1) return "Semi-Finals";
  if (fromEnd === 2) return "QF";
  return `R${round}`;
}
