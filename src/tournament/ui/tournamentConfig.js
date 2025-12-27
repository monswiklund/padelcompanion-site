// Tournament Configuration Module
// Interactive configuration panel for tournament settings

import { state, saveState } from "../core/state.js";
import { createId, showToast } from "../../shared/utils.js";
import { showInfoModal, showConfirmModal, showAlertModal } from "../core/modals.js";
import { getElements } from "./elements.js";
import { removePreferredPair } from "../players.js";
import { openAddPairModal } from "./components/addPairModal.js";
import {
  renderConfigPanel,
  attachConfigPanelListeners,
} from "./components/configPanel.js";

/**
 * Configuration options for each setting
 */
// CONFIG_OPTIONS and helper functions moved to components/configPanel.js

/**
 * Render the interactive tournament configuration panel
 */
export function renderTournamentConfig() {
  const container = document.getElementById("tournamentConfig");
  if (!container) return;

  // Clamp courts/points validation logic
  const playerCount = state.players?.length || 0;
  const maxCourts = Math.max(1, Math.floor(playerCount / 4));
  if (state.courts > maxCourts) {
    state.courts = maxCourts;
    saveState();
  }
  if (state.pointsPerMatch < 4) {
    state.pointsPerMatch = 4;
    saveState();
  } else if (state.pointsPerMatch > 50) {
    state.pointsPerMatch = 50;
    saveState();
  }

  renderConfigPanel(container, state, state.players, state.preferredPartners);

  // Re-attach listeners because container content changed?
  // No, listeners are attached to container (delegation).
  // But attachConfigListeners was designed to be called once.
  attachConfigListeners(container);
}

/**
 * Render a single configuration row
 */
// Helper functions moved to configPanel.js

/**
 * Update a configuration value
 */
function updateConfigValue(key, value) {
  state[key] = value;
  saveState();

  // Sync with original form elements for compatibility
  const els = getElements();
  if (key === "format" && els.format) els.format.value = value;
  if (key === "courts" && els.courts) els.courts.value = value;
  if (key === "scoringMode" && els.scoringMode) {
    els.scoringMode.value = value;
    // Set default points for the new scoring mode
    const defaults = { time: 10, race: 14, total: 28 };
    state.pointsPerMatch = defaults[value] || 28;
    if (els.points) els.points.value = state.pointsPerMatch;
  }
  if (key === "pointsPerMatch" && els.points) els.points.value = value;
  if (key === "maxRepeats" && els.maxRepeats) els.maxRepeats.value = value;
  if (key === "pairingStrategy" && els.pairingStrategy) {
    els.pairingStrategy.value = value;
    // If strategy becomes optimal, reset strictStrategy
    if (value === "optimal") {
      state.strictStrategy = false;
    }
  }

  if (key === "strictStrategy" && document.getElementById("strictStrategy")) {
    document.getElementById("strictStrategy").checked = value;
  }

  // Re-render
  renderTournamentConfig();

  // Update other UI components
  import("./players.js").then((m) => m.renderPlayers && m.renderPlayers());

  // Update section title when format changes
  if (key === "format") {
    import("./setup/index.js").then(
      (m) => m.updateSetupUI && m.updateSetupUI()
    );
  }
}

function attachConfigListeners(container) {
  const callbacks = {
    onUpdate: (key, value) => updateConfigValue(key, value),
    onShowHelp: (helpId) => {
      const helpBtn = document.getElementById(helpId);
      if (helpBtn) helpBtn.click();
    },
    onAddPair: () => openAddPairModal(renderTournamentConfig),
    onEditPairs: () => openAddPairModal(renderTournamentConfig),
  };

  attachConfigPanelListeners(
    container,
    callbacks,
    () => state,
    () => state.players
  );
}

// Obsolete inline editor functions removed

/**
 * Open modal to add/edit fixed pairs
 */
/**
 * Open modal to add/edit fixed pairs with Custom UI
 */
// function openAddPairModal() {} - Moved to components/addPairModal.js
export function initTournamentConfig() {
  const container = document.getElementById("tournamentConfig");
  // Attach listeners once
  if (container) attachConfigListeners(container);

  renderTournamentConfig();
}

// Initialize global listeners
// Global listener moved to configPanel.js
