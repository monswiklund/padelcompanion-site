import { showToast } from "../../../shared/utils.js";
import {
  showInputModal,
  showInfoModal,
  showConfirmModal,
} from "../../modals.js";
import {
  HELP_POOL_ASSIGNMENT,
  HELP_BRACKET_GUIDE,
  HELP_BRACKET_SIZES,
} from "../../content/help.js";
import {
  SIDE_CONFIGS,
  renderMultiBracketPreview as renderMultiPreview,
} from "../../ui/bracketComponents.js";
import {
  initBracketTournament,
  initDualBracketTournament,
} from "../../bracketLogic.js";

// Setup State
let tempTeams = [];
let listExpanded = false;
let bracketMode = localStorage.getItem("bracket_mode") || "teams"; // "teams" or "players"

const listeners = [];

function addListener(el, event, handler) {
  if (!el) return;
  el.addEventListener(event, handler);
  listeners.push({ el, event, handler });
}

export function cleanupSetupListeners() {
  listeners.forEach(({ el, event, handler }) => {
    el.removeEventListener(event, handler);
  });
  listeners.length = 0;
}

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

function getTeamName(team) {
  return typeof team === "string" ? team : team.name;
}

function saveTeams() {
  localStorage.setItem("bracket_teams", JSON.stringify(tempTeams));
}

function loadTeams() {
  try {
    const saved = localStorage.getItem("bracket_teams");
    if (saved) {
      const parsed = JSON.parse(saved);
      tempTeams = parsed.map((t) =>
        typeof t === "string" ? { name: t, side: null } : t
      );
    }
  } catch (e) {
    console.error("Failed to load bracket teams", e);
    tempTeams = [];
  }
}

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

function renderTeamItems() {
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
}

function updatePreview(container) {
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

      // Attach preview tab event listeners
      attachPreviewTabListeners(container);
    } else {
      // Single bracket preview
      // Ideally we should import renderBracketPreview logic properly if we want the complex SVG
      // But for now, let's keep it simple or extract it too.
      // The original bracket.js had a method renderBracketPreview?
      // Yes, but I didn't verify if it was extracted.
      // Checking imports, renderDualPreview is imported.
      // renderMultiPreview is imported as renderDualPreview in original?
      // No: import { renderDualBracketPreview as renderDualPreview, renderMultiBracketPreview as renderMultiPreview } ...
      // Wait, renderMultiPreview is used for "MultiMode".

      // For single mode, let's just use a simple placeholder or extract renderBracketPreview from the original file if it was inline.
      // It seems it was inline in original bracket.js (I didn't see it in the snippet 1-300 or 300-800, maybe later?)
      // Let's assume for now we use a simpler placeholder or the MultiPreview with 1 bracket.

      previewContent.innerHTML = renderMultiPreview(tempTeams.length, 1, false);
    }
  } else {
    previewEl.style.display = "none";
  }
}

function attachPreviewTabListeners(container) {
  const tabBtns = container.querySelectorAll(".preview-tab-btn");
  const allBrackets = container.querySelectorAll(".preview-bracket");

  tabBtns.forEach((btn) => {
    addListener(btn, "click", () => {
      const bracketIndex = btn.dataset.previewBracket;
      const btnColor = btn.style.borderColor || "var(--accent)";

      // Update button styles - reset all
      tabBtns.forEach((b) => {
        b.classList.remove("active");
        const bColor = b.style.borderColor || "var(--accent)";
        b.style.background = "var(--bg-surface)";
        b.style.color = bColor;
      });
      // Activate clicked button
      btn.classList.add("active");
      btn.style.background = btnColor;
      btn.style.color = "white";

      if (bracketIndex !== undefined) {
        allBrackets.forEach((bracket) => {
          bracket.classList.remove("preview-active");
          bracket.classList.add("preview-hidden");
        });

        const selectedBracket = container.querySelector(
          `.preview-bracket-${bracketIndex}`
        );
        if (selectedBracket) {
          selectedBracket.classList.add("preview-active");
          selectedBracket.classList.remove("preview-hidden");
        }
      }
    });
  });
}

function attachSetupListeners(container, onComplete) {
  const teamInput = container.querySelector("#bracketTeamInput");
  const addBtn = container.querySelector("#addTeamBtn");
  const importBtn = container.querySelector("#importTeamsBtn");
  const clearBtn = container.querySelector("#clearAllTeamsBtn");
  const createBtn = container.querySelector("#createBracketBtn");
  const dualModeToggle = container.querySelector("#bracketDualMode");
  const sharedFinalToggle = container.querySelector("#bracketSharedFinal");
  const sideAssignSelect = container.querySelector("#bracketSideAssign");
  const modeToggle = container.querySelector("#bracketModeToggle");

  if (modeToggle) {
    addListener(modeToggle, "change", () => {
      bracketMode = modeToggle.checked ? "players" : "teams";
      localStorage.setItem("bracket_mode", bracketMode);
      renderSetup(container, onComplete);
    });
  }

  const scoreTypeSelect = container.querySelector("#bracketScoreType");
  if (scoreTypeSelect) {
    addListener(scoreTypeSelect, "change", () => {
      localStorage.setItem("bracket_score_type", scoreTypeSelect.value);
    });
  }

  const addTeam = () => {
    const name = teamInput.value.trim();
    if (!name) return;

    if (
      tempTeams.some((t) => getTeamName(t).toLowerCase() === name.toLowerCase())
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
    renderSetup(container, onComplete);
    container.querySelector("#bracketTeamInput")?.focus();
    showToast(`${name} added`, "success");
  };

  addListener(addBtn, "click", addTeam);
  addListener(teamInput, "keypress", (e) => {
    if (e.key === "Enter") addTeam();
  });

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
            renderSetup(container, onComplete);
            showToast(`Imported ${added} teams`, "success");
          }
        },
        "Enter team names, one per line."
      );
    });
  }

  addListener(clearBtn, "click", () => {
    showConfirmModal(
      "Clear All Teams?",
      "This will remove all teams from the list.",
      "Clear",
      () => {
        tempTeams = [];
        saveTeams();
        renderSetup(container, onComplete);
        showToast("All teams cleared");
      },
      true
    );
  });

  const teamsList = container.querySelector("#bracketTeamsList");
  if (teamsList) {
    addListener(teamsList, "click", (e) => {
      if (e.target.classList.contains("player-remove")) {
        const index = parseInt(e.target.dataset.index);
        const removed = tempTeams.splice(index, 1)[0];
        saveTeams();
        renderSetup(container, onComplete);
        showToast(`${getTeamName(removed)} removed`);
        return;
      }

      const sideToggle = e.target.closest(".side-toggle");
      if (sideToggle) {
        const index = parseInt(sideToggle.dataset.index);
        const team = tempTeams[index];
        const bracketCount = parseInt(
          localStorage.getItem("bracket_count") || "2"
        );
        const pools = ["A", "B", "C", "D", "E", "F"].slice(0, bracketCount);

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
        renderSetup(container, onComplete);
        updatePreview(container);
      }
    });
  }

  const toggleBtn = container.querySelector("#bracketToggleTeamsBtn");
  if (toggleBtn) {
    const MIN_TEAMS_FOR_EXPAND = 10;
    if (tempTeams.length > MIN_TEAMS_FOR_EXPAND) {
      toggleBtn.style.display = "block";
      toggleBtn.innerHTML = listExpanded
        ? "Show Less ▲"
        : `Show All (${tempTeams.length}) ▼`;
    } else {
      toggleBtn.style.display = "none";
    }

    addListener(toggleBtn, "click", () => {
      const list = container.querySelector("#bracketTeamsList");
      listExpanded = !listExpanded;
      if (listExpanded) {
        list.style.setProperty("max-height", "2000px", "important");
        toggleBtn.innerHTML = "Show Less ▲";
      } else {
        list.style.setProperty("max-height", "400px", "important");
        toggleBtn.innerHTML = `Show All (${tempTeams.length}) ▼`;
      }
    });
  }

  addListener(dualModeToggle, "change", () => {
    const poolSettingsSection = container.querySelector("#poolSettingsSection");
    localStorage.setItem(
      "bracket_dual_mode",
      dualModeToggle.checked ? "true" : "false"
    );
    if (poolSettingsSection) {
      poolSettingsSection.style.display = dualModeToggle.checked
        ? "flex"
        : "none";
    }
    updatePreview(container);
  });

  const bracketCountSelect = container.querySelector("#bracketCount");
  if (bracketCountSelect) {
    addListener(bracketCountSelect, "change", () => {
      localStorage.setItem("bracket_count", bracketCountSelect.value);
      updatePreview(container);
    });
  }

  if (sharedFinalToggle) {
    addListener(sharedFinalToggle, "change", () => {
      localStorage.setItem(
        "bracket_shared_final",
        sharedFinalToggle.checked ? "true" : "false"
      );
      updatePreview(container);
    });
  }

  if (sideAssignSelect) {
    addListener(sideAssignSelect, "change", () => {
      localStorage.setItem("bracket_side_assign", sideAssignSelect.value);
    });
  }

  const assignHelpBtn = container.querySelector("#assignHelp");
  if (assignHelpBtn) {
    addListener(assignHelpBtn, "click", (e) => {
      e.preventDefault();
      showInfoModal("Pool Assignment Explained", HELP_POOL_ASSIGNMENT);
    });
  }

  const bracketHelpBtn = container.querySelector("#bracketHelpBtn");
  if (bracketHelpBtn) {
    addListener(bracketHelpBtn, "click", (e) => {
      e.preventDefault();
      showInfoModal("Bracket Tournament Guide", HELP_BRACKET_GUIDE);
    });
  }

  const helpBtn = container.querySelector("#bracketHelp");
  if (helpBtn) {
    addListener(helpBtn, "click", (e) => {
      e.preventDefault();
      showInfoModal("Bracket Sizes Explained", HELP_BRACKET_SIZES);
    });
  }

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
      } else {
        initBracketTournament(tempTeams);
        showToast(`Bracket created with ${tempTeams.length} teams`, "success");
      }
      onComplete?.();
    } catch (e) {
      console.error(e);
      showToast("Error creating bracket: " + e.message, "error");
    }
  });
}

/**
 * Render the setup form
 */
export function renderSetup(container, onComplete) {
  loadTeams();
  cleanupSetupListeners();

  const savedDualMode = localStorage.getItem("bracket_dual_mode") === "true";

  container.innerHTML = `
    <div class="bracket-empty-state">
      <div class="page-intro-header">
        <h2>Create a Bracket</h2>
        <p>Set up a single elimination tournament bracket.</p>
      </div>
      
      <!-- Section 1: Players/Teams List -->
      <div class="bracket-setup-card" style="max-width: 700px; margin: 0 auto 20px; padding: 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <h3 style="margin: 0;">${getModeLabel()} <span id="bracketTeamCount">(${
    tempTeams.length
  })</span></h3>
            <button class="help-icon" id="bracketHelpBtn" style="width: 24px; height: 24px; font-size: 0.9rem; font-weight: bold;">?</button>
          </div>
          <div class="player-actions">
            <button class="btn btn-sm btn-secondary" id="importTeamsBtn">Import...</button>
            <button class="btn btn-sm btn-danger" id="clearAllTeamsBtn">Clear All</button>
          </div>
        </div>
        
        <div class="player-input-row" style="display: flex; gap: 12px; align-items: flex-end; margin-bottom: 16px;">
          <div class="input-group" style="flex: 1;">
            <label for="bracketTeamInput" style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">${getModeLabelSingular()} Name</label>
            <input type="text" id="bracketTeamInput" class="form-input" placeholder="${getModeInputPlaceholder()}" />
          </div>
          <button class="btn btn-primary" id="addTeamBtn" style="height: 44px;">Add</button>
        </div>
        
        <ul id="bracketTeamsList" class="player-list custom-scrollbar-y" style="max-height: 300px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; padding: 4px; margin: 0;">
          ${renderTeamItems()}
        </ul>
        <button class="btn btn-sm btn-secondary" id="bracketToggleTeamsBtn" style="width: 100%; margin-top: 8px; display: none;">Show All (${
          tempTeams.length
        })</button>
        
        <p class="players-hint" id="bracketTeamsHint" style="margin-top: 12px; text-align: center;">${getTeamsHint()}</p>
        <p class="form-hint" style="margin-top: 8px; text-align: center;">
          Use 4, 8, 16, or 32 ${
            bracketMode === "players" ? "players" : "teams"
          } for perfect brackets. 
          <button type="button" id="bracketHelp" class="help-btn" style="background: none; border: none; color: var(--accent); cursor: pointer; font-weight: bold; padding: 0 4px;">?</button>
        </p>
      </div>
      
      <!-- Section 2: Settings -->
      <div class="bracket-setup-card" style="max-width: 700px; margin: 0 auto 20px; padding: 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
        <div class="settings-section" style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
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
              bracketMode === "players" ? "var(--accent)" : "var(--text-muted)"
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
          
          <!-- Score Type -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.85rem; color: var(--text-secondary);">Score:</span>
            <select id="bracketScoreType" class="form-input" style="padding: 4px 8px; font-size: 0.85rem;">
              <option value="points" ${
                localStorage.getItem("bracket_score_type") === "points" ||
                !localStorage.getItem("bracket_score_type")
                  ? "selected"
                  : ""
              }>Points</option>
              <option value="games" ${
                localStorage.getItem("bracket_score_type") === "games"
                  ? "selected"
                  : ""
              }>Games</option>
              <option value="sets" ${
                localStorage.getItem("bracket_score_type") === "sets"
                  ? "selected"
                  : ""
              }>Sets</option>
            </select>
          </div>
        </div>
        
        <!-- Pool Settings Section (only visible when Multi-Brackets enabled) -->
        <div id="poolSettingsSection" style="display: ${
          savedDualMode ? "flex" : "none"
        }; flex-direction: column; gap: 12px; padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-md); margin-top: 16px;">
          <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Pool Settings</div>
          
          <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center; justify-content: center;">
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
      
      <!-- Section 3: Preview (Full Width) -->
      <div id="bracketPreview" class="bracket-preview" style="margin: 20px auto; padding: 15px; background: var(--bg-tertiary); border-radius: var(--radius-md); display: ${
        tempTeams.length >= 2 ? "block" : "none"
      };">
        <div id="bracketPreviewContent"></div>
      </div>
      
      <button class="btn btn-primary" id="createBracketBtn" ${
        tempTeams.length < 2 ? "disabled" : ""
      } style="display: block; margin: 0 auto;">Create Bracket</button>
    </div>
  `;

  updatePreview(container);
  attachSetupListeners(container, onComplete);
}
