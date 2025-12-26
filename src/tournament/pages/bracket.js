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
import { showConfirmModal, showInputModal, showInfoModal } from "../modals.js";
import { showToast } from "../../shared/utils.js";

// Track attached listeners for cleanup
const listeners = [];

// Temporary teams array for bracket setup
let tempTeams = [];
let listExpanded = false;

function addListener(el, event, handler) {
  if (!el) return;
  el.addEventListener(event, handler);
  listeners.push({ el, event, handler });
}

/**
 * Save teams to localStorage
 */
function saveTeams() {
  localStorage.setItem("bracket_teams", JSON.stringify(tempTeams));
}

/**
 * Load teams from localStorage
 */
function loadTeams() {
  try {
    const saved = localStorage.getItem("bracket_teams");
    if (saved) {
      tempTeams = JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load bracket teams", e);
    tempTeams = [];
  }
}

/**
 * Get team hint text
 */
function getTeamsHint() {
  const count = tempTeams.length;

  if (count < 2) {
    return `Add at least ${2 - count} more team${2 - count > 1 ? "s" : ""}`;
  }

  // Check if power of 2
  const isPowerOf2 = (count & (count - 1)) === 0 && count >= 4;

  if (isPowerOf2) {
    return `<span style="color: var(--success)">✓ ${count} teams ready (perfect bracket)</span>`;
  } else {
    const rounds = Math.ceil(Math.log2(count));
    const nextPowerOf2 = Math.pow(2, rounds);
    const byeCount = nextPowerOf2 - count;
    return `<span style="color: var(--warning)">${count} teams • ${byeCount} bye${
      byeCount > 1 ? "s" : ""
    } will be assigned</span>`;
  }
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

    // Load saved teams
    loadTeams();

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
    const savedDualMode = localStorage.getItem("bracket_dual_mode") === "true";

    container.innerHTML = `
      <div class="bracket-empty-state">
        <h2>Create a Bracket</h2>
        <p>Set up a single elimination tournament bracket.</p>
        
        <div class="players-section" style="max-width: 500px; margin: 0 auto;">
          <div class="section-header">
            <h3>Teams <span id="bracketTeamCount">(${
              tempTeams.length
            })</span></h3>
            <div class="player-actions">
              <button class="btn btn-sm btn-secondary" id="importTeamsBtn">Import...</button>
              <button class="btn btn-sm btn-danger" id="clearAllTeamsBtn">Clear All</button>
            </div>
          </div>
          
          <div class="player-input-row" style="display: flex; gap: 12px; align-items: flex-end;">
            <div class="input-group" style="flex: 1;">
              <label for="bracketTeamInput" style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">Team Name</label>
              <input type="text" id="bracketTeamInput" class="form-input" placeholder="Enter team name..." />
            </div>
            <button class="btn btn-primary" id="addTeamBtn" style="height: 44px;">Add</button>
          </div>
          
          <ul class="player-list" id="bracketTeamsList" style="max-height: ${
            listExpanded ? "2000px" : "200px"
          }; overflow-y: auto; transition: max-height 0.3s ease;">
            ${this.renderTeamItems()}
          </ul>
          
          ${
            tempTeams.length > 5
              ? `
            <button class="btn btn-sm btn-secondary" id="bracketToggleTeamsBtn" data-expanded="${listExpanded}" style="width: 100%; margin-top: 8px;">
              ${listExpanded ? "Show Less" : `Show All (${tempTeams.length})`}
            </button>
          `
              : ""
          }
          
          <p class="players-hint" id="bracketTeamsHint">${getTeamsHint()}</p>
          <p class="form-hint" style="margin-top: 8px;">
            Use 4, 8, 16, or 32 teams for perfect brackets. 
            <button type="button" id="bracketHelp" class="help-btn" style="background: none; border: none; color: var(--accent); cursor: pointer; font-weight: bold; padding: 0 4px;">?</button>
          </p>
        </div>
        
        <div class="bracket-options" style="display: flex; gap: 20px; justify-content: center; margin: 15px 0; flex-wrap: wrap;">
          <label class="wc-toggle" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="bracketDualMode" ${
              savedDualMode ? "checked" : ""
            } />
            <span class="slider round"></span>
            <span>Dual Brackets (A vs B)</span>
          </label>
          <label class="wc-toggle" id="sharedFinalLabel" style="display: ${
            savedDualMode ? "flex" : "none"
          }; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="bracketSharedFinal" ${
              localStorage.getItem("bracket_shared_final") !== "false"
                ? "checked"
                : ""
            } />
            <span class="slider round"></span>
            <span>Shared Grand Final 🏆</span>
          </label>
          <div id="sideAssignLabel" style="display: ${
            savedDualMode ? "flex" : "none"
          }; align-items: center; gap: 8px;">
            <span style="font-size: 0.85rem; color: var(--text-secondary);">Assign:</span>
            <select id="bracketSideAssign" class="form-input" style="padding: 4px 8px; font-size: 0.85rem;">
              <option value="random" ${
                localStorage.getItem("bracket_side_assign") === "random" ||
                !localStorage.getItem("bracket_side_assign")
                  ? "selected"
                  : ""
              }>Random</option>
              <option value="alternate" ${
                localStorage.getItem("bracket_side_assign") === "alternate"
                  ? "selected"
                  : ""
              }>Alternate (1-A, 2-B...)</option>
              <option value="half" ${
                localStorage.getItem("bracket_side_assign") === "half"
                  ? "selected"
                  : ""
              }>First Half A / Second B</option>
            </select>
            <button type="button" id="assignHelp" class="help-btn" style="background: none; border: none; color: var(--accent); cursor: pointer; font-weight: bold; padding: 0 4px;">?</button>
          </div>
        </div>
        
        <div id="bracketPreview" class="bracket-preview" style="margin: 20px auto; padding: 15px; background: var(--bg-tertiary); border-radius: var(--radius-md); display: ${
          tempTeams.length >= 2 ? "block" : "none"
        }; width: fit-content; max-width: 100%;">
          <div id="bracketPreviewContent"></div>
        </div>
        
        <button class="btn btn-primary" id="createBracketBtn" ${
          tempTeams.length < 2 ? "disabled" : ""
        }>Create Bracket</button>
      </div>
    `;

    // Update preview immediately if we have teams
    this.updatePreview(container);

    // Attach event listeners
    this.attachSetupListeners(container);
  },

  /**
   * Render team list items
   */
  renderTeamItems() {
    return tempTeams
      .map(
        (team, i) => `
        <li class="player-item" data-index="${i}">
          <span class="player-number">${i + 1}.</span>
          <span class="player-name">${team}</span>
          <button class="player-remove" data-index="${i}">×</button>
        </li>
      `
      )
      .join("");
  },

  /**
   * Update the bracket preview
   */
  updatePreview(container) {
    const previewEl = container.querySelector("#bracketPreview");
    const previewContent = container.querySelector("#bracketPreviewContent");
    const dualModeToggle = container.querySelector("#bracketDualMode");
    const sharedFinalToggle = container.querySelector("#bracketSharedFinal");

    if (!previewEl || !previewContent) return;

    if (tempTeams.length >= 2) {
      previewEl.style.display = "block";
      const isDualMode = dualModeToggle?.checked || false;
      const sharedFinal = sharedFinalToggle?.checked ?? true;
      previewContent.innerHTML = this.renderBracketPreview(
        tempTeams,
        isDualMode,
        sharedFinal
      );
    } else {
      previewEl.style.display = "none";
    }
  },

  /**
   * Attach event listeners for setup form
   */
  attachSetupListeners(container) {
    const teamInput = container.querySelector("#bracketTeamInput");
    const addBtn = container.querySelector("#addTeamBtn");
    const importBtn = container.querySelector("#importTeamsBtn");
    const clearBtn = container.querySelector("#clearAllTeamsBtn");
    const createBtn = container.querySelector("#createBracketBtn");
    const dualModeToggle = container.querySelector("#bracketDualMode");
    const sharedFinalToggle = container.querySelector("#bracketSharedFinal");
    const sideAssignSelect = container.querySelector("#bracketSideAssign");

    // Add team
    const addTeam = () => {
      const name = teamInput.value.trim();

      if (!name) return;

      // Check for duplicate
      if (tempTeams.some((t) => t.toLowerCase() === name.toLowerCase())) {
        showToast("Team already exists!", "error");
        return;
      }

      if (tempTeams.length >= 32) {
        showToast("Maximum 32 teams allowed", "error");
        return;
      }

      tempTeams.push(name);
      saveTeams();
      teamInput.value = "";
      this.renderEmptyState(container);
      container.querySelector("#bracketTeamInput")?.focus();
      showToast(`${name} added`, "success");
    };

    addListener(addBtn, "click", addTeam);
    addListener(teamInput, "keypress", (e) => {
      if (e.key === "Enter") addTeam();
    });

    // Import teams
    if (importBtn) {
      addListener(importBtn, "click", () => {
        showInputModal(
          "Import Teams",
          "Team Alpha\nTeam Beta\nTeam Gamma",
          (text) => {
            const lines = text.split("\n");
            let added = 0;
            lines.forEach((line) => {
              const name = line.trim();
              if (!name) return;
              if (tempTeams.some((t) => t.toLowerCase() === name.toLowerCase()))
                return;
              if (tempTeams.length >= 32) return;

              tempTeams.push(name);
              added++;
            });

            if (added > 0) {
              saveTeams();
              this.renderEmptyState(container);
              showToast(`Imported ${added} teams`, "success");
            }
          },
          "Enter team names, one per line."
        );
      });
    }

    // Clear all teams
    addListener(clearBtn, "click", () => {
      showConfirmModal(
        "Clear All Teams?",
        "This will remove all teams from the list.",
        "Clear",
        () => {
          tempTeams = [];
          saveTeams();
          this.renderEmptyState(container);
          showToast("All teams cleared");
        },
        true
      );
    });

    // Remove team (event delegation)
    const teamsList = container.querySelector("#bracketTeamsList");
    if (teamsList) {
      addListener(teamsList, "click", (e) => {
        if (e.target.classList.contains("player-remove")) {
          const index = parseInt(e.target.dataset.index);
          const removed = tempTeams.splice(index, 1)[0];
          saveTeams();
          this.renderEmptyState(container);
          showToast(`${removed} removed`);
        }
      });
    }

    // Toggle show all teams
    const toggleBtn = container.querySelector("#bracketToggleTeamsBtn");
    if (toggleBtn) {
      addListener(toggleBtn, "click", () => {
        listExpanded = !listExpanded;
        this.renderEmptyState(container);
      });
    }

    // Dual mode toggle
    addListener(dualModeToggle, "change", () => {
      const sharedFinalLabel = container.querySelector("#sharedFinalLabel");
      const sideAssignLabel = container.querySelector("#sideAssignLabel");
      localStorage.setItem(
        "bracket_dual_mode",
        dualModeToggle.checked ? "true" : "false"
      );
      if (sharedFinalLabel) {
        sharedFinalLabel.style.display = dualModeToggle.checked
          ? "flex"
          : "none";
      }
      if (sideAssignLabel) {
        sideAssignLabel.style.display = dualModeToggle.checked
          ? "flex"
          : "none";
      }
      this.updatePreview(container);
    });

    // Shared final toggle
    if (sharedFinalToggle) {
      addListener(sharedFinalToggle, "change", () => {
        localStorage.setItem(
          "bracket_shared_final",
          sharedFinalToggle.checked ? "true" : "false"
        );
        this.updatePreview(container);
      });
    }

    // Side assignment dropdown
    if (sideAssignSelect) {
      addListener(sideAssignSelect, "change", () => {
        localStorage.setItem("bracket_side_assign", sideAssignSelect.value);
      });
    }

    // Assign help button
    const assignHelpBtn = container.querySelector("#assignHelp");
    if (assignHelpBtn) {
      addListener(assignHelpBtn, "click", (e) => {
        e.preventDefault();
        showInfoModal(
          "Side Assignment Explained",
          `<p><strong>How teams are divided between Side A and Side B:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li><strong>🎲 Random</strong> – Teams are shuffled randomly between sides</li>
            <li><strong>↔️ Alternate</strong> – Team 1→A, Team 2→B, Team 3→A, Team 4→B, etc.</li>
            <li><strong>½ First Half A / Second Half B</strong> – Top half of your list goes to Side A, bottom half to Side B</li>
          </ul>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 10px;">Tip: Use 'First Half' if you've ordered teams by seed/skill and want to keep top seeds separated!</p>`
        );
      });
    }

    // Help button
    const helpBtn = container.querySelector("#bracketHelp");
    if (helpBtn) {
      addListener(helpBtn, "click", (e) => {
        e.preventDefault();
        showInfoModal(
          "Bracket Sizes Explained",
          `<p><strong>Perfect bracket sizes:</strong> 4, 8, 16, or 32 teams</p>
          <p>With these numbers, all teams play every round—no one gets a free pass!</p>
          <hr style="margin: 12px 0; border-color: var(--border-color);">
          <p><strong>What are "byes"?</strong></p>
          <p>If you don't have a perfect number (e.g., 10 teams), some teams get a <strong>bye</strong>—they skip round 1 and go directly to round 2.</p>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 8px;">Example: With 10 teams, 6 teams get byes (advance automatically), and 4 teams play in round 1.</p>
          <hr style="margin: 12px 0; border-color: var(--border-color);">
          <p><strong>Dual Brackets mode:</strong></p>
          <p>Splits teams into Side A and Side B. Each side has its own bracket, and the winners face off in a Grand Final!</p>`
        );
      });
    }

    // Create bracket button
    addListener(createBtn, "click", () => {
      if (tempTeams.length < 2) {
        showToast("Need at least 2 teams", "error");
        return;
      }

      if (tempTeams.length > 32) {
        showToast("Maximum 32 teams allowed", "error");
        return;
      }

      try {
        initBracketTournament(tempTeams);
        showToast(`Bracket created with ${tempTeams.length} teams`, "success");
        this.renderBracket(container);
      } catch (e) {
        showToast("Error creating bracket: " + e.message, "error");
      }
    });
  },

  /**
   * Render a visual preview of the bracket structure
   */
  renderBracketPreview(teamNames, isDualMode = false, sharedFinal = true) {
    if (isDualMode) {
      return this.renderDualBracketPreview(teamNames, sharedFinal);
    }
    return this.renderSingleBracketPreview(teamNames);
  },

  /**
   * Render single bracket preview
   */
  renderSingleBracketPreview(teamNames) {
    const count = teamNames.length;
    const rounds = Math.ceil(Math.log2(count));
    const totalMatches = count - 1;

    // Check if power of 2
    const isPowerOf2 = (count & (count - 1)) === 0;
    const byeCount = isPowerOf2 ? 0 : Math.pow(2, rounds) - count;

    // Calculate nearest power of 2 options
    const lowerPow2 = Math.pow(2, Math.floor(Math.log2(count)));
    const upperPow2 = Math.pow(2, rounds);
    const removeToFit = count - lowerPow2;
    const addToFit = upperPow2 - count;

    const bracketHtml = this.renderMiniBracket(count, "var(--accent)");

    // Guidance hint for non-power-of-2
    const guidanceHtml =
      byeCount > 0
        ? `
      <div style="margin-top: 10px; padding: 8px 12px; background: var(--bg-secondary); border-radius: 6px; font-size: 0.8rem; color: var(--text-secondary); text-align: center;">
        💡 <strong>${byeCount} teams get byes</strong> (auto-advance to round 2)
        <div style="margin-top: 4px; color: var(--text-muted);">
          For perfect brackets: remove ${removeToFit} team${
            removeToFit > 1 ? "s" : ""
          } → ${lowerPow2} teams 
          <span style="margin: 0 6px;">|</span> 
          add ${addToFit} team${addToFit > 1 ? "s" : ""} → ${upperPow2} teams
        </div>
      </div>
    `
        : `
      <div style="margin-top: 10px; padding: 8px 12px; background: rgba(34, 197, 94, 0.1); border-radius: 6px; font-size: 0.8rem; color: var(--success); text-align: center;">
        ✓ Perfect bracket size! No byes needed.
      </div>
    `;

    return `
      <div style="text-align: center; margin-bottom: 8px;">
        <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${count} Teams</span>
        <span style="color: var(--text-muted); font-size: 0.85rem;"> • ${rounds} rounds • ${totalMatches} matches</span>
      </div>
      ${bracketHtml}
      ${guidanceHtml}
    `;
  },

  /**
   * Render dual bracket preview (Side A vs Side B)
   */
  renderDualBracketPreview(teamNames, sharedFinal = true) {
    const count = teamNames.length;
    const halfCount = Math.ceil(count / 2);
    const sideACount = halfCount;
    const sideBCount = count - halfCount;

    // When sharedFinal is true, don't show individual winner boxes (they meet in Grand Final)
    const sideABracket = this.renderMiniBracket(
      sideACount,
      "var(--accent)",
      !sharedFinal
    );
    const sideBBracket = this.renderMiniBracketReversed(
      sideBCount,
      "var(--warning)"
    );

    // Calculate byes for warning
    const sideARounds = Math.ceil(Math.log2(sideACount));
    const sideBRounds = Math.ceil(Math.log2(sideBCount));
    const sideAByes = Math.pow(2, sideARounds) - sideACount;
    const sideBByes = Math.pow(2, sideBRounds) - sideBCount;

    return `
      <div style="text-align: center; margin-bottom: 12px;">
        <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${count} Teams → 2 ${
      sharedFinal ? "Brackets" : "Separate Tournaments"
    }</span>
      </div>
      <div class="dual-bracket-container" style="display: flex; align-items: stretch; justify-content: center; gap: 10px; flex-wrap: wrap;">
        <!-- Side A -->
        <div style="flex: 0 1 auto; width: fit-content; padding: 10px; border: 2px solid var(--accent); border-radius: 8px; background: rgba(59, 130, 246, 0.05);">
          <div style="text-align: center; margin-bottom: 8px; font-weight: 600; color: var(--accent);">
            Side A (${sideACount}) ${!sharedFinal ? "🏆" : ""}
            ${
              sideAByes > 0
                ? `<span style="color: var(--warning); font-size: 0.75rem;" title="${sideAByes} byes"> ⚠️</span>`
                : ""
            }
          </div>
          ${sideABracket}
        </div>
        
        <!-- Center: Grand Final or Separator -->
        ${
          sharedFinal
            ? `
          <div style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 10px;">
            <div style="font-size: 0.7rem; color: var(--success); font-weight: 600;">GRAND FINAL</div>
            <div style="width: 60px; height: 30px; background: linear-gradient(135deg, var(--accent), var(--warning)); border-radius: 6px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 1.2rem;">🏆</span>
            </div>
            <div style="font-size: 0.6rem; color: var(--text-muted);">A 🆚 B</div>
          </div>
        `
            : ""
        }
        
        <!-- Side B -->
        <div style="flex: 0 1 auto; width: fit-content; padding: 10px; border: 2px solid var(--warning); border-radius: 8px; background: rgba(245, 158, 11, 0.05);">
          <div style="text-align: center; margin-bottom: 8px; font-weight: 600; color: var(--warning);">
            Side B (${sideBCount}) ${!sharedFinal ? "🏆" : ""}
            ${
              sideBByes > 0
                ? `<span style="color: var(--warning); font-size: 0.75rem;" title="${sideBByes} byes"> ⚠️</span>`
                : ""
            }
          </div>
          ${sideBBracket}
        </div>
      </div>
    `;
  },

  /**
   * Render a mini bracket visualization (reversed for mirrored display)
   * Shows F → SF → QF flowing toward center (left to right)
   */
  renderMiniBracketReversed(count, color) {
    const rounds = Math.ceil(Math.log2(count));

    // Build rounds array in normal order first
    const roundsData = [];
    for (let i = 0; i < rounds; i++) {
      const matchesInRound = Math.pow(2, rounds - i - 1);
      let name;
      if (matchesInRound === 1) name = "F";
      else if (matchesInRound === 2) name = "SF";
      else if (matchesInRound === 4) name = "QF";
      else name = `R${matchesInRound * 2}`;
      roundsData.push({ name, matches: matchesInRound });
    }

    // Reverse to show F first (leftmost), then SF, then QF (rightmost)
    roundsData.reverse();

    let html =
      '<div style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding: 5px 0;">';

    for (let r = 0; r < roundsData.length; r++) {
      const { name, matches } = roundsData[r];

      if (r > 0) {
        html +=
          '<div style="color: var(--text-muted); font-size: 0.8rem;">←</div>';
      }

      html += `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
          <div style="font-size: 0.65rem; color: ${color}; font-weight: 600;">${name}</div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            ${Array.from(
              { length: matches },
              () => `
              <div style="width: 60px; height: 20px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 3px;"></div>
            `
            ).join("")}
          </div>
        </div>
      `;
    }

    html += "</div>";
    return html;
  },

  /**
   * Render a mini bracket visualization
   * @param {number} count - Number of teams
   * @param {string} color - Color for round labels
   * @param {boolean} showWinner - Whether to show the winner box at the end
   */
  renderMiniBracket(count, color, showWinner = true) {
    const rounds = Math.ceil(Math.log2(count));

    // Round names
    const roundNames = [];
    for (let i = 0; i < rounds; i++) {
      const matchesInRound = Math.pow(2, rounds - i - 1);
      if (matchesInRound === 1) roundNames.push("F");
      else if (matchesInRound === 2) roundNames.push("SF");
      else if (matchesInRound === 4) roundNames.push("QF");
      else roundNames.push(`R${matchesInRound * 2}`);
    }

    let html =
      '<div style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding: 5px 0;">';

    for (let r = 0; r < rounds; r++) {
      const matchesInRound = Math.pow(2, rounds - r - 1);

      if (r > 0) {
        html +=
          '<div style="color: var(--text-muted); font-size: 0.8rem;">→</div>';
      }

      html += `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
          <div style="font-size: 0.65rem; color: ${color}; font-weight: 600;">${
        roundNames[r]
      }</div>
          <div style="display: flex; flex-direction: column; gap: 3px;">
            ${Array.from(
              { length: matchesInRound },
              () => `
              <div style="width: 60px; height: 20px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 3px;"></div>
            `
            ).join("")}
          </div>
        </div>
      `;
    }

    // Winner (only show if showWinner is true)
    if (showWinner) {
      html += `
        <div style="color: var(--text-muted); font-size: 0.8rem;">→</div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
          <div style="font-size: 0.65rem; color: var(--success);">🏆</div>
          <div style="width: 60px; height: 20px; background: linear-gradient(135deg, ${color}, var(--success)); border-radius: 3px;"></div>
        </div>
      `;
    }
    html += "</div>";

    return html;
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
