/**
 * History Repository
 * Handles saving and retrieving past tournaments from LocalStorage
 */

import { getStateSnapshot, restoreState, saveState } from "./state.js";
import { showToast } from "../shared/utils.js";
import { renderSchedule, renderLeaderboard } from "./ui.js";
import { showConfirmModal } from "./modals.js";

const HISTORY_KEY = "padel_history_v1";

/**
 * Save a completed tournament to history
 */
export function saveToHistory() {
  const history = getHistory();
  const currentState = getStateSnapshot();

  const record = {
    id: Date.now().toString(),
    savedAt: new Date().toISOString(),
    // Summary fields for UI
    summary: {
      date: new Date().toISOString(),
      format: currentState.format,
      winner: currentState.leaderboard[0]?.name || "Unknown",
      playerCount: currentState.players.length,
      roundCount: currentState.schedule.length,
    },
    // Complete state snapshot
    data: currentState,
  };

  history.unshift(record); // Add to top

  // Limit history to 20 items to prevent storage issues
  if (history.length > 20) {
    history.pop();
  }

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return record;
}

/**
 * Get all past tournaments
 * @returns {Array} List of tournament records
 */
export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse history", e);
    return [];
  }
}

/**
 * Delete a specific tournament
 * @param {string} id
 */
export function deleteHistoryItem(id) {
  showConfirmModal(
    "Delete this tournament from history?",
    "This action cannot be undone.",
    "Delete",
    () => {
      const history = getHistory();
      const filtered = history.filter((item) => item.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
      renderHistoryList();
      showToast("Tournament deleted");
    },
    true // isDanger
  );
}

/**
 * Load a specific tournament
 * @param {string} id
 */
export function loadTournament(id) {
  const history = getHistory();
  const item = history.find((i) => i.id === id);

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
        // Restore state
        restoreState(item.data);

        // Refresh UI
        renderSchedule();
        renderLeaderboard();

        // Force a save of the restored state
        saveState();

        hideHistory();
        showToast("Tournament loaded successfully");

        // Ensure schedule section is visible
        document.getElementById("scheduleSection").style.display = "block";
        document.getElementById("leaderboardSection").style.display = "block";
      } catch (e) {
        console.error("Failed to load tournament", e);
        showToast("Error loading tournament", "error");
      }
    },
    false // not danger
  );
}

/**
 * Clear all history
 */
export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

// ===== UI Logic =====

let historyData = [];

export function initHistory() {
  renderHistoryList();

  const searchInput = document.getElementById("historySearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      filterHistory(query);
    });
  }
}

function filterHistory(query) {
  if (!query) {
    renderRows(historyData);
    return;
  }

  const filtered = historyData.filter((item) => {
    const winner = (
      item.summary?.winner ||
      item.players?.[0]?.name ||
      ""
    ).toLowerCase();
    const format = (item.summary?.format || item.format || "").toLowerCase();
    const dateStr = item.summary?.date || item.date || "";
    const playerCount = String(
      item.summary?.playerCount || item.players?.length || ""
    );
    const roundCount = String(item.summary?.roundCount || "");

    // Also format date for better matching
    const dateObj = new Date(dateStr);
    const formattedDate = dateObj
      .toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toLowerCase();

    return (
      winner.includes(query) ||
      format.includes(query) ||
      formattedDate.includes(query) ||
      playerCount.includes(query) ||
      roundCount.includes(query)
    );
  });

  renderRows(filtered);
}

export function showHistory() {
  // Deprecated - History is always visible on page bottom now
  renderHistoryList();
}

export function hideHistory() {
  // Deprecated
}

function renderHistoryList() {
  historyData = getHistory();
  renderRows(historyData);
}

function renderRows(items) {
  const tbody = document.getElementById("historyTableBody");
  const emptyState = document.getElementById("historyEmptyStatePage");

  if (!tbody || !emptyState) return;

  tbody.innerHTML = "";

  if (items.length === 0) {
    tbody.parentElement.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  tbody.parentElement.style.display = "table";
  emptyState.style.display = "none";

  window.deleteHistoryItem = deleteHistoryItem;
  window.loadTournament = loadTournament;
  window.downloadHistoryItem = downloadHistoryItem;

  tbody.innerHTML = items
    .map((item) => {
      const dateStr = item.summary ? item.summary.date : item.date;
      const format = item.summary
        ? item.summary.format
        : item.format || "Unknown";
      const winner = item.summary
        ? item.summary.winner
        : item.players?.[0]?.name || "Unknown";
      const playerCount = item.summary
        ? item.summary.playerCount
        : item.players?.length || 0;

      const dateObj = new Date(dateStr);
      const dateDisplay = dateObj.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const timeDisplay = dateObj.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });

      const canLoad = !!item.data;

      return `
      <tr>
        <td>
          <div class="h-date-cell">
            <span class="date-main">${dateDisplay}</span>
            <span class="date-sub">${timeDisplay}</span>
          </div>
        </td>
        <td>
          <span class="badge badge-sm badge-outline">${format}</span>
        </td>
        <td>
          <div class="winner-cell">
            <span class="trophy-icon">🏆</span>
            <span class="winner-name">${winner}</span>
          </div>
        </td>
        <td>${playerCount}</td>
        <td class="text-right">
           <div class="action-buttons">
              <button 
                onclick="downloadHistoryItem('${item.id}')" 
                class="btn btn-sm btn-ghost"
                title="Download CSV"
              >
                CSV
              </button>
              <button 
                onclick="loadTournament('${item.id}')" 
                class="btn btn-sm btn-primary"
                ${!canLoad ? "disabled" : ""}
                title="Restore this tournament"
              >
                Load
              </button>
              <button 
                onclick="deleteHistoryItem('${item.id}')" 
                class="btn btn-sm btn-ghost text-error"
                title="Delete permanently"
              >
                <i class="fas fa-trash"></i>
              </button>
           </div>
        </td>
      </tr>
      `;
    })
    .join("");
}

export function downloadHistoryItem(id) {
  const history = getHistory();
  const item = history.find((i) => i.id === id);
  if (item && item.data && window.exportTournamentData) {
    window.exportTournamentData(item.data);
  }
}

// Bind close button
document.addEventListener("DOMContentLoaded", () => {
  // Initial bindings if needed
});
