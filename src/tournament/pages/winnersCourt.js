/**
 * Winners Court Page Module
 * Skill-based court placement for balanced 2v2 matches.
 * Shown at /tournament/#/winners-court
 */

import { state, saveState } from "../state.js";
import { navigate } from "../router.js";
import {
  initWinnersCourt,
  getWinnersCourtState,
  clearWinnersCourt,
  createTeams,
  recordCourtResult,
  nextRound,
} from "../winnersCourtLogic.js";
import { showConfirmModal, showInputModal, showInfoModal } from "../modals.js";
import { showToast } from "../../shared/utils.js";
import { setupCustomSelects } from "../ui/customSelect.js";
import { getHistoryTemplate } from "../ui/historyTemplate.js";
import { initHistory, renderHistory } from "../history.js";

// Track attached listeners for cleanup
const listeners = [];

function addListener(el, event, handler) {
  if (!el) return;
  el.addEventListener(event, handler);
  listeners.push({ el, event, handler });
}

/**
 * Winners Court page module.
 */
export const winnersCourtPage = {
  tempPlayers: [],
  splitSidesEnabled: false,
  listExpanded: false,

  /**
   * Mount the winners court page.
   */
  mount(container, params) {
    console.log("[WinnersCourtPage] Mounting...");

    // 1. Load Setup State (Players)
    try {
      const saved = localStorage.getItem("wc_setup_players");
      if (saved) {
        this.tempPlayers = JSON.parse(saved);
      }
      // Load split sides preference
      this.splitSidesEnabled =
        localStorage.getItem("wc_split_sides") === "true";
    } catch (e) {
      console.error("Failed to load WC setup players", e);
    }

    // 2. Load Active Game State
    // (This is redundant if accessed via getWinnersCourtState directly,
    // but ensures we are aware of it)
    const wcState = getWinnersCourtState();

    // 3. Render initial structure
    this.render(container);
  },

  // Temporary players array for the form
  tempPlayers: [],

  /**
   * Save setup state to persistent storage
   */
  saveSetup() {
    localStorage.setItem("wc_setup_players", JSON.stringify(this.tempPlayers));
  },

  /**
   * Show help modal.
   */
  showHelp() {
    const content = `
      <div style="font-size: 0.95rem; line-height: 1.6;">
        <p><strong>Winners Court (Americano Mexicano hybrid)</strong> is a fun, skill-based king of the hill format.</p>
        
        <h4 style="margin: 12px 0 6px; color: var(--accent);">How it works</h4>
        <ul style="padding-left: 20px; margin: 0;">
          <li><strong>Win match:</strong> Move UP one court (e.g. Court 2 → Court 1).</li>
          <li><strong>Lose match:</strong> Move DOWN one court (e.g. Court 1 → Court 2).</li>
          <li><strong>Top Court Winners</strong> stay on Court 1.</li>
          <li><strong>Bottom Court Losers</strong> stay on the last court.</li>
        </ul>

        <h4 style="margin: 12px 0 6px; color: var(--accent);">Twist Mode</h4>
        <p style="margin: 0;">If enabled, partners rotate every round so you play with different people on your court. Great for socializing!</p>

        <h4 style="margin: 12px 0 6px; color: var(--accent);">Tips</h4>
        <ul style="padding-left: 20px; margin: 0;">
          <li>Initial placement is based on the <strong>Skill Level</strong> you enter.</li>
          <li>Default skill is (-) which is treated as 0.</li>
        </ul>
      </div>
    `;
    showInfoModal("How to Play", content);
  },

  /**
   * Main Render Orchestrator
   */
  render(container) {
    container.innerHTML = `
      <div id="wcSetupContainer"></div>
      <div id="wcActiveContainer"></div>
    `;

    this.renderSetup(container.querySelector("#wcSetupContainer"));
    this.renderActiveGame(container.querySelector("#wcActiveContainer"));

    // Append History Section
    const historyContainer = document.createElement("div");
    historyContainer.innerHTML = getHistoryTemplate();
    container.appendChild(historyContainer);

    // Initialize History
    initHistory();
    renderHistory();
  },

  /**
   * Render setup form.
   */
  renderSetup(container) {
    if (!container) return;

    const wcState = getWinnersCourtState();
    const isGameActive = !!wcState;
    const maxCourts = Math.max(1, Math.floor(this.tempPlayers.length / 4));

    // If game is active, render a summarized/collapsed view or just the full view?
    // User requested "Show generated courts below", so let's keep full setup but maybe minimized.
    // For now, let's render the standard setup, but if active, hide the generate button or change text.

    container.innerHTML = `
      <div class="wc-setup ${isGameActive ? "compact" : ""}">
        <div class="wc-header-row" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <h2 style="margin: 0;">Winners Court Setup</h2>
          <button class="help-icon" id="wcHelpBtn" style="width: 28px; height: 28px; font-size: 1rem; font-weight: bold;">?</button>
        </div>
        
        ${
          isGameActive
            ? `<p class="wc-description" style="margin-bottom: 12px; color: var(--success);">
            <span style="font-weight: bold;">Game in Progress</span> • You can modify players here for the next game.
           </p>`
            : `<p class="wc-description">Enter players with skill ratings (1-10) to create balanced court assignments.</p>`
        }
        
        <div class="wc-form">
          <!-- Players Section -->
          <div class="players-section" style="${
            isGameActive ? "border-color: var(--accent);" : ""
          }">
            <div class="section-header">
              <h3>Players <span id="wcPlayerCount">(${
                this.tempPlayers.length
              })</span></h3>
              <div class="player-actions">
                <button class="btn btn-sm btn-secondary" id="importBtn">Import...</button>
                <button class="btn btn-sm btn-danger" id="clearAllBtn">Clear All</button>
              </div>
            </div>
            
            <div class="player-input-row" style="display: flex; gap: 12px; align-items: flex-end;">
              <div class="input-group" style="flex: 1;">
                <label for="wcNameInput" style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">Name</label>
                <input type="text" id="wcNameInput" class="form-input" placeholder="Enter name..." />
              </div>
              <div class="input-group" style="width: 70px;">
                <label for="wcSkillInput" style="display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">
                  Skill 
                  <span id="wcSkillHelp" style="cursor: pointer; opacity: 0.7; font-size: 0.65rem; background: var(--bg-tertiary); border-radius: 50%; width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center;">?</span>
                </label>
                <select id="wcSkillInput" class="form-select wc-skill-select compact-select">
                  <option value="0" selected>-</option>
                  ${Array.from(
                    { length: 10 },
                    (_, i) => `<option value="${i + 1}">${i + 1}</option>`
                  ).join("")}
                </select>
              </div>
              <button class="btn btn-primary" id="addPlayerBtn" style="height: 44px;">Add</button>
            </div>
            
            <ul class="player-list" id="wcPlayersList" style="max-height: ${
              this.listExpanded ? "2000px" : isGameActive ? "200px" : "280px"
            }; overflow-y: auto; transition: max-height 0.3s ease;">
              ${this.renderPlayerItems()}
            </ul>
            
            ${
              this.tempPlayers.length > 5
                ? `
              <button class="btn btn-sm btn-secondary" id="wcTogglePlayersBtn" data-expanded="${
                this.listExpanded
              }" style="width: 100%; margin-top: 8px;">
                ${
                  this.listExpanded
                    ? "Show Less"
                    : `Show All (${this.tempPlayers.length})`
                }
              </button>
            `
                : ""
            }
            
            ${this.renderSideSummary()}
            
            <p class="players-hint" id="wcPlayersHint">${this.getPlayersHint()}</p>
          </div>
          
          <!-- Options Section -->
          <div class="wc-options">
            ${
              !this.splitSidesEnabled
                ? `
            <div class="wc-option">
              <label for="wcCourts">Courts</label>
              <select id="wcCourts" class="form-input">
                ${Array.from({ length: maxCourts + 1 }, (_, i) => i + 1)
                  .filter((n) => n <= maxCourts || n === 1)
                  .map(
                    (n) =>
                      `<option value="${n}" ${
                        n === maxCourts ? "selected" : ""
                      }>${n} Court${n > 1 ? "s" : ""} (${
                        n * 4
                      } players)</option>`
                  )
                  .join("")}
              </select>
            </div>
            `
                : ""
            }
            
            <label class="wc-toggle">
              <input type="checkbox" id="wcTwist" />
              <span class="slider round"></span>
              <span class="toggle-label">Twist Mode</span>
            </label>
            
            <label class="wc-toggle">
              <input type="checkbox" id="wcSplitSides" ${
                this.splitSidesEnabled ? "checked" : ""
              } />
              <span class="slider round"></span>
              <span class="toggle-label">Split Sides (A/B)</span>
            </label>
            
            ${
              this.splitSidesEnabled
                ? `
              <button class="btn btn-sm btn-secondary" id="wcAutoAssignBtn" style="white-space: nowrap;">
                Auto-Assign by Skill
              </button>
            `
                : ""
            }
          </div>
          
          ${
            !isGameActive
              ? `<button class="btn btn-primary btn-lg" id="generateWcBtn" ${
                  this.tempPlayers.length < 4 ? "disabled" : ""
                }>Generate Winners Court</button>`
              : `<div style="text-align: center; margin-top: 10px;">
               <button class="btn btn-secondary btn-sm" id="restartWcBtn">Restart / New Game</button>
             </div>`
          }
        </div>
      </div>
    `;

    this.attachSetupListeners(container);
    setupCustomSelects();
  },

  /**
   * Render player list items.
   */
  renderPlayerItems() {
    if (!this.splitSidesEnabled) {
      // Simple list without side grouping
      return this.tempPlayers
        .map((player, i) => this.renderPlayerItem(player, i))
        .join("");
    }

    // Group by side with visual separator
    const sideA = this.tempPlayers
      .map((p, i) => ({ ...p, originalIndex: i }))
      .filter((p) => p.side !== "B");
    const sideB = this.tempPlayers
      .map((p, i) => ({ ...p, originalIndex: i }))
      .filter((p) => p.side === "B");

    let html = "";

    if (sideA.length > 0) {
      html += `<li class="side-header" style="padding: 4px 8px; background: rgba(59, 130, 246, 0.1); color: var(--accent); font-size: 0.75rem; font-weight: 600; border-radius: 4px; margin-bottom: 4px;">Side A (${sideA.length})</li>`;
      html += sideA
        .map((p) => this.renderPlayerItem(p, p.originalIndex))
        .join("");
    }

    if (sideB.length > 0) {
      html += `<li class="side-header" style="padding: 4px 8px; background: rgba(245, 158, 11, 0.1); color: var(--warning); font-size: 0.75rem; font-weight: 600; border-radius: 4px; margin-top: 8px; margin-bottom: 4px;">Side B (${sideB.length})</li>`;
      html += sideB
        .map((p) => this.renderPlayerItem(p, p.originalIndex))
        .join("");
    }

    return html;
  },

  /**
   * Render a single player item.
   */
  renderPlayerItem(player, i) {
    return `
      <li class="player-item" data-index="${i}">
        <span class="player-number">${i + 1}.</span>
        <span class="player-name">${player.name}</span>
        ${
          this.splitSidesEnabled
            ? `
          <label class="side-toggle" data-index="${i}" style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 0.75rem;">
            <span style="color: ${
              player.side !== "B" ? "var(--accent)" : "var(--text-muted)"
            }; font-weight: ${player.side !== "B" ? "600" : "400"};">A</span>
            <div class="toggle-track" style="width: 28px; height: 16px; background: ${
              player.side === "B" ? "var(--warning)" : "var(--accent)"
            }; border-radius: 8px; position: relative;">
              <div class="toggle-thumb" style="width: 12px; height: 12px; background: white; border-radius: 50%; position: absolute; top: 2px; left: ${
                player.side === "B" ? "14px" : "2px"
              };"></div>
            </div>
            <span style="color: ${
              player.side === "B" ? "var(--warning)" : "var(--text-muted)"
            }; font-weight: ${player.side === "B" ? "600" : "400"};">B</span>
          </label>
        `
            : ""
        }
        <span class="player-skill">${
          player.skill === 0 ? "-" : player.skill
        }</span>
        <button class="player-remove" data-index="${i}">×</button>
      </li>
    `;
  },

  /**
   * Render side summary showing player counts and names per side.
   */
  renderSideSummary() {
    if (!this.splitSidesEnabled || this.tempPlayers.length === 0) return "";

    const sideA = this.tempPlayers.filter((p) => p.side !== "B");
    const sideB = this.tempPlayers.filter((p) => p.side === "B");

    const renderSideList = (players, sideName, color) => {
      if (players.length === 0) return "";
      const courts = Math.floor(players.length / 4);
      const extra = players.length % 4;
      return `
        <div style="flex: 1; min-width: 120px;">
          <div style="font-weight: 600; color: ${color}; margin-bottom: 4px;">
            ${sideName}: ${players.length} player${
        players.length !== 1 ? "s" : ""
      }
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px;">
            ${courts} court${courts !== 1 ? "s" : ""}${
        extra > 0 ? ` (+${extra} bench)` : ""
      }
          </div>
          <ul style="margin: 0; padding-left: 16px; font-size: 0.8rem; color: var(--text-secondary);">
            ${players
              .map(
                (p) =>
                  `<li>${p.name} <span style="opacity: 0.6;">(${
                    p.skill === 0 ? "-" : p.skill
                  })</span></li>`
              )
              .join("")}
          </ul>
        </div>
      `;
    };

    return `
      <div style="display: flex; gap: 16px; margin-top: 12px; padding: 10px; background: var(--bg-tertiary); border-radius: var(--radius-sm); flex-wrap: wrap;">
        ${renderSideList(sideA, "Side A", "var(--accent)")}
        ${renderSideList(sideB, "Side B", "var(--warning)")}
      </div>
    `;
  },

  /**
   * Get players hint text.
   */
  getPlayersHint() {
    const count = this.tempPlayers.length;

    if (count < 4) {
      return `Add at least ${4 - count} more player${4 - count > 1 ? "s" : ""}`;
    }

    const courts = Math.floor(count / 4);
    const extra = count % 4;

    if (extra === 0) {
      return `<span style="color: var(--success)">${count} players ready (${courts} court${
        courts > 1 ? "s" : ""
      })</span>`;
    } else {
      const needed = 4 - extra;
      return `<span style="color: var(--warning)">${count} ready (${courts} court${
        courts > 1 ? "s" : ""
      }). Need ${needed} more for ${courts + 1} courts!</span>`;
    }
  },

  /**
   * Attach event listeners for setup form.
   */
  attachSetupListeners(container) {
    const nameInput = container.querySelector("#wcNameInput");
    const skillSelect = container.querySelector("#wcSkillInput");
    const addBtn = container.querySelector("#addPlayerBtn");
    const importBtn = container.querySelector("#importBtn");
    const clearBtn = container.querySelector("#clearAllBtn");
    const generateBtn = container.querySelector("#generateWcBtn");
    const restartBtn = container.querySelector("#restartWcBtn");
    const helpBtn = container.querySelector("#wcHelpBtn");

    if (helpBtn) {
      addListener(helpBtn, "click", () => this.showHelp());
    }

    // Split sides toggle
    const splitSidesToggle = container.querySelector("#wcSplitSides");
    if (splitSidesToggle) {
      addListener(splitSidesToggle, "change", () => {
        this.splitSidesEnabled = splitSidesToggle.checked;
        localStorage.setItem(
          "wc_split_sides",
          this.splitSidesEnabled ? "true" : "false"
        );
        this.renderSetup(container);
      });
    }

    // Auto-assign by skill
    const autoAssignBtn = container.querySelector("#wcAutoAssignBtn");
    if (autoAssignBtn) {
      addListener(autoAssignBtn, "click", () => {
        // First pass: assign known skills, collect unknown
        const unknownIndices = [];
        this.tempPlayers.forEach((player, i) => {
          if (player.skill === 0) {
            unknownIndices.push(i);
            player.side = null; // Reset for counting
          } else {
            player.side = player.skill >= 5 ? "A" : "B";
          }
        });

        // Count current sides (only known players)
        let countA = this.tempPlayers.filter((p) => p.side === "A").length;
        let countB = this.tempPlayers.filter((p) => p.side === "B").length;

        // Shuffle unknown players for randomization
        for (let i = unknownIndices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [unknownIndices[i], unknownIndices[j]] = [
            unknownIndices[j],
            unknownIndices[i],
          ];
        }

        // Second pass: assign unknown players to balance sides
        unknownIndices.forEach((idx) => {
          if (countA <= countB) {
            this.tempPlayers[idx].side = "A";
            countA++;
          } else {
            this.tempPlayers[idx].side = "B";
            countB++;
          }
        });

        this.saveSetup();
        this.renderSetup(container);

        showToast(
          `Auto-assigned: Side A (${countA}) / Side B (${countB})`,
          "success"
        );
      });
    }

    // Skill help button
    const skillHelpBtn = container.querySelector("#wcSkillHelp");
    if (skillHelpBtn) {
      addListener(skillHelpBtn, "click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showInfoModal(
          "About Skill Levels",
          `<p><strong>Skill levels are optional!</strong></p>
          <p>Use them to help create balanced teams for the <strong>first round</strong>:</p>
          <ul style="margin: 12px 0; padding-left: 20px;">
            <li><strong>1-3:</strong> Beginner</li>
            <li><strong>4-6:</strong> Intermediate</li>
            <li><strong>7-9:</strong> Advanced</li>
            <li><strong>10:</strong> Pro</li>
            <li><strong>-:</strong> Unknown/Skip</li>
          </ul>
          <p style="color: var(--text-muted); font-size: 0.9rem;">After round 1, matchups are based on wins/losses only—skill ratings won't affect later rounds.</p>`
        );
      });
    }

    // Import players
    if (importBtn) {
      addListener(importBtn, "click", () => {
        showInputModal(
          "Import Players",
          "John\nJane : 8\nBob",
          (text) => {
            const lines = text.split("\n");
            let added = 0;
            lines.forEach((line) => {
              const parts = line.split(":");
              const name = parts[0].trim();
              if (!name) return;

              let skill = 0; // Default to 0 ("-")
              if (parts.length > 1) {
                const val = parseInt(parts[1].trim());
                if (!isNaN(val) && val >= 1 && val <= 10) skill = val;
              }

              this.tempPlayers.push({ name, skill });
              added++;
            });

            if (added > 0) {
              this.saveSetup();
              this.renderSetup(container);
              showToast(`Imported ${added} players`, "success");
            }
          },
          "Enter names, one per line. Optionally add skill level with : # (e.g. 'John : 8'). Default skill is -.",
          "textarea"
        );
      });
    }

    // Add player
    const addPlayer = () => {
      const name = nameInput.value.trim();
      const skill = parseInt(skillSelect.value);

      // Check for duplicate name
      const exists = this.tempPlayers.some(
        (p) => p.name.toLowerCase() === name.toLowerCase()
      );
      if (exists) {
        showToast("Player already exists!", "error");
        return;
      }

      if (name && skill >= 0 && skill <= 10) {
        // Auto-assign side based on skill when split sides is enabled
        const side =
          this.splitSidesEnabled && skill > 0 && skill < 5 ? "B" : "A";
        this.tempPlayers.push({ name, skill, side });
        this.saveSetup();
        nameInput.value = "";
        this.renderSetup(container);
        container.querySelector("#wcNameInput").focus();

        // Show notification
        const skillText = skill === 0 ? "-" : skill;
        const sideText = this.splitSidesEnabled ? ` → Side ${side}` : "";
        showToast(`${name} (${skillText}) added${sideText}`, "success");
      }
    };

    addListener(addBtn, "click", addPlayer);
    addListener(nameInput, "keypress", (e) => {
      if (e.key === "Enter") addPlayer();
    });

    // Clear all
    addListener(clearBtn, "click", () => {
      this.tempPlayers = [];
      this.saveSetup();
      this.renderSetup(container);
    });

    // Side toggle (event delegation)
    addListener(container.querySelector("#wcPlayersList"), "click", (e) => {
      const toggle = e.target.closest(".side-toggle");
      if (toggle) {
        const index = parseInt(toggle.dataset.index);
        // Toggle between A and B
        this.tempPlayers[index].side =
          this.tempPlayers[index].side === "B" ? "A" : "B";
        this.saveSetup();

        // Update only the list items and summary, not the whole setup
        const list = container.querySelector("#wcPlayersList");
        const sideSummary = container.parentElement.querySelector(".wc-setup");
        if (list) {
          list.innerHTML = this.renderPlayerItems();
        }
        // Re-render side summary by updating the setup
        this.renderSetup(container);
      }
    });

    // Remove player (event delegation)
    addListener(container.querySelector("#wcPlayersList"), "click", (e) => {
      if (e.target.classList.contains("player-remove")) {
        const index = parseInt(e.target.dataset.index);
        this.tempPlayers.splice(index, 1);
        this.saveSetup();
        this.renderSetup(container);
      }
    });

    // Toggle show all players
    const toggleBtn = container.querySelector("#wcTogglePlayersBtn");
    if (toggleBtn) {
      addListener(toggleBtn, "click", () => {
        const list = container.querySelector("#wcPlayersList");

        // Toggle the expanded state
        this.listExpanded = !this.listExpanded;

        if (this.listExpanded) {
          // Use scrollHeight for smooth animation
          list.style.maxHeight = list.scrollHeight + "px";
          toggleBtn.textContent = "Show Less";
          toggleBtn.dataset.expanded = "true";
        } else {
          list.style.maxHeight = "280px";
          toggleBtn.textContent = `Show All (${this.tempPlayers.length})`;
          toggleBtn.dataset.expanded = "false";
        }
      });
    }

    // Generate
    if (generateBtn) {
      addListener(generateBtn, "click", () => {
        // Find Main Container (parent of setup container)
        // We need to re-render the whole thing to show the active game
        // Since 'render' expects the main container passed to 'mount'
        // We can traverse up or just re-render 'renderActiveGame' and 'renderSetup'
        this.handleGenerate(container.parentElement);
      });
    }

    // Restart
    if (restartBtn) {
      addListener(restartBtn, "click", () => {
        showConfirmModal(
          "Start New Game?",
          "Current progress will be lost.",
          "Start New",
          () => {
            clearWinnersCourt();
            // Re-render everything
            const mainContainer = container.parentElement;
            this.render(mainContainer);
          }
        );
      });
    }
  },

  /**
   * Handle generate button click.
   */
  handleGenerate(mainContainer) {
    const twist = document.getElementById("wcTwist").checked;

    // Split players by side
    const sideA = this.tempPlayers.filter((p) => p.side !== "B");
    const sideB = this.tempPlayers.filter((p) => p.side === "B");

    const playersBySide = { A: sideA, B: sideB };

    // Calculate court counts per side
    const courtCountA = Math.floor(sideA.length / 4);
    const courtCountB = Math.floor(sideB.length / 4);
    const courtCountBySide = { A: courtCountA, B: courtCountB };

    // Validate - need at least one side with 4+ players
    if (courtCountA === 0 && courtCountB === 0) {
      showToast("Need at least 4 players on a side to start", "error");
      return;
    }

    try {
      initWinnersCourt(playersBySide, courtCountBySide, twist);

      const totalCourts = courtCountA + courtCountB;
      showToast(
        `Winners Court created with ${totalCourts} court(s)`,
        "success"
      );

      // Re-render full view to show Game + minimized setup
      this.render(mainContainer);
    } catch (e) {
      showToast(e.message, "error");
    }
  },

  /**
   * Render active game view for all sides.
   */
  renderActiveGame(container) {
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
          .map((side) => this.renderSide(side, sides[side], twist))
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
              this.render(container.parentElement);
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
            this.renderActiveGame(container);
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
            this.handleTeamWin(container, side, courtId, 1);
          });
        }
        if (team2) {
          addListener(team2, "click", () => {
            const courtId = parseInt(courtEl.dataset.courtId);
            this.handleTeamWin(container, side, courtId, 2);
          });
        }
      });
    });
  },

  /**
   * Render a single side's courts and controls.
   */
  renderSide(side, sideState, twist) {
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
          ${courts
            .map((court) => this.renderCourt(court, twist, round))
            .join("")}
        </div>
      </div>
    `;
  },

  /**
   * Render history of previous rounds (for all sides).
   */
  renderHistory(container) {
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
                    this.renderCourt(court, false, roundData.round, true)
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
  },

  /**
   * Render a single court.
   */
  renderCourt(court, twist, round, readOnly = false) {
    const teams = createTeams(court.players, twist, round);
    const isComplete = court.winner != null;

    // If read-only, remove click handlers visually (pointer-events)
    const interactiveClass = !readOnly && !isComplete ? "interactive" : "";

    return `
      <div class="wc-court ${
        isComplete ? "complete" : ""
      } ${interactiveClass}" data-court-id="${court.id}" style="${
      readOnly ? "pointer-events: none;" : ""
    }">
        <div class="wc-court-header">Court ${court.id}</div>
        <div class="wc-court-body-horizontal">
          <div class="wc-team-horizontal wc-team1 ${
            court.winner === 1 ? "winner" : court.winner === 2 ? "loser" : ""
          }">
            <div class="wc-player-name">${teams?.team1[0]?.name || "?"}</div>
            <div class="wc-player-name">${teams?.team1[1]?.name || "?"}</div>
          </div>
          <div class="wc-vs-horizontal">VS</div>
          <div class="wc-team-horizontal wc-team2 ${
            court.winner === 2 ? "winner" : court.winner === 1 ? "loser" : ""
          }">
            <div class="wc-player-name">${teams?.team2[0]?.name || "?"}</div>
            <div class="wc-player-name">${teams?.team2[1]?.name || "?"}</div>
          </div>
        </div>
        ${
          court.players.length > 4
            ? `<div class="wc-bench">
               <strong>Bench:</strong> ${court.players
                 .slice(4)
                 .map((p) => p.name)
                 .join(", ")}
             </div>`
            : ""
        }
      </div>
    `;
  },

  /**
   * Handle team win click for a specific side.
   */
  handleTeamWin(container, side, courtId, winningTeam) {
    recordCourtResult(side, courtId, winningTeam, 0, 0);
    this.renderActiveGame(container);
  },

  /**
   * Unmount the winners court page.
   */
  unmount() {
    console.log("[WinnersCourtPage] Unmounting...");
    listeners.forEach(({ el, event, handler }) => {
      el.removeEventListener(event, handler);
    });
    listeners.length = 0;
  },
};
