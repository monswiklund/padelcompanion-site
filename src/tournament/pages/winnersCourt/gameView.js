/**
 * Game View Module
 * Handles the active game display for Winners Court.
 */

import { state, saveState } from "../../state.js";
import {
  getWinnersCourtState,
  recordCourtResult,
  nextRound,
} from "../../winnersCourtLogic.js";
import { showConfirmModal } from "../../modals.js";
import { showToast } from "../../../shared/utils.js";
import { renderCourt } from "./courtRenderer.js";

/**
 * Render active game view for all sides.
 * @param {HTMLElement} container - Container element
 * @param {Function} addListener - Listener tracker function
 * @param {Function} onReRender - Callback to re-render the full page
 */
export function renderActiveGame(container, addListener, onReRender) {
  const wc = getWinnersCourtState();
  if (!wc || !wc.sides || !container) {
    if (container) container.innerHTML = "";
    return;
  }

  const { sides, twist } = wc;
  const activeSides = Object.keys(sides).filter(
    (s) => sides[s]?.courts?.length > 0
  );

  if (activeSides.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <div class="wc-view" style="margin-top: 20px; border-top: 1px solid var(--border-color); padding-top: 20px; display: flex; gap: 20px; flex-wrap: wrap;">
      ${activeSides
        .map((side) => renderSide(side, sides[side], twist))
        .join("")}
    </div>
  `;

  // Attach event listeners for each side
  activeSides.forEach((side) => {
    const sideContainer = container.querySelector(`[data-side="${side}"]`);
    if (!sideContainer) return;

    // Clear game button
    const clearBtn = sideContainer.querySelector(".wc-clear-btn");
    if (clearBtn) {
      addListener(clearBtn, "click", () => {
        showConfirmModal(
          `Clear Side ${side}?`,
          "This will reset this side.",
          "Clear",
          () => {
            // Clear just this side
            if (wc.sides[side]) {
              delete wc.sides[side];
              saveState();
            }
            onReRender();
            showToast(`Side ${side} cleared`);
          },
          true
        );
      });
    }

    // Next round button
    const nextBtn = sideContainer.querySelector(".wc-next-btn");
    if (nextBtn) {
      addListener(nextBtn, "click", () => {
        const result = nextRound(side);
        if (result?.error) {
          showToast(result.error, "error");
        } else {
          showToast(`Side ${side} - Round ${wc.sides[side].round} started`);
          renderActiveGame(container, addListener, onReRender);
        }
      });
    }

    // Court click handlers
    sideContainer.querySelectorAll(".wc-court").forEach((courtEl) => {
      const team1 = courtEl.querySelector(".wc-team-horizontal.wc-team1");
      const team2 = courtEl.querySelector(".wc-team-horizontal.wc-team2");

      if (team1) {
        addListener(team1, "click", () => {
          const courtId = parseInt(courtEl.dataset.courtId);
          handleTeamWin(container, side, courtId, 1, addListener, onReRender);
        });
      }
      if (team2) {
        addListener(team2, "click", () => {
          const courtId = parseInt(courtEl.dataset.courtId);
          handleTeamWin(container, side, courtId, 2, addListener, onReRender);
        });
      }
    });
  });
}

/**
 * Render a single side's courts and controls.
 * @param {string} side - Side identifier (A or B)
 * @param {Object} sideState - Side state data
 * @param {boolean} twist - Whether twist mode is active
 * @returns {string} Side HTML
 */
function renderSide(side, sideState, twist) {
  const { courts, round } = sideState;
  const sideLabel = side === "A" ? "Side A" : "Side B";
  const sideColor = side === "A" ? "var(--accent)" : "var(--warning)";

  return `
    <div class="wc-side" data-side="${side}" style="flex: 1; min-width: 300px; padding: 15px; border: 2px solid ${sideColor}; border-radius: var(--radius-md); background: rgba(0,0,0,0.2);">
      <div class="wc-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3 style="margin: 0; color: ${sideColor};">${sideLabel} — Round ${round}</h3>
        <div class="wc-actions" style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm wc-next-btn">Next Round</button>
          <button class="btn btn-danger btn-sm wc-clear-btn">Clear</button>
        </div>
      </div>
      ${
        twist
          ? '<p class="wc-twist-badge" style="margin-bottom: 10px;">Twist Mode Active</p>'
          : ""
      }
      <div class="wc-courts-grid">
        ${courts.map((court) => renderCourt(court, twist, round)).join("")}
      </div>
    </div>
  `;
}

/**
 * Handle team win click for a specific side.
 * @param {HTMLElement} container - Container element
 * @param {string} side - Side identifier
 * @param {number} courtId - Court ID
 * @param {number} winningTeam - 1 or 2
 * @param {Function} addListener - Listener tracker
 * @param {Function} onReRender - Re-render callback
 */
function handleTeamWin(
  container,
  side,
  courtId,
  winningTeam,
  addListener,
  onReRender
) {
  recordCourtResult(side, courtId, winningTeam, 0, 0);
  renderActiveGame(container, addListener, onReRender);
}

/**
 * Render history of previous rounds (for all sides).
 * @param {HTMLElement} container - Container element
 */
export function renderRoundHistory(container) {
  const wc = getWinnersCourtState();
  if (!wc || !wc.sides) return;

  let hasHistory = false;
  let historyHtml = "";

  for (const side of ["A", "B"]) {
    const sideState = wc.sides[side];
    if (!sideState || !sideState.history || sideState.history.length === 0)
      continue;

    hasHistory = true;
    const history = [...sideState.history].reverse();
    const sideColor = side === "A" ? "var(--accent)" : "var(--warning)";

    historyHtml += `
      <div style="margin-bottom: 20px;">
        <h4 style="color: ${sideColor}; margin-bottom: 10px;">Side ${side} History</h4>
        ${history
          .map(
            (roundData) => `
          <div class="wc-history-round" style="margin-bottom: 15px; opacity: 0.7;">
            <span style="color: var(--text-muted); font-size: 0.85rem;">Round ${
              roundData.round
            }</span>
            <div class="wc-courts-grid" style="margin-top: 8px;">
              ${roundData.courts
                .map((court) =>
                  renderCourt(court, false, roundData.round, true)
                )
                .join("")}
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;
  }

  if (!hasHistory) return;

  container.innerHTML = `
    <div style="margin-top: 40px; border-top: 1px solid var(--border-color); padding-top: 20px;">
      <h3 style="color: var(--text-muted); margin-bottom: 20px;">Previous Rounds</h3>
      ${historyHtml}
    </div>
  `;
}
