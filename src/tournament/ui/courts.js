// Courts Module
// Court validation, naming, and custom court names

import { state, saveState } from "../core/state.js";
import { getElements } from "./elements.js";

/**
 * Get formatted court name based on format setting
 * @param {number} courtNumber - Court number (1-indexed)
 * @returns {string} Formatted court name
 */
export function getCourtName(courtNumber) {
  switch (state.courtFormat) {
    case "number":
      return `${courtNumber}`;
    case "court":
      return `Court ${courtNumber}`;
    case "custom":
      return state.customCourtNames[courtNumber - 1] || `Court ${courtNumber}`;
    default:
      return `Court ${courtNumber}`;
  }
}

/**
 * Validate courts against player count
 * @returns {boolean} Whether courts are valid
 */
export function validateCourts() {
  const els = getElements();
  const courtsInput = els.courts;
  const warning = document.getElementById("courtsWarning");

  if (!courtsInput || !warning) return true;

  const courts = parseInt(courtsInput.value) || 1;
  const format = els.format?.value || state.format;
  const playersPerCourt =
    format === "team" || format === "teamMexicano" ? 2 : 4;
  const maxCourts = Math.floor(state.players.length / playersPerCourt);

  // Update max attribute dynamically
  courtsInput.max = Math.max(1, maxCourts);

  if (courts > maxCourts && maxCourts > 0) {
    warning.textContent = `⚠️ ${
      state.players.length
    } players can only fill ${maxCourts} court${maxCourts !== 1 ? "s" : ""}`;
    warning.style.display = "block";
    courtsInput.classList.add("input-warning");
    return false;
  } else if (maxCourts === 0 && state.players.length > 0) {
    warning.textContent = `⚠️ Need at least ${playersPerCourt} players for 1 court`;
    warning.style.display = "block";
    courtsInput.classList.add("input-warning");
    return false;
  } else {
    warning.style.display = "none";
    courtsInput.classList.remove("input-warning");
    return true;
  }
}

/**
 * Toggle custom court names section visibility
 */
export function toggleCustomCourtNames() {
  const els = getElements();
  if (!els.customCourtNamesSection) return;

  const isCustom = state.courtFormat === "custom";

  if (isCustom) {
    els.customCourtNamesSection.style.display = "flex";
    renderCustomCourtNames();
  } else {
    els.customCourtNamesSection.style.display = "none";
  }
}

/**
 * Render custom court name inputs
 */
export function renderCustomCourtNames() {
  const els = getElements();
  if (!els.customCourtNamesList) return;

  const count = Math.max(1, state.courts || 2);

  // Ensure array has enough slots
  if (!Array.isArray(state.customCourtNames)) {
    state.customCourtNames = [];
  }

  // Fill with defaults if missing
  while (state.customCourtNames.length < count) {
    state.customCourtNames.push(`Court ${state.customCourtNames.length + 1}`);
  }

  els.customCourtNamesList.innerHTML = Array.from(
    { length: count },
    (_, i) => `
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${(state.customCourtNames[i] || `Court ${i + 1}`).replace(
               /"/g,
               "&quot;"
             )}"
             oninput="window.updateCustomCourtName(${i}, this.value)"
             placeholder="Court ${i + 1}">
    </div>
  `
  ).join("");
}

/**
 * Update a custom court name
 * @param {number} index - Court index (0-based)
 * @param {string} value - New name
 */
export function updateCustomCourtName(index, value) {
  state.customCourtNames[index] = value || `Court ${index + 1}`;
  saveState();
}
