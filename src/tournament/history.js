/**
 * History Repository
 * Handles saving and retrieving past tournaments from LocalStorage
 */

import { getStateSnapshot, restoreState, saveState } from "./state.js";
import { showToast } from "../shared/utils.js";
import { renderSchedule, renderLeaderboard } from "./ui/index.js";
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
      name: currentState.tournamentName || "",
      notes: currentState.tournamentNotes || "",
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

export function renderHistoryList() {
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
    emptyState.innerHTML = `
      <div class="empty-state-icon">🏆</div>
      <h3>No tournaments yet</h3>
      <p>Complete your first tournament to see it here!</p>
      <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" class="btn btn-primary">
        Start a Tournament
      </button>
    `;
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

      // Capitalize format name
      const rawFormat = item.summary
        ? item.summary.format
        : item.format || "Unknown";
      const format = rawFormat.charAt(0).toUpperCase() + rawFormat.slice(1);

      // Get winner from sorted leaderboard if available
      let winner = "Unknown";
      if (item.data?.leaderboard?.length > 0) {
        const sorted = [...item.data.leaderboard].sort(
          (a, b) => b.points - a.points
        );
        winner = sorted[0]?.name || "Unknown";
      } else if (item.summary?.winner) {
        winner = item.summary.winner;
      }

      const playerCount = item.summary
        ? item.summary.playerCount
        : item.players?.length || 0;

      const roundCount =
        item.summary?.roundCount || item.data?.schedule?.length || 0;

      // Consistent date format
      const dateObj = new Date(dateStr);
      const dateDisplay = dateObj.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const timeDisplay = dateObj.toLocaleTimeString("en-GB", {
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
        <td>${roundCount}</td>
        <td class="text-right">
           <!-- Desktop: Show all buttons -->
           <div class="action-buttons desktop-only">
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
                onclick="duplicateTournament('${item.id}')" 
                class="btn btn-sm btn-ghost"
                ${!canLoad ? "disabled" : ""}
                title="Copy settings to new tournament"
              >
                Duplicate
              </button>
              <button 
                onclick="deleteHistoryItem('${item.id}')" 
                class="btn btn-sm btn-danger"
                title="Delete permanently"
              >
                🗑️
              </button>
           </div>
           <!-- Mobile: Dropdown menu -->
           <div class="action-menu mobile-only">
              <button class="btn btn-sm btn-ghost action-menu-trigger" onclick="toggleActionMenu(this)">⋮</button>
              <div class="action-menu-dropdown">
                <button onclick="loadTournament('${item.id}')" ${
        !canLoad ? "disabled" : ""
      }>Load</button>
                <button onclick="duplicateTournament('${item.id}')" ${
        !canLoad ? "disabled" : ""
      }>Duplicate</button>
                <button onclick="downloadHistoryItem('${item.id}')">CSV</button>
                <button class="text-danger" onclick="deleteHistoryItem('${
                  item.id
                }')">Delete</button>
              </div>
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

/**
 * Duplicate tournament settings for a new tournament
 * @param {string} id
 */
export function duplicateTournament(id) {
  const history = getHistory();
  const item = history.find((i) => i.id === id);

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
        // Create a fresh state from the tournament data but reset scores
        const data = item.data;
        const freshState = {
          ...data,
          leaderboard: [],
          schedule: [],
          currentRound: 0,
          allRounds: null,
          isLocked: false,
          hideLeaderboard: true,
          manualByes: [],
        };

        restoreState(freshState);

        // Refresh UI
        renderSchedule();
        renderLeaderboard();

        saveState();
        showToast("Tournament duplicated - ready to start!");

        // Scroll to top
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
 * Toggle action menu dropdown on mobile
 */
export function toggleActionMenu(trigger) {
  const menu = trigger.nextElementSibling;
  const isOpen = menu.classList.contains("open");

  // Close all other open menus
  document.querySelectorAll(".action-menu-dropdown.open").forEach((m) => {
    m.classList.remove("open");
  });

  if (!isOpen) {
    menu.classList.add("open");
  }
}

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".action-menu")) {
    document.querySelectorAll(".action-menu-dropdown.open").forEach((m) => {
      m.classList.remove("open");
    });
  }
});

// Bind functions to window
window.duplicateTournament = duplicateTournament;
window.toggleActionMenu = toggleActionMenu;

// Bind close button
document.addEventListener("DOMContentLoaded", () => {
  // Initial bindings if needed
});
