/**
 * Event Delegation Module
 * Handles delegated events for dynamically rendered content.
 * Used by the Generator page to handle clicks/changes on elements created after mount.
 */

import {
  removePlayer,
  removePreferredPair,
  updatePreferredPair,
} from "../players.js";
import {
  renderPlayers,
  renderPreferredPartners,
  updateSetupUI,
  setupCustomSelects,
  togglePlayerList,
  toggleManualBye,
  toggleRoundCollapse,
  completeRound,
  editRound,
  toggleLeaderboardVisibility,
  togglePositionChanges,
  toggleToolbar,
  exportTournamentData,
  shareResults,
  autoFillScore,
} from "../ui/index.js";
import { showFinalStandings } from "../core/modals.js";
import { state, saveState } from "../core/state.js";
import { updateCustomCourtName } from "../ui/courts.js";

/**
 * Initialize event delegation for dynamically rendered content.
 * @param {HTMLElement} container - The page container
 * @param {Function} addListener - Listener tracker function
 * @param {Function} promptAddLatePlayer - Late player prompt function
 * @param {Function} endTournament - End tournament function
 */
export function initEventDelegation(
  container,
  addListener,
  promptAddLatePlayer,
  endTournament
) {
  // Click event delegation
  addListener(container, "click", (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;
    const id = target.dataset.id ? Number(target.dataset.id) : null;
    const roundIndex = target.dataset.round
      ? parseInt(target.dataset.round)
      : null;

    switch (action) {
      case "remove-player":
        if (id !== null) {
          removePlayer(id);
          renderPlayers();
        }
        break;
      case "toggle-player-list":
        togglePlayerList();
        break;
      case "remove-pair":
        if (id !== null) {
          removePreferredPair(id);
          renderPreferredPartners();
          updateSetupUI();
          setupCustomSelects();
        }
        break;
      case "toggle-bye":
        if (id !== null) {
          toggleManualBye(id);
        }
        break;
      case "toggle-round":
        if (roundIndex !== null) {
          toggleRoundCollapse(roundIndex);
        }
        break;
      case "complete-round":
        completeRound();
        break;
      case "edit-round":
        if (roundIndex !== null) {
          editRound(roundIndex);
        }
        break;
      case "toggle-visibility":
        toggleLeaderboardVisibility();
        break;
      case "toggle-position":
        togglePositionChanges();
        break;
      case "end-tournament":
        endTournament(showFinalStandings);
        break;
      case "toggle-toolbar":
        toggleToolbar();
        break;
      case "export-data":
        exportTournamentData();
        break;
      case "share-results":
        shareResults();
        break;
      case "add-late-player":
        promptAddLatePlayer();
        break;
    }
  });

  // Change event delegation for selects
  addListener(container, "change", (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;
    const pairId = target.dataset.pairId ? Number(target.dataset.pairId) : null;
    const which = target.dataset.which ? parseInt(target.dataset.which) : null;

    if (action === "update-partner" && pairId !== null && which !== null) {
      updatePreferredPair(pairId, which, Number(target.value));
      renderPreferredPartners();
      updateSetupUI();
      setupCustomSelects();
    }

    // Handle Race Mode autofill on change (blur)
    if (action === "autofill-score" && state.scoringMode === "race") {
      const roundIndex = parseInt(target.dataset.round);
      const matchIndex = parseInt(target.dataset.match);
      const team = parseInt(target.dataset.team);
      const value = target.value;
      autoFillScore(roundIndex, matchIndex, team, value);
    }

    // Handle Player Court Lock
    if (action === "update-court-lock") {
      const playerId = parseInt(target.dataset.playerId);
      const value = target.value;
      const player = state.players.find((p) => p.id === playerId);
      if (player) {
        player.lockedCourt = value ? parseInt(value) : null;
        saveState();
      }
    }
  });

  // Global input listener to limit score inputs to 2 digits
  addListener(container, "input", (e) => {
    if (e.target.classList.contains("score-input")) {
      if (e.target.value.length > 2) {
        e.target.value = e.target.value.slice(0, 2);
      }
    }

    // Smart scoring (Total Points only)
    const target = e.target.closest('[data-action="autofill-score"]');
    if (!target) return;

    // Skip Race mode on input (wait for blur)
    if (state.scoringMode === "race") return;

    const roundIndex = parseInt(target.dataset.round);
    const matchIndex = parseInt(target.dataset.match);
    const team = parseInt(target.dataset.team);
    const value = target.value;

    autoFillScore(roundIndex, matchIndex, team, value);
  });

  // Handle Custom Court Names
  addListener(container, "input", (e) => {
    const target = e.target.closest('[data-action="update-custom-court-name"]');
    if (target) {
      const index = parseInt(target.dataset.index);
      updateCustomCourtName(index, target.value);
    }
  });
}
