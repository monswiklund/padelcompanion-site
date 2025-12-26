/**
 * Bracket Page Module
 * Single elimination bracket visualization.
 * Shown at /tournament/#/bracket
 */

import { state, saveState } from "../state.js";
import { navigate } from "../router.js";
import {
  initBracketTournament,
  initDualBracketTournament,
  clearBracket,
  updateMatchResult,
  getBracketRounds,
  getRoundName,
  isBracketComplete,
  getFinalStandings,
} from "../bracketLogic.js";
import { showConfirmModal, showInputModal, showInfoModal } from "../modals.js";
import { showToast } from "../../shared/utils.js";
import { getHistoryTemplate } from "../ui/historyTemplate.js";
import { initHistory, renderHistory } from "../history.js";
import {
  SIDE_CONFIGS,
  renderDualBracketPreview as renderDualPreview,
  renderMultiBracketPreview as renderMultiPreview,
} from "../ui/bracketComponents.js";

// Track attached listeners for cleanup
const listeners = [];

// Temporary teams array for bracket setup
let tempTeams = [];
let listExpanded = false;
let bracketMode = localStorage.getItem("bracket_mode") || "teams"; // "teams" or "players"

// Helper functions for mode-specific labels
function getModeLabel() {
  return bracketMode === "players" ? "Players" : "Teams";
}
function getModeLabelSingular() {
  return bracketMode === "players" ? "Player" : "Team";
}
function getModeInputPlaceholder() {
  return bracketMode === "players"
    ? "Enter player name..."
    : "Enter team name...";
}

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
      const parsed = JSON.parse(saved);
      // Convert old string format to new object format
      tempTeams = parsed.map((t) =>
        typeof t === "string" ? { name: t, side: null } : t
      );
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
 * Get team name (handles both string and object formats)
 */
function getTeamName(team) {
  return typeof team === "string" ? team : team.name;
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

    // Append History Section
    const historyContainer = document.createElement("div");
    historyContainer.innerHTML = getHistoryTemplate();
    container.appendChild(historyContainer);

    // Initialize History
    initHistory();
    renderHistory();
  },

  /**
   * Render empty state with creation flow.
   */
  renderEmptyState(container) {
    const savedDualMode = localStorage.getItem("bracket_dual_mode") === "true";

    container.innerHTML = `
      <div class="bracket-empty-state">
        <div class="page-intro-header">
          <h2>Create a Bracket</h2>
          <p>Set up a single elimination tournament bracket.</p>
        </div>
        
        <div class="players-section" style="max-width: 700px; margin: 0 auto;">
          <div class="section-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3>${getModeLabel()} <span id="bracketTeamCount">(${
      tempTeams.length
    })</span></h3>
              <button class="help-icon" id="bracketHelpBtn" style="width: 24px; height: 24px; font-size: 0.9rem; font-weight: bold;">?</button>
            </div>
            <div class="player-actions">
              <button class="btn btn-sm btn-secondary" id="importTeamsBtn">Import...</button>
              <button class="btn btn-sm btn-danger" id="clearAllTeamsBtn">Clear All</button>
            </div>
          </div>
          
          <div class="player-input-row" style="display: flex; gap: 12px; align-items: flex-end;">
            <div class="input-group" style="flex: 1;">
              <label for="bracketTeamInput" style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">${getModeLabelSingular()} Name</label>
              <input type="text" id="bracketTeamInput" class="form-input" placeholder="${getModeInputPlaceholder()}" />
            </div>
            <button class="btn btn-primary" id="addTeamBtn" style="height: 44px;">Add</button>
          </div>
          
          <div class="team-list-container">
          <ul id="bracketTeamsList" class="player-list custom-scrollbar-y" style="max-height: 400px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px; padding: 4px; transition: max-height 0.3s ease-out !important;">
            ${this.renderTeamItems()}
          </ul>
          <button class="btn btn-sm btn-secondary" id="bracketToggleTeamsBtn" style="width: 100%; margin-top: 8px; display: none;">Show All (${
            tempTeams.length
          })</button>
          
          
          <p class="players-hint" id="bracketTeamsHint">${getTeamsHint()}</p>
          <p class="form-hint" style="margin-top: 8px;">
            Use 4, 8, 16, or 32 ${
              bracketMode === "players" ? "players" : "teams"
            } for perfect brackets. 
            <button type="button" id="bracketHelp" class="help-btn" style="background: none; border: none; color: var(--accent); cursor: pointer; font-weight: bold; padding: 0 4px;">?</button>
          </p>
        </div>
        
        <div class="bracket-options" style="display: flex; flex-direction: column; gap: 16px; margin: 15px auto; max-width: 600px;">
          
          <!-- Format Section -->
          <div class="settings-section" style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; padding-bottom: 12px; border-bottom: 1px solid var(--border-color);">
            <label class="wc-toggle" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <span style="color: ${
                bracketMode === "teams" ? "var(--accent)" : "var(--text-muted)"
              }; font-weight: ${
      bracketMode === "teams" ? "600" : "400"
    };">Teams</span>
              <input type="checkbox" id="bracketModeToggle" ${
                bracketMode === "players" ? "checked" : ""
              } />
              <span class="slider round"></span>
              <span style="color: ${
                bracketMode === "players"
                  ? "var(--accent)"
                  : "var(--text-muted)"
              }; font-weight: ${
      bracketMode === "players" ? "600" : "400"
    };">Players</span>
            </label>
            <label class="wc-toggle" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="bracketDualMode" ${
                savedDualMode ? "checked" : ""
              } />
              <span class="slider round"></span>
              <span>Pool Play</span>
            </label>
          </div>
          
          <!-- Pool Settings Section (only visible when Multi-Brackets enabled) -->
          <div id="poolSettingsSection" style="display: ${
            savedDualMode ? "flex" : "none"
          }; flex-direction: column; gap: 12px; padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-md);">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Pool Settings</div>
            
            <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
              <!-- Number of Pools -->
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.85rem; color: var(--text-secondary);">Pools:</span>
                <select id="bracketCount" class="form-input" style="padding: 4px 8px; font-size: 0.85rem;">
                  ${[2, 3, 4, 5, 6]
                    .map(
                      (n) =>
                        `<option value="${n}" ${
                          parseInt(
                            localStorage.getItem("bracket_count") || "2"
                          ) === n
                            ? "selected"
                            : ""
                        }>${n} (${String.fromCharCode(
                          65
                        )}...${String.fromCharCode(64 + n)})</option>`
                    )
                    .join("")}
                </select>
              </div>
              
              <!-- Pair Finals Toggle -->
              <label class="wc-toggle" id="sharedFinalLabel" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" id="bracketSharedFinal" ${
                  localStorage.getItem("bracket_shared_final") !== "false"
                    ? "checked"
                    : ""
                } />
                <span class="slider round"></span>
                <span>Pair Finals 🏆</span>
              </label>

              <!-- Assignment Method -->
              <div style="display: flex; align-items: center; gap: 8px;">
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
                  }>Alternate</option>
                  <option value="half" ${
                    localStorage.getItem("bracket_side_assign") === "half"
                      ? "selected"
                      : ""
                  }>Split by Pool</option>
                  <option value="manual" ${
                    localStorage.getItem("bracket_side_assign") === "manual"
                      ? "selected"
                      : ""
                  }>Manual</option>
                </select>
                <button type="button" id="assignHelp" class="help-btn" style="background: none; border: none; color: var(--accent); cursor: pointer; font-weight: bold; padding: 0 4px;">?</button>
              </div>
            </div>
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
   * Render team list items with pool selection badge
   */
  renderTeamItems() {
    return tempTeams
      .map((team, i) => {
        const name = getTeamName(team);
        const side = team.side || null;
        const sideConfig = side ? SIDE_CONFIGS[side] : null;

        return `
          <li class="player-item slide-in-up" data-index="${i}" style="animation-duration: 0.3s;">
            <span class="player-number">${i + 1}.</span>
            <span class="player-name text-truncate" title="${name}" style="text-align: left; flex: 1;">${name}</span>
            
            <label class="side-toggle" data-index="${i}" style="display: flex; align-items: center; gap: 6px; cursor: pointer; margin: 0 8px;">
              <span style="font-size: 0.75rem; color: var(--text-secondary);">Pool:</span>
              <div class="pool-badge" style="
                min-width: 28px; 
                height: 28px; 
                border-radius: 6px; 
                background: ${
                  sideConfig ? sideConfig.bgColor : "var(--bg-tertiary)"
                }; 
                border: 1px solid ${
                  sideConfig ? sideConfig.color : "var(--border-color)"
                };
                color: ${sideConfig ? sideConfig.color : "var(--text-muted)"};
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 0.85rem;
                transition: all 0.2s;
              ">
                ${side || "-"}
              </div>
            </label>
            
            <button class="player-remove" data-index="${i}">×</button>
          </li>
        `;
      })
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
    const bracketCountSelect = container.querySelector("#bracketCount");

    if (!previewEl || !previewContent) return;

    if (tempTeams.length >= 2) {
      previewEl.style.display = "block";
      const isMultiMode = dualModeToggle?.checked || false;
      const sharedFinal = sharedFinalToggle?.checked ?? true;
      const bracketCount = isMultiMode
        ? parseInt(bracketCountSelect?.value || "2")
        : 1;

      if (isMultiMode && bracketCount > 1) {
        // Use multi-bracket preview
        previewContent.innerHTML = renderMultiPreview(
          tempTeams.length,
          bracketCount,
          sharedFinal
        );
      } else {
        // Single bracket preview
        previewContent.innerHTML = this.renderBracketPreview(
          tempTeams,
          false,
          true
        );
      }
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
    const modeToggle = container.querySelector("#bracketModeToggle");

    // Mode toggle (Teams vs Players)
    if (modeToggle) {
      addListener(modeToggle, "change", () => {
        bracketMode = modeToggle.checked ? "players" : "teams";
        localStorage.setItem("bracket_mode", bracketMode);
        this.renderEmptyState(container);
      });
    }

    // Add team
    const addTeam = () => {
      const name = teamInput.value.trim();

      if (!name) return;

      // Check for duplicate (using getTeamName for object comparison)
      if (
        tempTeams.some(
          (t) => getTeamName(t).toLowerCase() === name.toLowerCase()
        )
      ) {
        showToast("Team already exists!", "error");
        return;
      }

      if (tempTeams.length >= 32) {
        showToast("Maximum 32 teams allowed", "error");
        return;
      }

      tempTeams.push({ name, side: null });
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
              if (
                tempTeams.some(
                  (t) => getTeamName(t).toLowerCase() === name.toLowerCase()
                )
              )
                return;
              if (tempTeams.length >= 32) return;

              tempTeams.push({ name, side: null });
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

    // Remove team and toggle side (event delegation)
    const teamsList = container.querySelector("#bracketTeamsList");
    if (teamsList) {
      addListener(teamsList, "click", (e) => {
        // Remove button
        if (e.target.classList.contains("player-remove")) {
          const index = parseInt(e.target.dataset.index);
          const removed = tempTeams.splice(index, 1)[0];
          saveTeams();
          this.renderEmptyState(container);
          showToast(`${getTeamName(removed)} removed`);
          return;
        }

        // Side toggle (cycle through pools based on bracket count)
        const sideToggle = e.target.closest(".side-toggle");
        if (sideToggle) {
          const index = parseInt(sideToggle.dataset.index);
          const team = tempTeams[index];

          // Get available pools based on bracket count
          const bracketCount = parseInt(
            localStorage.getItem("bracket_count") || "2"
          );
          const pools = ["A", "B", "C", "D", "E", "F"].slice(0, bracketCount);

          // Cycle through: null -> A -> B -> ... -> null
          if (team.side === null) {
            team.side = pools[0];
          } else {
            const currentIndex = pools.indexOf(team.side);
            if (currentIndex >= 0 && currentIndex < pools.length - 1) {
              team.side = pools[currentIndex + 1];
            } else {
              team.side = null;
            }
          }

          saveTeams();
          this.renderEmptyState(container);
          this.updatePreview(container);
        }
      });
    }

    // Toggle show all teams
    const toggleBtn = container.querySelector("#bracketToggleTeamsBtn");
    if (toggleBtn) {
      // Logic to show/hide button based on count
      const MIN_TEAMS_FOR_EXPAND = 10;
      if (tempTeams.length > MIN_TEAMS_FOR_EXPAND) {
        toggleBtn.style.display = "block";
        toggleBtn.innerHTML = this.listExpanded
          ? "Show Less ▲"
          : `Show All (${tempTeams.length}) ▼`;
      } else {
        toggleBtn.style.display = "none";
      }

      addListener(toggleBtn, "click", () => {
        const list = container.querySelector("#bracketTeamsList");

        this.listExpanded = !this.listExpanded;

        if (this.listExpanded) {
          list.style.setProperty("max-height", "2000px", "important");
          toggleBtn.innerHTML = "Show Less ▲";
        } else {
          list.style.setProperty("max-height", "400px", "important");
          toggleBtn.innerHTML = `Show All (${tempTeams.length}) ▼`;
        }
      });
    }

    // Dual mode (Pool Play) toggle
    addListener(dualModeToggle, "change", () => {
      const poolSettingsSection = container.querySelector(
        "#poolSettingsSection"
      );
      localStorage.setItem(
        "bracket_dual_mode",
        dualModeToggle.checked ? "true" : "false"
      );
      if (poolSettingsSection) {
        poolSettingsSection.style.display = dualModeToggle.checked
          ? "flex"
          : "none";
      }
      this.updatePreview(container);
    });

    // Bracket count dropdown
    const bracketCountSelect = container.querySelector("#bracketCount");
    if (bracketCountSelect) {
      addListener(bracketCountSelect, "change", () => {
        localStorage.setItem("bracket_count", bracketCountSelect.value);
        this.updatePreview(container);
      });
    }

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
          "Pool Assignment Explained",
          `<p><strong>How teams are distributed across pools:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li><strong>🎲 Random</strong> – Teams are shuffled randomly into pools</li>
            <li><strong>↔️ Alternate</strong> – Team 1→A, Team 2→B, Team 3→C, etc.</li>
            <li><strong>½ Split by Pool</strong> – Teams divided evenly (first third to A, second to B, etc.)</li>
            <li><strong>✋ Manual</strong> – You set each team's pool using the A/B/C/D/E/F toggle on each team</li>
          </ul>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 10px;">💡 With <strong>Pair Finals</strong> enabled, each pair of pools (A vs B, C vs D) has its own final match!</p>`
        );
      });
    }

    // Main Help button
    const bracketHelpBtn = container.querySelector("#bracketHelpBtn");
    if (bracketHelpBtn) {
      addListener(bracketHelpBtn, "click", (e) => {
        e.preventDefault();
        showInfoModal(
          "Bracket Tournament Guide",
          `<div style="text-align: left;">
            <h4 style="margin-bottom: 10px; color: var(--accent);">🏆 How It Works</h4>
            <p>Create a single-elimination bracket where teams compete head-to-head. Losers are eliminated, winners advance until one champion remains.</p>
            
            <hr style="margin: 12px 0; border-color: var(--border-color);">
            
            <h4 style="margin-bottom: 10px; color: var(--accent);">📋 Setup Tips</h4>
            <ul style="padding-left: 20px; margin-bottom: 12px;">
              <li><strong>Perfect sizes:</strong> 4, 8, 16, or 32 teams</li>
              <li><strong>Other sizes:</strong> "Byes" are assigned automatically</li>
              <li><strong>A/B Toggle:</strong> Pre-assign teams to bracket sides</li>
            </ul>
            
            <h4 style="margin-bottom: 10px; color: var(--warning);">🔀 A/B Side Toggle</h4>
            <p>Click the toggle next to each team to assign them:</p>
            <ul style="padding-left: 20px; margin-bottom: 12px;">
              <li><strong>A (Blue):</strong> Left side of bracket</li>
              <li><strong>B (Orange):</strong> Right side of bracket</li>
              <li><strong>Gray:</strong> Unassigned (auto-distributed)</li>
            </ul>
            
            <hr style="margin: 12px 0; border-color: var(--border-color);">
            
            <h4 style="margin-bottom: 10px; color: var(--success);">⚡ Dual Brackets Mode</h4>
            <p>Enable "Dual Brackets" for two separate brackets (A vs B) with a shared Grand Final where the winners of each side face off!</p>
          </div>`
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

      const isDualMode = dualModeToggle?.checked || false;
      const sharedFinal = sharedFinalToggle?.checked ?? true;

      try {
        if (isDualMode) {
          initDualBracketTournament(tempTeams, sharedFinal);
          showToast(
            `Dual bracket created with ${tempTeams.length} teams`,
            "success"
          );
          this.renderDualBracket(container);
        } else {
          initBracketTournament(tempTeams);
          showToast(
            `Bracket created with ${tempTeams.length} teams`,
            "success"
          );
          this.renderBracket(container);
        }
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
   * Now uses reusable bracketComponents module
   */
  renderDualBracketPreview(teamNames, sharedFinal = true) {
    // Use the reusable component with default A/B configuration
    return renderDualPreview(
      teamNames.length,
      SIDE_CONFIGS.A,
      SIDE_CONFIGS.B,
      sharedFinal
    );
  },

  /**
   * Render a mini bracket visualization (reversed for mirrored display)
   * Shows F → SF → QF flowing toward center (left to right)
   */
  renderMiniBracketReversed(count, color, showWinner = true) {
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

    // Winner first (leftmost for reversed bracket) - only if showWinner is true
    if (showWinner) {
      html += `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
          <div style="font-size: 1.2rem;">🏆</div>
          <div style="font-size: 0.7rem; color: var(--success); font-weight: 600;">Winner!</div>
        </div>
        <div style="color: var(--text-muted); font-size: 0.8rem;">←</div>
      `;
    }

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
              <div style="width: 70px; height: 36px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 4px; position: relative;">
                <div style="position: absolute; left: 4px; right: 4px; top: 50%; height: 1px; background: var(--border-color);"></div>
              </div>
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
              <div style="width: 70px; height: 36px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 4px; position: relative;">
                <div style="position: absolute; left: 4px; right: 4px; top: 50%; height: 1px; background: var(--border-color);"></div>
              </div>
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
        <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
          <div style="font-size: 1.2rem;">🏆</div>
          <div style="font-size: 0.7rem; color: var(--success); font-weight: 600;">Winner!</div>
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
   * Render dual bracket visualization (Side A left, Grand Final center, Side B right).
   */
  renderDualBracket(container) {
    const tournament = state.tournament;
    if (!tournament || tournament.format !== "dual") {
      this.renderBracket(container);
      return;
    }

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
      <div class="bracket-header">
        <h2>Dual Bracket Tournament</h2>
        <div class="bracket-actions">
          <button class="btn btn-secondary btn-sm" id="printBracketBtn">Print</button>
          <button class="btn btn-danger btn-sm" id="clearBracketBtn">Clear</button>
        </div>
      </div>
      
      <div class="dual-bracket-layout" style="display: flex; gap: 20px; align-items: flex-start; justify-content: center; flex-wrap: wrap; padding: 20px 0;">
        
        <!-- Side A Bracket (Left) -->
        <div class="bracket-side side-a" style="flex: 1; border: 2px solid var(--accent); border-radius: 12px; padding: 16px; background: rgba(59, 130, 246, 0.05);">
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
                <div class="round-header">${getRoundName(
                  i + 1,
                  numRoundsA
                )}</div>
                <div class="round-matches">
                  ${roundMatches
                    .map((match) => this.renderMatch(match))
                    .join("")}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        
        <!-- Grand Final (Center) -->
        <div class="bracket-final" style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
          <div style="font-size: 0.85rem; color: var(--success); font-weight: 700; margin-bottom: 8px;">🏆 GRAND FINAL 🏆</div>
          ${
            grandFinal
              ? this.renderMatch(grandFinal)
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
        <div class="bracket-side side-b" style="flex: 1; border: 2px solid var(--warning); border-radius: 12px; padding: 16px; background: rgba(245, 158, 11, 0.05);">
          <div style="text-align: center; margin-bottom: 16px;">
            <span style="font-weight: 700; font-size: 1.1rem; color: var(--warning);">Side B</span>
            <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 8px;">(${
              tournament.teamsB?.length || 0
            } teams)</span>
          </div>
          <div class="bracket-container" style="display: flex; gap: 12px; overflow-x: auto; flex-direction: row-reverse;">
            ${roundsB
              .map(
                (roundMatches, i) => `
              <div class="bracket-round" data-round="${i + 1}">
                <div class="round-header">${getRoundName(
                  i + 1,
                  numRoundsB
                )}</div>
                <div class="round-matches">
                  ${roundMatches
                    .map((match) => this.renderMatch(match))
                    .join("")}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        
      </div>
    `;

    // Event delegation for match clicks
    const dualLayout = container.querySelector(".dual-bracket-layout");
    addListener(dualLayout, "click", (e) => {
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
