// Controls Module
// Grid columns, text size, and round scale controls

import { state, saveState } from "../core/state.js";
import { getElements } from "./elements.js";

let isManualMode = false;

/**
 * Update grid columns display
 */
export function updateGridColumns() {
  const els = getElements();
  const cols = state.gridColumns;
  const grids = document.querySelectorAll(".matches-grid");

  if (els.gridColumns) {
    els.gridColumns.value = cols;
  }

  if (cols === 0) {
    if (els.gridColumnsLabel) els.gridColumnsLabel.textContent = "Auto";
    grids.forEach((grid) => {
      grid.style.gridTemplateColumns = "";
    });
  } else {
    if (els.gridColumnsLabel) els.gridColumnsLabel.textContent = cols;
    grids.forEach((grid) => {
      grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    });
  }
}

/**
 * Update scoring label based on mode
 */
export function updateScoringLabel() {
  const mode =
    document.getElementById("scoringMode")?.value || state.scoringMode;
  const label = document.getElementById("scoringValueLabel");
  const input = document.getElementById("points");

  if (!label || !input) return;

  if (mode === "total") {
    label.textContent = "Points";
    input.value = 24;
  } else if (mode === "race") {
    label.textContent = "Target";
    input.value = 21;
  } else if (mode === "time") {
    label.textContent = "Minutes";
    input.value = 12;
  }
}

/**
 * Update slider max - always allow up to 6 columns
 */
export function updateSliderMax() {
  const els = getElements();
  if (!els.gridColumns) return;

  // Always allow up to 6 columns regardless of court count
  els.gridColumns.max = 6;
}

/**
 * Calculate auto columns based on grid width
 */
function calculateAutoColumns() {
  const grid = document.querySelector(".matches-grid");
  if (!grid) return state.maxCourts || 2;

  const gridWidth = grid.offsetWidth;
  const minCardWidth = 180;
  const optimalColumns = Math.floor(gridWidth / minCardWidth);

  const maxCourts = state.maxCourts || state.courts || 2;
  return Math.min(Math.max(optimalColumns, 1), maxCourts);
}

/**
 * Handle window resize for auto columns
 */
export function handleResize() {
  const els = getElements();
  if (isManualMode || state.gridColumns !== 0) return;

  const autoCols = calculateAutoColumns();
  const grids = document.querySelectorAll(".matches-grid");

  grids.forEach((grid) => {
    grid.style.gridTemplateColumns = `repeat(${autoCols}, 1fr)`;
  });

  if (els.gridColumns) {
    els.gridColumns.value = autoCols;
  }
  if (els.gridColumnsLabel) {
    els.gridColumnsLabel.textContent = `Auto (${autoCols})`;
  }
}

/**
 * Handle manual slider change
 */
export function onSliderManualChange() {
  const els = getElements();
  const value = parseInt(els.gridColumns.value);
  if (value === 0) {
    isManualMode = false;
    handleResize();
  } else {
    isManualMode = true;
  }
  state.gridColumns = value;
  updateGridColumns();
  saveState();
}

/**
 * Update text size scale
 */
export function updateTextSize() {
  const els = getElements();
  const size = state.textSize;
  const scale = size / 100;

  const scheduleSection = document.getElementById("scheduleSection");
  if (scheduleSection) {
    scheduleSection.style.setProperty("--text-scale", scale);
  }

  if (els.textSize) {
    els.textSize.value = size;
  }
  if (els.textSizeLabel) {
    els.textSizeLabel.textContent = `${size}%`;
  }
}

/**
 * Update round scale
 */
export function updateRoundScale() {
  const slider = document.getElementById("roundScale");
  const label = document.getElementById("roundScaleLabel");

  // Read slider value and update state
  if (slider) {
    state.roundScale = parseInt(slider.value) / 100;
    saveState();
  }

  const scale = state.roundScale || 1;

  // Apply scale to match card wrappers via CSS variable
  const roundsContainer = document.getElementById("roundsContainer");
  if (roundsContainer) {
    roundsContainer.style.setProperty("--card-scale", scale);
  }

  if (slider) slider.value = Math.round(scale * 100);
  if (label) label.textContent = `${Math.round(scale * 100)}%`;
}
