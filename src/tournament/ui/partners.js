// Partners Module
// Preferred partners rendering and management

import { state } from "../state.js";
import { getElements } from "./elements.js";

/**
 * Update add partner pair button state
 */
export function updateAddPartnerPairButton() {
  const els = getElements();
  const pairedPlayerIds = new Set();
  state.preferredPartners.forEach((pair) => {
    pairedPlayerIds.add(pair.player1Id);
    pairedPlayerIds.add(pair.player2Id);
  });
  const available = state.players.filter((p) => !pairedPlayerIds.has(p.id));
  els.addPartnerPairBtn.disabled = false;
}

/**
 * Render preferred partners list
 */
export function renderPreferredPartners() {
  const els = getElements();

  const getAllPairedIds = (excludePairId) => {
    const ids = new Set();
    state.preferredPartners.forEach((p) => {
      if (p.id !== excludePairId) {
        ids.add(p.player1Id);
        ids.add(p.player2Id);
      }
    });
    return ids;
  };

  els.preferredPartnersList.innerHTML = state.preferredPartners
    .map((pair) => {
      const pairedElsewhere = getAllPairedIds(pair.id);
      const available = state.players.filter(
        (p) =>
          p.id === pair.player1Id ||
          p.id === pair.player2Id ||
          !pairedElsewhere.has(p.id)
      );

      const availableFor1 = available.filter(
        (p) => p.id !== pair.player2Id || p.id === pair.player1Id
      );
      const availableFor2 = available.filter(
        (p) => p.id !== pair.player1Id || p.id === pair.player2Id
      );

      return `
        <div class="partner-pair" data-pair-id="${pair.id}">
          <select class="form-select" data-action="update-partner" data-pair-id="${
            pair.id
          }" data-which="1">
            ${availableFor1
              .map(
                (p) =>
                  `<option value="${p.id}" ${
                    p.id === pair.player1Id ? "selected" : ""
                  }>${p.name}</option>`
              )
              .join("")}
          </select>
          <span class="pair-separator">&</span>
          <select class="form-select" data-action="update-partner" data-pair-id="${
            pair.id
          }" data-which="2">
            ${availableFor2
              .map(
                (p) =>
                  `<option value="${p.id}" ${
                    p.id === pair.player2Id ? "selected" : ""
                  }>${p.name}</option>`
              )
              .join("")}
          </select>
          <button class="remove-pair-btn" data-action="remove-pair" data-id="${
            pair.id
          }">Remove</button>
        </div>
      `;
    })
    .join("");
}
