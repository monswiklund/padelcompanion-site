/**
 * History Renderer
 * Generates HTML for history table rows.
 * Separated from main module for cleaner organization.
 */

/**
 * Render history table rows.
 * @param {Array} items - History items to render
 * @returns {string} HTML string for tbody content
 */
export function renderHistoryRows(items) {
  if (items.length === 0) {
    return "";
  }

  return items
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
      <tr data-history-id="${item.id}">
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
                data-action="download-history" 
                data-id="${item.id}"
                class="btn btn-sm btn-ghost"
                title="Download CSV"
              >
                CSV
              </button>
              <button 
                data-action="load-history"
                data-id="${item.id}"
                class="btn btn-sm btn-primary"
                ${!canLoad ? "disabled" : ""}
                title="Restore this tournament"
              >
                Load
              </button>
              <button 
                data-action="duplicate-history"
                data-id="${item.id}"
                class="btn btn-sm btn-ghost"
                ${!canLoad ? "disabled" : ""}
                title="Copy settings to new tournament"
              >
                Duplicate
              </button>
              <button 
                data-action="delete-history"
                data-id="${item.id}"
                class="btn btn-sm btn-danger"
                title="Delete permanently"
              >
                🗑️
              </button>
           </div>
           <!-- Mobile: Dropdown menu -->
           <div class="action-menu mobile-only">
              <button class="btn btn-sm btn-ghost action-menu-trigger" data-action="toggle-action-menu">⋮</button>
              <div class="action-menu-dropdown">
                <button data-action="load-history" data-id="${item.id}" ${
        !canLoad ? "disabled" : ""
      }>Load</button>
                <button data-action="duplicate-history" data-id="${item.id}" ${
        !canLoad ? "disabled" : ""
      }>Duplicate</button>
                <button data-action="download-history" data-id="${
                  item.id
                }">CSV</button>
                <button class="text-danger" data-action="delete-history" data-id="${
                  item.id
                }">Delete</button>
              </div>
           </div>
        </td>
      </tr>
      `;
    })
    .join("");
}

/**
 * Render empty state HTML.
 * @returns {string} Empty state HTML
 */
export function renderEmptyState() {
  return `
    <div class="empty-state-icon">🏆</div>
    <h3>No tournaments yet</h3>
    <p>Complete your first tournament to see it here!</p>
    <button data-action="scroll-to-top" class="btn btn-primary">
      Start a Tournament
    </button>
  `;
}

/**
 * Filter history items by query.
 * @param {Array} items - All history items
 * @param {string} query - Search query (lowercase)
 * @returns {Array} Filtered items
 */
export function filterHistoryItems(items, query) {
  if (!query) return items;

  return items.filter((item) => {
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

    // Format date for better matching
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
}
