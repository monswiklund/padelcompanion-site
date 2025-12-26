import { state, saveState } from "../../state.js";
import {
  clearBracket,
  updateMatchResult,
  getBracketRounds,
  getRoundName,
  isBracketComplete,
  getFinalStandings,
} from "../../bracketLogic.js";
import { showToast } from "../../../shared/utils.js";
import { showConfirmModal } from "../../modals.js";

// View State
const listeners = [];

function addListener(el, event, handler) {
  if (!el) return;
  el.addEventListener(event, handler);
  listeners.push({ el, event, handler });
}

export function cleanupViewListeners() {
  listeners.forEach(({ el, event, handler }) => {
    el.removeEventListener(event, handler);
  });
  listeners.length = 0;
}

/**
 * Render the main view (dispatches to Single or Dual)
 */
export function renderView(container) {
  cleanupViewListeners();

  // Use renderDualBracket which handles both single and dual formats logic internally
  // But wait, existing code had renderDualBracket calling renderBracket if not dual.
  // Let's replicate that logic.

  if (state.tournament?.format === "dual") {
    renderDualBracket(container);
  } else {
    renderBracket(container);
  }
}

/**
 * Update bracket scale CSS variable.
 */
function updateBracketScale(container, scale) {
  const bracketContainer = container.querySelector(".bracket-container");
  const dualLayout = container.querySelector(".dual-bracket-layout");

  // Convert percentage to decimal (e.g. 100 -> 1)
  const val = scale / 100;

  if (bracketContainer) {
    bracketContainer.style.setProperty("--bracket-scale", val);
  }
  if (dualLayout) {
    dualLayout.style.setProperty("--bracket-scale", val);
  }
}

/**
 * Render bracket visualization.
 */
function renderBracket(container) {
  const rounds = getBracketRounds();
  const numRounds = rounds.length;

  const isComplete = isBracketComplete();

  container.innerHTML = `
    <div class="page-intro-header">
      <h2>Tournament Bracket</h2>
      <p>Single elimination tournament bracket</p>
    </div>
    <div class="bracket-actions" style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
      
      <!-- Size Control -->
      <div class="scale-control" style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 0.85rem; color: var(--text-muted);">Size</span>
        <input type="range" id="bracketScale" min="50" max="150" value="${
          state.bracketScale
        }" style="width: 100px; accent-color: var(--accent);">
        <span id="bracketScaleLabel" style="font-size: 0.85rem; width: 36px;">${
          state.bracketScale
        }%</span>
      </div>

      <div style="width: 1px; height: 20px; background: var(--border-color);"></div>

      <button class="btn btn-secondary btn-sm" id="printBracketBtn">Print</button>
      <button class="btn btn-danger btn-sm" id="clearBracketBtn">Clear</button>
    </div>
    <div class="bracket-container">
      ${rounds
        .map(
          (roundMatches, i) => `
        <div class="bracket-round" data-round="${i + 1}">
          <div class="round-header">${getRoundName(i + 1, numRounds)}</div>
          <div class="round-matches">
            ${roundMatches.map((match) => renderMatch(match)).join("")}
          </div>
        </div>
      `
        )
        .join("")}
    </div>
    ${isComplete ? renderChampions() : ""}
  `;

  // Apply initial scale
  updateBracketScale(container, state.bracketScale);

  // Scale Slider
  const scaleSlider = container.querySelector("#bracketScale");
  const scaleLabel = container.querySelector("#bracketScaleLabel");
  if (scaleSlider) {
    addListener(scaleSlider, "input", (e) => {
      const val = parseInt(e.target.value);
      scaleLabel.textContent = `${val}%`;
      updateBracketScale(container, val);
    });
    addListener(scaleSlider, "change", (e) => {
      const val = parseInt(e.target.value);
      state.bracketScale = val;
      saveState();
    });
  }

  // Event delegation for match clicks
  const bracketContainer = container.querySelector(".bracket-container");
  addListener(bracketContainer, "click", (e) => {
    const matchEl = e.target.closest(".bracket-match");
    if (matchEl && !matchEl.classList.contains("bye")) {
      const matchId = parseInt(matchEl.dataset.matchId);
      openScoreEntry(container, matchId);
    }
  });

  // Clear button
  const clearBtn = container.querySelector("#clearBracketBtn");
  addListener(clearBtn, "click", () => {
    showConfirmModal(
      "Clear Bracket?",
      "This will delete the entire bracket and all results.",
      "Clear",
      () => {
        clearBracket();
        // Since we are clearing, we should probably navigate back to setup or reload state
        // But renderView checks state.tournament. Since we cleared it (presumably clearBracket resets it),
        // we might want to signal the controller to re-render.
        // We can dispatch a custom event or check state in renderView??
        // Actually clearBracket resets state.tournament data but keeps the object?
        // Let's assume clearBracket clears the tournament data.
        // We'll call renderView, but renderView relies on state.tournament.matches length?
        // The index.js controller will handle the empty state check on mount.
        // Here we can just reload page or call a passed callback?
        // Let's emit a custom event to prompt re-mount
        container.dispatchEvent(
          new CustomEvent("tournament-cleared", { bubbles: true })
        );
      },
      true
    );
  });

  // Print button
  const printBtn = container.querySelector("#printBracketBtn");
  if (printBtn) {
    addListener(printBtn, "click", () => window.print());
  }
}

/**
 * Render dual bracket visualization (Side A left, Grand Final center, Side B right).
 */
function renderDualBracket(container) {
  const tournament = state.tournament;

  const matchesA = tournament.matchesA || [];
  const matchesB = tournament.matchesB || [];
  const grandFinal = tournament.grandFinal;
  const numRoundsA = tournament.numRoundsA || 0;
  const numRoundsB = tournament.numRoundsB || 0;

  // Group matches by round
  const groupByRound = (matches) => {
    const grouped = {};
    matches.forEach((m) => {
      if (!grouped[m.round]) grouped[m.round] = [];
      grouped[m.round].push(m);
    });
    return Object.values(grouped);
  };

  const roundsA = groupByRound(matchesA);
  const roundsB = groupByRound(matchesB);

  container.innerHTML = `
    <div class="page-intro-header">
      <h2>Dual Bracket Tournament</h2>
      <p>Side A vs Side B • Winners meet in Grand Final</p>
    </div>
    <div class="bracket-actions" style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
      
      <!-- Size Control -->
      <div class="scale-control" style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 0.85rem; color: var(--text-muted);">Size</span>
        <input type="range" id="bracketScale" min="50" max="150" value="${
          state.bracketScale
        }" style="width: 100px; accent-color: var(--accent);">
        <span id="bracketScaleLabel" style="font-size: 0.85rem; width: 36px;">${
          state.bracketScale
        }%</span>
      </div>

      <div style="width: 1px; height: 20px; background: var(--border-color);"></div>

      <button class="btn btn-secondary btn-sm" id="printBracketBtn">Print</button>
      <button class="btn btn-danger btn-sm" id="clearBracketBtn">Clear</button>
    </div>

    <!-- Mobile Tabs -->
    <div class="mobile-bracket-tabs">
      <button class="tab-btn ${
        state.ui.activeBracketTab === "A" ? "active" : ""
      }" data-tab="A">Side A</button>
      <button class="tab-btn ${
        state.ui.activeBracketTab === "Final" ? "active" : ""
      }" data-tab="Final">Final</button>
      <button class="tab-btn ${
        state.ui.activeBracketTab === "B" ? "active" : ""
      }" data-tab="B">Side B</button>
    </div>
    
    <div class="dual-bracket-layout" style="display: flex; gap: 20px; align-items: flex-start; justify-content: center; flex-wrap: wrap; padding: 20px 0;">
      
      <!-- Side A Bracket (Left) -->
      <div class="bracket-side side-a ${
        state.ui.activeBracketTab === "A" ? "mobile-active" : ""
      }" style="flex: 1; border: 2px solid var(--accent); border-radius: 12px; padding: 16px; background: rgba(59, 130, 246, 0.05);">
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="font-weight: 700; font-size: 1.1rem; color: var(--accent);">Side A</span>
          <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 8px;">(${
            tournament.teamsA?.length || 0
          } teams)</span>
        </div>
        <div class="bracket-container" style="display: flex; gap: 12px; overflow-x: auto;">
          ${roundsA
            .map(
              (roundMatches, i) => `
            <div class="bracket-round" data-round="${i + 1}">
              <div class="round-header">${getRoundName(i + 1, numRoundsA)}</div>
              <div class="round-matches">
                ${roundMatches.map((match) => renderMatch(match)).join("")}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
      
      <!-- Grand Final (Center) -->
      <div class="bracket-final ${
        state.ui.activeBracketTab === "Final" ? "mobile-active" : ""
      }" style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
        <div style="font-size: 0.85rem; color: var(--success); font-weight: 700; margin-bottom: 8px;">🏆 GRAND FINAL 🏆</div>
        ${
          grandFinal
            ? renderMatch(grandFinal)
            : '<div style="color: var(--text-muted);">TBD</div>'
        }
        ${
          grandFinal?.winner
            ? `
          <div style="margin-top: 12px; text-align: center;">
            <div style="font-size: 0.75rem; color: var(--text-muted);">Champion</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--success);">
              ${
                tournament.teams.find((t) => t.id === grandFinal.winner)
                  ?.name || "?"
              }
            </div>
          </div>
        `
            : ""
        }
      </div>
      
      <!-- Side B Bracket (Right) -->
      <div class="bracket-side side-b ${
        state.ui.activeBracketTab === "B" ? "mobile-active" : ""
      }" style="flex: 1; border: 2px solid var(--warning); border-radius: 12px; padding: 16px; background: rgba(245, 158, 11, 0.05);">
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="font-weight: 700; font-size: 1.1rem; color: var(--warning);">Side B</span>
          <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 8px;">(${
            tournament.teamsB?.length || 0
          } teams)</span>
        </div>
        <div class="bracket-container" style="display: flex; gap: 12px; overflow-x: auto;">
          ${[...roundsB]
            .reverse()
            .map((roundMatches, i) => {
              const roundNum = numRoundsB - i;
              return `
            <div class="bracket-round" data-round="${roundNum}">
              <div class="round-header">${getRoundName(
                roundNum,
                numRoundsB
              )}</div>
              <div class="round-matches">
                ${roundMatches.map((match) => renderMatch(match)).join("")}
              </div>
            </div>
          `;
            })
            .join("")}
        </div>
      </div>
    </div>
  `;

  // Apply initial scale
  updateBracketScale(container, state.bracketScale);

  // Scale Slider
  const scaleSlider = container.querySelector("#bracketScale");
  const scaleLabel = container.querySelector("#bracketScaleLabel");
  if (scaleSlider) {
    addListener(scaleSlider, "input", (e) => {
      const val = parseInt(e.target.value);
      scaleLabel.textContent = `${val}%`;
      updateBracketScale(container, val);
    });
    addListener(scaleSlider, "change", (e) => {
      const val = parseInt(e.target.value);
      state.bracketScale = val;
      saveState();
    });
  }

  // Mobile Tab Listeners
  const tabBtns = container.querySelectorAll(".mobile-bracket-tabs .tab-btn");
  tabBtns.forEach((btn) => {
    addListener(btn, "click", () => {
      state.ui.activeBracketTab = btn.dataset.tab;
      saveState();
      renderDualBracket(container);
    });
  });

  // Event delegation for match clicks
  const dualLayout = container.querySelector(".dual-bracket-layout");
  addListener(dualLayout, "click", (e) => {
    const matchEl = e.target.closest(".bracket-match");
    if (matchEl && !matchEl.classList.contains("bye")) {
      const matchId = parseInt(matchEl.dataset.matchId);
      openScoreEntry(container, matchId);
    }
  });

  // Clear button
  const clearBtn = container.querySelector("#clearBracketBtn");
  addListener(clearBtn, "click", () => {
    showConfirmModal(
      "Clear Bracket?",
      "This will delete the entire bracket and all results.",
      "Clear",
      () => {
        clearBracket();
        container.dispatchEvent(
          new CustomEvent("tournament-cleared", { bubbles: true })
        );
      },
      true
    );
  });

  // Print button
  const printBtn = container.querySelector("#printBracketBtn");
  if (printBtn) {
    addListener(printBtn, "click", () => window.print());
  }
}

/**
 * Render a single match.
 */
function renderMatch(match) {
  const hasTeams = match.team1 || match.team2;
  const isBye = match.isBye;
  const isComplete = match.winner != null;
  const canEdit = hasTeams && match.team1 && match.team2 && !isBye;

  const team1IsWinner = isComplete && match.winner === match.team1?.id;
  const team2IsWinner = isComplete && match.winner === match.team2?.id;
  const team1Class = team1IsWinner ? "winner" : isComplete ? "loser" : "";
  const team2Class = team2IsWinner ? "winner" : isComplete ? "loser" : "";

  // Side badges helper
  const getSideBadge = (team) => {
    if (!team || !team.side) return "";
    const color = team.side === "A" ? "var(--accent)" : "var(--warning)";
    return `<span style="background: ${color}; color: white; font-size: 0.6rem; padding: 1px 4px; border-radius: 3px; margin-right: 4px; font-weight: bold;">${team.side}</span>`;
  };

  return `
    <div class="bracket-match ${isBye ? "bye" : ""} ${
    isComplete ? "complete" : ""
  } ${canEdit ? "editable" : ""}" 
         data-match-id="${match.id}">
      <div class="match-team ${team1Class}">
        ${getSideBadge(match.team1)}<span class="team-name">${
    match.team1?.name || "TBD"
  }</span>
        <span class="team-score">${match.score1 ?? "-"}</span>
      </div>
      <div class="match-team ${team2Class}">
        ${getSideBadge(match.team2)}<span class="team-name">${
    match.team2?.name || "TBD"
  }</span>
        <span class="team-score">${match.score2 ?? "-"}</span>
      </div>
      ${isBye ? '<div class="bye-label">BYE</div>' : ""}
    </div>
  `;
}

/**
 * Render champions section when bracket is complete.
 */
function renderChampions() {
  const standings = getFinalStandings();
  const first = standings.find((s) => s.place === 1);
  const second = standings.find((s) => s.place === 2);
  const thirds = standings.filter((s) => s.place === 3);

  return `
    <div class="bracket-champions">
      <h3>Champions</h3>
      <div class="podium">
        <div class="podium-place second">
          <div class="podium-medal">2</div>
          <div class="podium-team">${second?.team?.name || "-"}</div>
          <div class="podium-block"></div>
        </div>
        <div class="podium-place first">
          <div class="podium-medal">1</div>
          <div class="podium-team">${first?.team?.name || "-"}</div>
          <div class="podium-block"></div>
        </div>
        <div class="podium-place third">
          <div class="podium-medal">3</div>
          <div class="podium-team">${thirds[0]?.team?.name || "-"}</div>
          <div class="podium-block"></div>
        </div>
      </div>
      ${
        thirds.length > 1
          ? `<div class="also-third"><span class="also-label">Also 3rd:</span> ${thirds
              .slice(1)
              .map((t) => t.team?.name)
              .join(", ")}</div>`
          : ""
      }
    </div>
  `;
}

/**
 * Open score entry modal for a match.
 */
function openScoreEntry(container, matchId) {
  const match = state.tournament.matches.find((m) => m.id === matchId);
  if (!match || !match.team1 || !match.team2) return;

  // Get saved score type
  const savedScoreType = localStorage.getItem("bracket_score_type") || "points";
  const scoreTypeLabel =
    savedScoreType.charAt(0).toUpperCase() + savedScoreType.slice(1);

  // Create custom modal for score entry
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.style.display = "flex";
  modal.innerHTML = `
    <div class="modal score-modal">
      <div class="modal-header">
        <h3>Enter Score</h3>
        <button class="close-modal" id="closeScoreModal">Close</button>
      </div>
      <div class="modal-body">
        <div class="score-type-label" style="text-align: center; margin-bottom: 12px; font-size: 0.85rem; color: var(--text-muted);">
          Scoring: <strong style="color: var(--accent);">${scoreTypeLabel}</strong>
        </div>
        <div class="score-entry-cards">
          <div class="score-card">
            <div class="score-card-team">${match.team1.name}</div>
            <input type="number" id="score1Input" class="form-input score-input" 
                   value="${
                     match.score1 ?? ""
                   }" min="0" max="99" placeholder="0" />
          </div>
          <div class="score-divider">VS</div>
          <div class="score-card">
            <div class="score-card-team">${match.team2.name}</div>
            <input type="number" id="score2Input" class="form-input score-input" 
                   value="${
                     match.score2 ?? ""
                   }" min="0" max="99" placeholder="0" />
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" id="cancelScoreBtn">Cancel</button>
        <button class="btn btn-primary" id="saveScoreBtn">Save Score</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    modal.remove();
  };

  const saveScore = () => {
    const score1 = parseInt(
      document.getElementById("score1Input").value || "0"
    );
    const score2 = parseInt(
      document.getElementById("score2Input").value || "0"
    );

    if (score1 === score2) {
      showToast("Scores cannot be tied in elimination", "error");
      return;
    }

    updateMatchResult(matchId, score1, score2);
    closeModal();
    // Re-render view
    renderView(container);

    // Check if tournament complete
    if (isBracketComplete()) {
      showToast("Tournament complete! View the winners.", "success");
    }
  };

  modal.querySelector("#closeScoreModal").addEventListener("click", closeModal);
  modal.querySelector("#cancelScoreBtn").addEventListener("click", closeModal);
  modal.querySelector("#saveScoreBtn").addEventListener("click", saveScore);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Focus first input
  setTimeout(() => document.getElementById("score1Input")?.focus(), 100);
}
