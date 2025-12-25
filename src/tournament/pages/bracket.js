/**
 * Bracket Page Module
 * Single elimination bracket visualization.
 * Shown at /tournament/#/bracket
 */

import { state, saveState } from "../state.js";
import { navigate } from "../router.js";
import {
  initBracketTournament,
  clearBracket,
  updateMatchResult,
  getBracketRounds,
  getRoundName,
  isBracketComplete,
  getFinalStandings,
} from "../bracketLogic.js";
import { showConfirmModal, showInputModal } from "../modals.js";
import { showToast } from "../../shared/utils.js";

// Track attached listeners for cleanup
const listeners = [];

function addListener(el, event, handler) {
  if (!el) return;
  el.addEventListener(event, handler);
  listeners.push({ el, event, handler });
}

/**
 * Bracket page module.
 */
export const bracketPage = {
  /**
   * Mount the bracket page.
   * @param {HTMLElement} container - The page container
   * @param {URLSearchParams} params - URL query params
   */
  mount(container, params) {
    console.log("[BracketPage] Mounting...");

    // Check if we have bracket data
    if (!state.tournament?.matches?.length) {
      this.renderEmptyState(container);
      return;
    }

    this.renderBracket(container);
  },

  /**
   * Render empty state with creation flow.
   */
  renderEmptyState(container) {
    container.innerHTML = `
      <div class="bracket-empty-state">
        <h2>Create a Bracket</h2>
        <p>Set up a single elimination tournament bracket.</p>
        <div class="bracket-team-input">
          <textarea 
            id="bracketTeamsInput" 
            class="form-input" 
            rows="6" 
            placeholder="Enter team names (one per line)&#10;&#10;Team Alpha&#10;Team Beta&#10;Team Gamma&#10;Team Delta"
          ></textarea>
          <p class="form-hint">Minimum 2 teams. Best with 4, 8, or 16 teams.</p>
        </div>
        <button class="btn btn-primary" id="createBracketBtn">Create Bracket</button>
      </div>
    `;

    const createBtn = container.querySelector("#createBracketBtn");
    const teamsInput = container.querySelector("#bracketTeamsInput");

    addListener(createBtn, "click", () => {
      const text = teamsInput.value.trim();
      const teamNames = text
        .split("\n")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      if (teamNames.length < 2) {
        showToast("Need at least 2 teams", "error");
        return;
      }

      if (teamNames.length > 32) {
        showToast("Maximum 32 teams allowed", "error");
        return;
      }

      try {
        initBracketTournament(teamNames);
        showToast(`Bracket created with ${teamNames.length} teams`, "success");
        this.renderBracket(container);
      } catch (e) {
        showToast("Error creating bracket: " + e.message, "error");
      }
    });
  },

  /**
   * Render bracket visualization.
   */
  renderBracket(container) {
    const rounds = getBracketRounds();
    const numRounds = rounds.length;

    const isComplete = isBracketComplete();

    container.innerHTML = `
      <div class="bracket-header">
        <h2>Tournament Bracket</h2>
        <div class="bracket-actions">
          <button class="btn btn-secondary btn-sm" id="printBracketBtn">Print</button>
          <button class="btn btn-danger btn-sm" id="clearBracketBtn">Clear</button>
        </div>
      </div>
      <div class="bracket-container">
        ${rounds
          .map(
            (roundMatches, i) => `
          <div class="bracket-round" data-round="${i + 1}">
            <div class="round-header">${getRoundName(i + 1, numRounds)}</div>
            <div class="round-matches">
              ${roundMatches.map((match) => this.renderMatch(match)).join("")}
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      ${isComplete ? this.renderChampions() : ""}
    `;

    // Event delegation for match clicks
    const bracketContainer = container.querySelector(".bracket-container");
    addListener(bracketContainer, "click", (e) => {
      const matchEl = e.target.closest(".bracket-match");
      if (matchEl && !matchEl.classList.contains("bye")) {
        const matchId = parseInt(matchEl.dataset.matchId);
        this.openScoreEntry(container, matchId);
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
          this.renderEmptyState(container);
          showToast("Bracket cleared");
        },
        true
      );
    });

    // Print button
    const printBtn = container.querySelector("#printBracketBtn");
    if (printBtn) {
      addListener(printBtn, "click", () => window.print());
    }
  },

  /**
   * Render a single match.
   */
  renderMatch(match) {
    const hasTeams = match.team1 || match.team2;
    const isBye = match.isBye;
    const isComplete = match.winner != null;
    const canEdit = hasTeams && match.team1 && match.team2 && !isBye;

    const team1IsWinner = isComplete && match.winner === match.team1?.id;
    const team2IsWinner = isComplete && match.winner === match.team2?.id;
    const team1Class = team1IsWinner ? "winner" : isComplete ? "loser" : "";
    const team2Class = team2IsWinner ? "winner" : isComplete ? "loser" : "";

    return `
      <div class="bracket-match ${isBye ? "bye" : ""} ${
      isComplete ? "complete" : ""
    } ${canEdit ? "editable" : ""}" 
           data-match-id="${match.id}">
        <div class="match-team ${team1Class}">
          <span class="team-name">${match.team1?.name || "TBD"}</span>
          <span class="team-score">${match.score1 ?? "-"}</span>
        </div>
        <div class="match-team ${team2Class}">
          <span class="team-name">${match.team2?.name || "TBD"}</span>
          <span class="team-score">${match.score2 ?? "-"}</span>
        </div>
        ${isBye ? '<div class="bye-label">BYE</div>' : ""}
      </div>
    `;
  },

  /**
   * Render champions section when bracket is complete.
   */
  renderChampions() {
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
  },

  /**
   * Open score entry modal for a match.
   */
  openScoreEntry(container, matchId) {
    const match = state.tournament.matches.find((m) => m.id === matchId);
    if (!match || !match.team1 || !match.team2) return;

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
          <div class="score-type-selector">
            <label>Score Type:</label>
            <div class="score-type-buttons">
              <button class="btn btn-sm score-type-btn active" data-type="points">Points</button>
              <button class="btn btn-sm score-type-btn" data-type="games">Games</button>
              <button class="btn btn-sm score-type-btn" data-type="sets">Sets</button>
            </div>
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
      this.renderBracket(container);

      // Check if tournament complete
      if (isBracketComplete()) {
        showToast("Tournament complete! View the winners.", "success");
      }
    };

    modal
      .querySelector("#closeScoreModal")
      .addEventListener("click", closeModal);
    modal
      .querySelector("#cancelScoreBtn")
      .addEventListener("click", closeModal);
    modal.querySelector("#saveScoreBtn").addEventListener("click", saveScore);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Score type toggle (visual only for now)
    modal.querySelectorAll(".score-type-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        modal
          .querySelectorAll(".score-type-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    // Focus first input
    setTimeout(() => document.getElementById("score1Input")?.focus(), 100);
  },

  /**
   * Unmount the bracket page.
   */
  unmount() {
    console.log("[BracketPage] Unmounting...");

    listeners.forEach(({ el, event, handler }) => {
      el.removeEventListener(event, handler);
    });
    listeners.length = 0;
  },
};
