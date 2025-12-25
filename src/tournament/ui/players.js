// Players Module
// Player list rendering and input handling

import { state, saveState } from "../state.js";
import { getElements } from "./elements.js";
import {
  renderPreferredPartners,
  updateAddPartnerPairButton,
} from "./partners.js";
import { validateCourts } from "./courts.js";
import { setupCustomSelects } from "./customSelect.js";
import { renderTournamentConfig } from "./tournamentConfig.js";

/**
 * Render the player list
 */
export function renderPlayers() {
  const els = getElements();

  els.playerList.innerHTML = state.players
    .map((player, index) => {
      const courtOptions = ['<option value="">Auto</option>'];
      for (let i = 1; i <= state.courts; i++) {
        const selected = player.lockedCourt === i ? "selected" : "";
        courtOptions.push(
          `<option value="${i}" ${selected}>Court ${i}</option>`
        );
      }

      return `
    <li class="player-item" data-id="${player.id}">
      <span class="player-number">${index + 1}.</span>
      <span class="player-name">${player.name}</span>
      
      <select 
        class="court-lock-select form-select btn-sm" 
        onchange="window.updatePlayerCourtLock(${player.id}, this.value)"
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

  // Re-attach global handler if not exists
  if (!window.updatePlayerCourtLock) {
    window.updatePlayerCourtLock = (id, value) => {
      const player = state.players.find((p) => p.id === id);
      if (player) {
        player.lockedCourt = value ? parseInt(value) : null;
        saveState();
      }
    };
  }

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
  setupCustomSelects();
  renderTournamentConfig();
}

/**
 * Toggle player list expand/collapse
 */
export function togglePlayerList() {
  const wrapper = document.getElementById("playerListWrapper");
  const btn = document.getElementById("expandPlayersBtn");

  if (wrapper.classList.contains("expanded")) {
    wrapper.classList.remove("expanded");
    btn.innerHTML = `Show All Players (${state.players.length}) ▼`;
  } else {
    wrapper.classList.add("expanded");
    btn.innerHTML = "Show Less ▲";
  }
}

/**
 * Update the player toggle button text and visibility
 */
function updatePlayerToggleBtn() {
  const btn = document.getElementById("expandPlayersBtn");
  const wrapper = document.getElementById("playerListWrapper");
  if (!btn) return;

  // Hide button if there are too few players to need expansion
  // The collapsed height fits about 5-6 players, so hide if <= 5
  const MIN_PLAYERS_FOR_EXPAND = 6;
  if (state.players.length < MIN_PLAYERS_FOR_EXPAND) {
    btn.style.display = "none";
    // Make sure wrapper is expanded when button is hidden so all players show
    if (wrapper) wrapper.classList.add("expanded");
  } else {
    btn.style.display = "block";
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
