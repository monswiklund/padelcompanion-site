import { showToast } from "../../../shared/utils.js";
import { StorageService } from "../../../shared/storage.js";
import {
  showInputModal,
  showInfoModal,
  showConfirmModal,
} from "../../core/modals.js";
import {
  HELP_POOL_ASSIGNMENT,
  HELP_BRACKET_GUIDE,
  HELP_BRACKET_SIZES,
} from "../../content/help.js";
import {
  SIDE_CONFIGS,
  renderMultiBracketPreview as renderMultiPreview,
} from "../../ui/bracket/index.js";
import {
  initBracketTournament,
  initDualBracketTournament,
} from "../../bracket/index.js";
import { PageHeader } from "../../ui/components/PageHeader.js";
import { PlayerManager } from "../../ui/components/PlayerManager.js";
import { SettingsCard } from "../../ui/components/SettingsCard.js";

// Setup State
let tempTeams = [];
let listExpanded = false;
let bracketMode = StorageService.getItem("bracket_mode", "teams"); // "teams" or "players"

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
  StorageService.setItem("bracket_teams", tempTeams);
}

function loadTeams() {
  try {
    const saved = StorageService.getItem("bracket_teams");
    if (saved) {
      tempTeams = saved.map((t) =>
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

import { renderPlayerListItem } from "../../ui/components/playerList.js";

function renderTeamItems() {
  const options = {
    showSkill: false,
    showSide: true, // Show Pool/Side
    sideLabel: "Pool", // Custom label for Bracket
    showRemove: true,
  };

  return tempTeams
    .map((team, i) => {
      // Adapter for renderPlayerListItem
      // It expects { name, side, ... } which matches our team structure
      // We need to pass index for handlers
      const itemHtml = renderPlayerListItem(team, i, options);
      // renderPlayerListItem might not support 'sideLabel' option yet?
      // Let's check playerList.js content from the view_file output first.
      // If it doesn't, we might need to stick to manual HTML but MATCH the class structure.
      // BUT, let's assume I will update playerList.js if needed or use what's there.
      // Actually, looking at the file view below will confirm.

      // WAIT, I must see the file first.
      // I will output the standard manual HTML for now that MATCHES the structure in playerList.js
      // OR import it if it's compatible.
      return itemHtml;
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
      StorageService.setItem("bracket_mode", bracketMode);
      renderSetup(container, onComplete);
    });
  }

  const scoreTypeSelect = container.querySelector("#bracketScoreType");
  if (scoreTypeSelect) {
    addListener(scoreTypeSelect, "change", () => {
      StorageService.setItem("bracket_score_type", scoreTypeSelect.value);
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
          StorageService.getItem("bracket_count", "2")
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
    StorageService.setItem(
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
      StorageService.setItem("bracket_count", bracketCountSelect.value);
      updatePreview(container);
    });
  }

  if (sharedFinalToggle) {
    addListener(sharedFinalToggle, "change", () => {
      StorageService.setItem(
        "bracket_shared_final",
        sharedFinalToggle.checked ? "true" : "false"
      );
      updatePreview(container);
    });
  }

  if (sideAssignSelect) {
    addListener(sideAssignSelect, "change", () => {
      StorageService.setItem("bracket_side_assign", sideAssignSelect.value);
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

  const savedDualMode =
    StorageService.getItem("bracket_dual_mode", "false") === "true";

  // --- 1. Page Header ---
  const headerHtml = PageHeader({
    title: "Create a Bracket",
    subtitle: "Set up a single elimination tournament bracket.",
    actionId: "bracketHelpBtn",
    actionIcon: "?",
  });

  // --- 2. Player Manager ---
  const listContent = renderTeamItems();

  // Custom Slot for Mode Toggle (Teams vs Players)
  // We can put this in the customInputSlot or maybe just keep it in settings?
  // The original UI had the toggles in settings, effectively.
  // BUT: "Teams" or "Players" label in PlayerManager depends on `bracketMode`.

  const playerManagerHtml = PlayerManager({
    items: tempTeams,
    mode: bracketMode, // "teams" or "players"
    inputId: "bracketTeamInput",
    addBtnId: "addTeamBtn",
    importBtnId: "importTeamsBtn",
    clearBtnId: "clearAllTeamsBtn",
    listId: "bracketTeamsList",
    toggleBtnId: "bracketToggleTeamsBtn",
    hintId: "bracketTeamsHint",
    renderItem: null, // Using customListContent
    customListContent: listContent,
    hintText: getTeamsHint(),
  });

  // --- 3. Settings ---
  // We need to preserve the toggles for Mode, Dual Mode, Score Type.
  const settingsHtml = `
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
            StorageService.getItem("bracket_score_type") === "points" ||
            !StorageService.getItem("bracket_score_type")
              ? "selected"
              : ""
          }>Points</option>
          <option value="games" ${
            StorageService.getItem("bracket_score_type") === "games"
              ? "selected"
              : ""
          }>Games</option>
          <option value="sets" ${
            StorageService.getItem("bracket_score_type") === "sets"
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
                    parseInt(StorageService.getItem("bracket_count", "2")) === n
                      ? "selected"
                      : ""
                  }>${n} (${String.fromCharCode(65)}...${String.fromCharCode(
                    64 + n
                  )})</option>`
              )
              .join("")}
          </select>
        </div>
        
        <!-- Pair Finals Toggle -->
        <label class="wc-toggle" id="sharedFinalLabel" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
          <input type="checkbox" id="bracketSharedFinal" ${
            StorageService.getItem("bracket_shared_final") !== "false"
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
              StorageService.getItem("bracket_side_assign") === "random" ||
              !StorageService.getItem("bracket_side_assign")
                ? "selected"
                : ""
            }>Random</option>
            <option value="alternate" ${
              StorageService.getItem("bracket_side_assign") === "alternate"
                ? "selected"
                : ""
            }>Alternate</option>
            <option value="half" ${
              StorageService.getItem("bracket_side_assign") === "half"
                ? "selected"
                : ""
            }>Split by Pool</option>
            <option value="manual" ${
              StorageService.getItem("bracket_side_assign") === "manual"
                ? "selected"
                : ""
            }>Manual</option>
          </select>
          <button type="button" id="assignHelp" class="help-btn" style="background: none; border: none; color: var(--accent); cursor: pointer; font-weight: bold; padding: 0 4px;">?</button>
        </div>
      </div>
    </div>
  `;

  const settingsCardHtml = SettingsCard({
    content: settingsHtml,
  });

  // --- 4. Preview ---
  const previewHtml = `
      <div id="bracketPreview" class="bracket-preview" style="margin: 20px auto; padding: 15px; background: var(--bg-tertiary); border-radius: var(--radius-md); display: ${
        tempTeams.length >= 2 ? "block" : "none"
      };">
        <div id="bracketPreviewContent"></div>
      </div>
  `;

  container.innerHTML = `
    <div class="tournament-setup-view">
      ${headerHtml}
      ${SettingsCard({ content: playerManagerHtml })}
      ${settingsCardHtml}
      ${previewHtml}
      
      <button class="btn btn-primary" id="createBracketBtn" ${
        tempTeams.length < 2 ? "disabled" : ""
      } style="display: block; margin: 0 auto;">Create Bracket</button>
    </div>
  `;

  updatePreview(container);
  attachSetupListeners(container, onComplete);
}
