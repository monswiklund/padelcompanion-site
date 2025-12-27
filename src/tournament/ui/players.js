// Players Module
// Player list rendering and input handling

import { state, saveState } from "../core/state.js";
import { getElements } from "./elements.js";
import {
  renderPreferredPartners,
  updateAddPartnerPairButton,
} from "./partners.js";
import { validateCourts } from "./courts.js";
import { setupCustomSelects } from "./customSelect.js";
import { renderTournamentConfig } from "./tournamentConfig.js";
import { renderPlayerListItem } from "./components/playerList.js";

/**
 * Render the player list
 */
export function renderPlayers() {
  const els = getElements();

  els.playerList.innerHTML = state.players
    .map((player, index) => {
      // Build court lock options for this specific player
      const courtOptions = ['<option value="">Auto</option>'];
      for (let i = 1; i <= state.courts; i++) {
        const selected = player.lockedCourt === i ? "selected" : "";
        courtOptions.push(
          `<option value="${i}" ${selected}>Court ${i}</option>`
        );
      }

      // We manually construct the item here because we have extra "court lock" UI
      // specific to the Generator page which the shared component doesn't support by default.
      // However, we can use the shared CSS classes.
      //
      // For now, let's KEEP this custom logic here but clean it up,
      // or extend the shared component to accept "customActions".
      //
      // To strictly follow the plan "Refactor to use the new playerList.js component":
      // The shared component is simple. This usage is complex (has court lock select).
      //
      // Improved approach: Let's refactor this to use the shared HTML structure but inject the custom control.
      return `
    <li class="player-item slide-in-up" data-id="${
      player.id
    }" style="animation-duration: 0.3s;">
      <span class="player-number">${index + 1}.</span>
      <span class="player-name text-truncate" title="${player.name}">${
        player.name
      }</span>
      
      <select 
        class="court-lock-select form-select btn-sm" 
        data-action="update-court-lock"
        data-player-id="${player.id}"
        onclick="event.stopPropagation()"
        title="Lock to specific court"
      >
        ${courtOptions.join("")}
      </select>
      <button class="player-remove" data-action="remove-player" data-id="${
        player.id
      }">×</button>
    </li>
  `;
    })
    .join("");

  els.playerCount.textContent = `(${state.players.length})`;
  els.generateBtn.disabled = state.players.length < 4;

  if (state.players.length >= 4) {
    const isMultipleOf4 = state.players.length % 4 === 0;
    const capacity = state.courts * 4;
    const exceedsCapacity = state.players.length > capacity;

    if (!isMultipleOf4 || exceedsCapacity) {
      const reason = exceedsCapacity
        ? `exceeds capacity for ${state.courts} court${
            state.courts > 1 ? "s" : ""
          }`
        : `uneven number for ${state.courts} court${
            state.courts > 1 ? "s" : ""
          }`;

      els.playersHint.textContent = `${state.players.length} players ready! Since it ${reason}, a queue system will be applied.`;
      els.playersHint.style.color = "var(--warning)";
    } else {
      els.playersHint.textContent = `${state.players.length} players ready`;
      els.playersHint.style.color = "var(--success)";
    }
  } else {
    els.playersHint.textContent = `Add at least ${
      4 - state.players.length
    } more player${4 - state.players.length > 1 ? "s" : ""}`;
    els.playersHint.style.color = "";
  }

  renderPreferredPartners();
  updateAddPartnerPairButton();
  updatePlayerToggleBtn();
  validateCourts();
  validateCourts();
  setupCustomSelects();
  renderTournamentConfig();
}

/**
 * Toggle player list expand/collapse
 */
export function togglePlayerList() {
  const wrapper = document.getElementById("playerListWrapper");
  const list =
    document.getElementById("genPlayerList") ||
    document.getElementById("playerList");
  const btn = document.getElementById("genExpandBtn");

  if (wrapper.classList.contains("expanded")) {
    wrapper.classList.remove("expanded");
    if (list) list.style.setProperty("max-height", "400px", "important");
    btn.innerHTML = `Show All Players (${state.players.length}) ▼`;
  } else {
    wrapper.classList.add("expanded");
    if (list) list.style.setProperty("max-height", "2000px", "important"); // Large enough to show all
    btn.innerHTML = "Show Less ▲";
  }
}

/**
 * Update the player toggle button text and visibility
 */
function updatePlayerToggleBtn() {
  // Try multiple ways to find the button to be absolutely sure
  let btn = document.getElementById("genExpandBtn");
  if (!btn) {
    console.warn("genExpandBtn not found by ID, trying querySelector");
    btn = document.querySelector("#playerListWrapper .btn");
  }

  const wrapper = document.getElementById("playerListWrapper");
  if (!btn) {
    console.error("Expand button STILL not found");
    return;
  }
  console.log("Found expand button:", btn);

  // Hide button if there are too few players to need expansion
  // Lower threshold to ensure it shows up more often for testing/consistency
  const MIN_PLAYERS_FOR_EXPAND = 8;

  if (state.players.length <= MIN_PLAYERS_FOR_EXPAND) {
    btn.style.display = "none";
  } else {
    btn.style.setProperty("display", "block", "important");
    if (!wrapper?.classList.contains("expanded")) {
      btn.innerHTML = `Show All Players (${state.players.length}) ▼`;
    }
  }
}

/**
 * Show import modal
 */
export function showImportModal() {
  const els = getElements();
  els.importModal.style.display = "flex";
  els.importTextarea.value = "";
  els.importStatus.textContent = "";
  els.importTextarea.focus();
}

/**
 * Hide import modal
 */
export function hideImportModal() {
  const els = getElements();
  els.importModal.style.display = "none";
}
