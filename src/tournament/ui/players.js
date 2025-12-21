// Players Module
// Player list rendering and input handling

import { state } from "../state.js";
import { getElements } from "./elements.js";
import {
  renderPreferredPartners,
  updateAddPartnerPairButton,
} from "./partners.js";
import { validateCourts } from "./courts.js";

/**
 * Render the player list
 */
export function renderPlayers() {
  const els = getElements();

  els.playerList.innerHTML = state.players
    .map(
      (player, index) => `
    <li class="player-item" data-id="${player.id}">
      <span><span class="player-number">${index + 1}.</span> ${
        player.name
      }</span>
      <button class="player-remove" data-action="remove-player" data-id="${
        player.id
      }">×</button>
    </li>
  `
    )
    .join("");

  els.playerCount.textContent = `(${state.players.length})`;
  els.generateBtn.disabled = state.players.length < 4;

  if (state.players.length >= 4) {
    els.playersHint.textContent = `${state.players.length} players ready`;
    els.playersHint.style.color = "var(--success)";
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
}

/**
 * Show the player input row
 */
export function showPlayerInput() {
  const els = getElements();
  els.playerInputRow.style.display = "flex";
  els.addPlayerBtn.style.display = "none";
  els.playerNameInput.focus();
}

/**
 * Hide the player input row
 */
export function hidePlayerInput() {
  const els = getElements();
  els.playerInputRow.style.display = "none";
  els.addPlayerBtn.style.display = "block";
  els.playerNameInput.value = "";
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
 * Update the player toggle button text
 */
function updatePlayerToggleBtn() {
  const btn = document.getElementById("expandPlayersBtn");
  const wrapper = document.getElementById("playerListWrapper");
  if (btn && !wrapper?.classList.contains("expanded")) {
    btn.innerHTML = `Show All Players (${state.players.length}) ▼`;
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
