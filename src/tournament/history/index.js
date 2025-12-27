/**
 * History Module
 * Manages tournament history UI and interactions.
 * Uses event delegation instead of inline onclick handlers.
 */

import { getStateSnapshot, restoreState, saveState } from "../state.js";
import { showToast } from "../../shared/utils.js";
import { renderSchedule, renderLeaderboard } from "../ui/index.js";
import { showConfirmModal } from "../modals.js";

// Sub-modules
import {
  getHistory,
  getHistoryItem,
  saveToHistory as saveToHistoryRepo,
  deleteFromHistory,
} from "./repository.js";
import {
  renderHistoryRows,
  renderEmptyState,
  filterHistoryItems,
} from "./renderer.js";

// Module state
let historyData = [];
let historyListeners = [];

/**
 * Track a listener for cleanup.
 */
function addListener(el, event, handler) {
  if (!el) return;
  el.addEventListener(event, handler);
  historyListeners.push({ el, event, handler });
}

/**
 * Remove all tracked listeners.
 */
function removeAllListeners() {
  historyListeners.forEach(({ el, event, handler }) => {
    el.removeEventListener(event, handler);
  });
  historyListeners.length = 0;
}

/**
 * Initialize history module.
 * Sets up event delegation and renders the list.
 */
export function initHistory() {
  // Clean up any existing listeners
  removeAllListeners();

  renderHistoryList();

  // Search input
  const searchInput = document.getElementById("historySearch");
  if (searchInput) {
    addListener(searchInput, "input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = filterHistoryItems(historyData, query);
      renderRows(filtered);
    });
  }

  // Event delegation for history actions
  const historySection = document.getElementById("historySectionPage");
  if (historySection) {
    addListener(historySection, "click", handleHistoryClick);
  }

  // Also attach to any other history containers
  const historyTable = document.getElementById("historyTableBody");
  if (historyTable) {
    addListener(
      historyTable.closest("table") || historyTable.parentElement,
      "click",
      handleHistoryClick
    );
  }
}

/**
 * Handle click events via delegation.
 */
function handleHistoryClick(e) {
  const target = e.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;
  const id = target.dataset.id;

  switch (action) {
    case "load-history":
      if (id) loadTournament(id);
      break;
    case "delete-history":
      if (id) deleteHistoryItem(id);
      break;
    case "duplicate-history":
      if (id) duplicateTournament(id);
      break;
    case "download-history":
      if (id) downloadHistoryItem(id);
      break;
    case "toggle-action-menu":
      toggleActionMenu(target);
      break;
    case "scroll-to-top":
      window.scrollTo({ top: 0, behavior: "smooth" });
      break;
  }
}

/**
 * Save current tournament to history.
 * @returns {Object} The saved record
 */
export function saveToHistory() {
  const snapshot = getStateSnapshot();
  return saveToHistoryRepo(snapshot);
}

/**
 * Render the history list.
 */
export function renderHistoryList() {
  historyData = getHistory();
  renderRows(historyData);
}

// Alias for compatibility
export const renderHistory = renderHistoryList;

/**
 * Render rows to the table.
 */
function renderRows(items) {
  const tbody = document.getElementById("historyTableBody");
  const emptyState = document.getElementById("historyEmptyStatePage");

  if (!tbody || !emptyState) return;

  tbody.innerHTML = "";

  if (items.length === 0) {
    tbody.parentElement.style.display = "none";
    emptyState.innerHTML = renderEmptyState();
    emptyState.style.display = "block";
    return;
  }

  tbody.parentElement.style.display = "table";
  emptyState.style.display = "none";
  tbody.innerHTML = renderHistoryRows(items);
}

/**
 * Load a tournament from history.
 * @param {string} id - Tournament ID
 */
export function loadTournament(id) {
  const item = getHistoryItem(id);

  if (!item) {
    showToast("Tournament details not found", "error");
    return;
  }

  showConfirmModal(
    "Load this tournament?",
    "This will overwrite the current tournament.",
    "Load",
    () => {
      try {
        restoreState(item.data);
        renderSchedule();
        renderLeaderboard();
        saveState();
        showToast("Tournament loaded successfully");

        // Ensure sections are visible
        const scheduleSection = document.getElementById("scheduleSection");
        const leaderboardSection =
          document.getElementById("leaderboardSection");
        if (scheduleSection) scheduleSection.style.display = "block";
        if (leaderboardSection) leaderboardSection.style.display = "block";
      } catch (e) {
        console.error("Failed to load tournament", e);
        showToast("Error loading tournament", "error");
      }
    },
    false
  );
}

/**
 * Delete a tournament from history.
 * @param {string} id - Tournament ID
 */
export function deleteHistoryItem(id) {
  showConfirmModal(
    "Delete this tournament from history?",
    "This action cannot be undone.",
    "Delete",
    () => {
      deleteFromHistory(id);
      renderHistoryList();
      showToast("Tournament deleted");
    },
    true
  );
}

/**
 * Duplicate a tournament (copy settings, reset scores).
 * @param {string} id - Tournament ID
 */
export function duplicateTournament(id) {
  const item = getHistoryItem(id);

  if (!item || !item.data) {
    showToast("Tournament details not found", "error");
    return;
  }

  showConfirmModal(
    "Duplicate this tournament?",
    "This will copy settings and players but reset all scores.",
    "Duplicate",
    () => {
      try {
        const freshState = {
          ...item.data,
          leaderboard: [],
          schedule: [],
          currentRound: 0,
          allRounds: null,
          isLocked: false,
          hideLeaderboard: true,
          manualByes: [],
        };

        restoreState(freshState);
        renderSchedule();
        renderLeaderboard();
        saveState();
        showToast("Tournament duplicated - ready to start!");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e) {
        console.error("Failed to duplicate tournament", e);
        showToast("Error duplicating tournament", "error");
      }
    },
    false
  );
}

/**
 * Download tournament as CSV.
 * @param {string} id - Tournament ID
 */
export function downloadHistoryItem(id) {
  const item = getHistoryItem(id);
  if (item && item.data && window.exportTournamentData) {
    window.exportTournamentData(item.data);
  }
}

/**
 * Toggle action menu dropdown on mobile.
 */
function toggleActionMenu(trigger) {
  const menu = trigger.nextElementSibling;
  if (!menu) return;

  const isOpen = menu.classList.contains("open");

  // Close all other open menus
  document.querySelectorAll(".action-menu-dropdown.open").forEach((m) => {
    m.classList.remove("open");
  });

  if (!isOpen) {
    menu.classList.add("open");
  }
}

/**
 * Cleanup history module.
 * Call when unmounting a page that uses history.
 */
export function cleanupHistory() {
  removeAllListeners();
}

// Re-export repository functions for backward compatibility
export {
  getHistory,
  getHistoryItem,
  deleteFromHistory as clearHistory,
} from "./repository.js";
