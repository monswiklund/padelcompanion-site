/**
 * Generator Form Listeners
 * Handles form input event listeners for tournament setup.
 */

import { state, saveState } from "../../core/state.js";
import { showToast } from "../../../shared/utils.js";
import { showConfirmModal, showInputModal } from "../../core/modals.js";
import {
  getElements,
  updateSetupUI,
  updateScoringLabel,
  renderTournamentConfig,
  renderPlayers,
  renderSchedule,
  renderGameDetails,
  renderCustomCourtNames,
  toggleCustomCourtNames,
  updateRankingCriteria,
  setupCustomSelects,
  renderPreferredPartners,
  showImportModal,
  hideImportModal,
} from "../../ui/index.js";
import {
  addPlayer,
  removeAllPlayers,
  importPlayers as importPlayersData,
  addPreferredPair,
  getAvailablePlayersForPairing,
} from "../../players.js";

/**
 * Attach form-related event listeners.
 * @param {Function} addListener - Listener tracker function
 */
export function attachFormListeners(addListener) {
  const elements = getElements();

  // ===== Clear All Players =====
  if (elements.clearAllPlayersBtn) {
    addListener(elements.clearAllPlayersBtn, "click", () => {
      removeAllPlayers(() => {
        renderPlayers();
        renderPreferredPartners();
        updateSetupUI();
      });
    });
  }

  // ===== Bulk Import =====
  if (elements.importPlayersBtn) {
    addListener(elements.importPlayersBtn, "click", showImportModal);
  }
  if (elements.closeImportModal) {
    addListener(elements.closeImportModal, "click", hideImportModal);
  }
  if (elements.cancelImportBtn) {
    addListener(elements.cancelImportBtn, "click", hideImportModal);
  }
  if (elements.confirmImportBtn) {
    addListener(elements.confirmImportBtn, "click", () => {
      const text = elements.importTextarea ? elements.importTextarea.value : "";
      const result = importPlayersData(text);

      let statusMsg = `Added ${result.added} players.`;
      if (result.duplicates > 0)
        statusMsg += ` Skipped ${result.duplicates} duplicates.`;
      if (result.hitLimit) statusMsg += ` Stopped at 24 max limit.`;

      if (elements.importStatus) elements.importStatus.textContent = statusMsg;
      renderPlayers();

      if (result.added > 0 && result.duplicates === 0 && !result.hitLimit) {
        setTimeout(hideImportModal, 1500);
        showToast(`Imported ${result.added} players`);
      }
    });
  }

  // ===== Add Player Button =====
  if (elements.confirmAddBtn) {
    addListener(elements.confirmAddBtn, "click", () => {
      if (addPlayer(elements.playerNameInput.value)) {
        elements.playerNameInput.value = "";
        elements.playerNameInput.focus();
        renderPlayers();
      }
    });
  }

  // ===== Player Input Enter Key =====
  if (elements.playerNameInput) {
    addListener(elements.playerNameInput, "keydown", (e) => {
      if (e.key === "Enter") {
        if (addPlayer(elements.playerNameInput.value)) {
          elements.playerNameInput.value = "";
          renderPlayers();
        }
      }
    });
  }

  // ===== Format Change =====
  if (elements.format) {
    addListener(elements.format, "change", () => {
      state.format = elements.format.value;
      updateSetupUI();
      saveState();
      if (state.schedule.length > 0) {
        renderGameDetails();
      }
    });
  }

  // ===== Courts Change =====
  if (elements.courts) {
    addListener(elements.courts, "change", () => {
      state.courts = parseInt(elements.courts.value);
      saveState();
      renderTournamentConfig();
      if (state.schedule.length > 0) {
        renderGameDetails();
      }
      if (state.courtFormat === "custom") {
        renderCustomCourtNames();
      }
    });

    addListener(elements.courts, "input", () => {
      const MAX_COURTS = 50;
      const rawVal = elements.courts.value;

      if (rawVal === "") return;

      let val = parseInt(rawVal) || 1;
      val = Math.max(1, Math.min(MAX_COURTS, val));

      if (state.isLocked) return;

      elements.courts.value = val;
      state.courts = val;
      saveState();
      if (state.courtFormat === "custom") {
        renderCustomCourtNames();
      }
      if (state.schedule.length > 0) {
        renderGameDetails();
      }
    });
  }

  // ===== Points Change =====
  if (elements.points) {
    addListener(elements.points, "change", () => {
      state.pointsPerMatch = parseInt(elements.points.value);
      saveState();
      renderTournamentConfig();
      if (state.schedule.length > 0) {
        renderSchedule();
      }
    });
  }

  // ===== Scoring Mode Change =====
  if (elements.scoringMode) {
    addListener(elements.scoringMode, "change", () => {
      state.scoringMode = elements.scoringMode.value;
      updateScoringLabel();
      saveState();
      renderTournamentConfig();
      if (state.schedule.length > 0) {
        renderSchedule();
      }
    });
  }

  // ===== Ranking Criteria =====
  const rankingCriteriaSelect = document.getElementById("rankingCriteria");
  if (rankingCriteriaSelect) {
    addListener(rankingCriteriaSelect, "change", () => {
      state.rankingCriteria = rankingCriteriaSelect.value;
      updateRankingCriteria();
      saveState();
    });
  }

  // ===== Court Format Change =====
  if (elements.courtFormat) {
    addListener(elements.courtFormat, "change", () => {
      state.courtFormat = elements.courtFormat.value;
      toggleCustomCourtNames();
      saveState();
    });
  }

  // ===== Add Partner Pair =====
  if (elements.addPartnerPairBtn) {
    addListener(elements.addPartnerPairBtn, "click", () => {
      const available = getAvailablePlayersForPairing();
      if (available.length < 2) {
        showToast("Not enough available players to form a pair", "error");
        return;
      }

      addPreferredPair();
      renderPreferredPartners();
      updateSetupUI();
      setupCustomSelects();
      showToast("Fixed pair added", "success");
    });
  }
}
