/**
 * Setup Module
 * Handles the setup form for Winners Court.
 */

import {
  getWinnersCourtState,
  initWinnersCourt,
  clearWinnersCourt,
} from "./logic.js";
import {
  showConfirmModal,
  showInputModal,
  showInfoModal,
} from "../../core/modals.js";
import { HELP_SKILL_LEVELS } from "../../content/help.js";
import { showToast } from "../../../shared/utils.js";
import { setupCustomSelects } from "../../ui/customSelect.js";
import { renderPlayerListItem } from "../../ui/components/playerList.js";
import { StorageService } from "../../../shared/storage.js";
import { PageHeader } from "../../ui/components/PageHeader.js";
import { PlayerManager } from "../../ui/components/PlayerManager.js";
import { SettingsCard } from "../../ui/components/SettingsCard.js";

/**
 * Render setup form.
 * @param {HTMLElement} container - Container element
 * @param {Object} pageState - Page state { tempPlayers, splitSidesEnabled, listExpanded }
 * @param {Function} addListener - Listener tracker function
 * @param {Function} onReRender - Callback to re-render the full page
 */
/**
 * Render setup form.
 * @param {HTMLElement} container - Container element
 * @param {Object} pageState - Page state { tempPlayers, splitSidesEnabled, listExpanded }
 * @param {Function} addListener - Listener tracker function
 * @param {Function} onReRender - Callback to re-render the full page
 */
export function renderSetup(container, pageState, addListener, onReRender) {
  if (!container) return;

  const wcState = getWinnersCourtState();
  const isGameActive = !!wcState;
  const maxCourts = Math.max(1, Math.floor(pageState.tempPlayers.length / 4));

  // --- 1. Page Header ---
  const headerHtml = PageHeader({
    title: "Winners Court",
    subtitle: isGameActive
      ? "Game in Progress • You can modify players here for the next game."
      : "Skill-based court promotion",
    actionId: "wcHelpBtn",
    actionIcon: "?",
  });

  // --- 2. Player Manager ---
  // Custom Skill Input Slot
  const skillSlot = `
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
  `;

  // Determine list content (Standard vs Split Sides)
  const listContent = renderPlayerItems(pageState);

  const playerManagerHtml = PlayerManager({
    items: pageState.tempPlayers,
    mode: "players",
    inputId: "wcNameInput",
    addBtnId: "addPlayerBtn",
    importBtnId: "importBtn",
    clearBtnId: "clearAllBtn",
    listId: "wcPlayersList",
    toggleBtnId: "wcTogglePlayersBtn",
    hintId: "wcPlayersHint",
    // We pass null for renderItem because we provide customListContent
    renderItem: null,
    customInputSlot: skillSlot,
    customListContent: listContent,
    hintText: getPlayersHint(pageState),
  });

  // --- 3. Settings Section ---
  const settingsHtml = `
    <div class="wc-options" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 16px;">
      ${
        !pageState.splitSidesEnabled
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
                }>${n} Court${n > 1 ? "s" : ""} (${n * 4} players)</option>`
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
          pageState.splitSidesEnabled ? "checked" : ""
        } />
        <span class="slider round"></span>
        <span class="toggle-label">Split Sides (A/B)</span>
      </label>
      
      ${
        pageState.splitSidesEnabled
          ? `
        <button class="btn btn-sm btn-secondary" id="wcAutoAssignBtn" style="white-space: nowrap;">
          Auto-Assign by Skill
        </button>
      `
          : ""
      }
    </div>
  `;

  const settingsCardHtml = SettingsCard({
    content: settingsHtml,
    style: "text-align: center;",
  });

  // --- 4. Main Actions ---
  const mainActionsHtml = !isGameActive
    ? `<button class="btn btn-primary btn-lg" id="generateWcBtn" ${
        pageState.tempPlayers.length < 4 ? "disabled" : ""
      } style="display: block; margin: 0 auto;">Generate Winners Court</button>`
    : `<div style="text-align: center; margin-top: 10px;">
           <button class="btn btn-secondary btn-sm" id="restartWcBtn">Restart / New Game</button>
         </div>`;

  // --- Render to Container ---
  // Note: PageHeader is technically rendered in index.js for this page?
  // Checking index.js:
  // container.innerHTML = `
  //     <div class="page-intro-header">...</div>
  //     <div id="wcSetupContainer"></div> ...
  // `
  // So index.js renders the header. But our plan says "Replace header with PageHeader".
  // If we put PageHeader INSIDE setup container, we might duplicate it or need to remove it from index.js.
  // However, removing it from index.js makes index.js cleaner.
  // Let's assume we want to CONTROL the header from here if we want to change subtitles dynamically (Game in Progress).
  //
  // BUT: index.js renders the container structure ONCE, and Setup re-renders inside #wcSetupContainer.
  // If we put the header in #wcSetupContainer, it will re-render with the setup form. That's fine.
  // But we need to remove the static header from index.js then.
  // For now, let's keep the header in index.js?
  // "Game in Progress" subtitle IS distinct.
  //
  // Let's render everything into #wcSetupContainer.
  // BUT the header should probably be outside the setup form card?
  //
  // Decision: Render PageHeader primarily in index.js, but since we are refactoring setup.js:
  // The implementations plan said: "[MODIFY] winnersCourt/setup.js ... Replace header with PageHeader"
  // This implies we move header rendering here OR update index.js to use PageHeader.
  // Let's verify index.js content. It has:
  // container.innerHTML = `
  //   <div class="page-intro-header">...</div>
  //   <div id="wcSetupContainer"></div>
  // `
  // If I add PageHeader to setup.js, I need to remove it from index.js.
  // I will check index.js content again.

  container.innerHTML = `
    <div class="wc-setup ${isGameActive ? "compact" : ""}">
      ${headerHtml}
      
      ${/* Player Manager Card */ ""}
      ${SettingsCard({
        content: playerManagerHtml + renderSideSummary(pageState),
      })}
      
      ${/* Settings Card (Split Twist etc) */ ""}
      ${settingsCardHtml}
      
      ${mainActionsHtml}
    </div>
  `;

  attachSetupListeners(container, pageState, addListener, onReRender);
  setupCustomSelects();
}

/**
 * Render player list items.
 */
function renderPlayerItems(pageState) {
  const options = {
    showSkill: true,
    editableSkill: true,
    showSide: pageState.splitSidesEnabled,
  };

  if (!pageState.splitSidesEnabled) {
    return pageState.tempPlayers
      .map((player, i) => renderPlayerListItem(player, i, options))
      .join("");
  }

  // Group by side with visual separator
  const sideA = pageState.tempPlayers
    .map((p, i) => ({ ...p, originalIndex: i }))
    .filter((p) => p.side !== "B");
  const sideB = pageState.tempPlayers
    .map((p, i) => ({ ...p, originalIndex: i }))
    .filter((p) => p.side === "B");

  let html = "";

  if (sideA.length > 0) {
    html += `<li class="side-header" style="padding: 4px 8px; background: rgba(59, 130, 246, 0.1); color: var(--accent); font-size: 0.75rem; font-weight: 600; border-radius: 4px; margin-bottom: 4px;">Side A (${sideA.length})</li>`;
    html += sideA
      .map((p) => renderPlayerListItem(p, p.originalIndex, options))
      .join("");
  }

  if (sideB.length > 0) {
    html += `<li class="side-header" style="padding: 4px 8px; background: rgba(245, 158, 11, 0.1); color: var(--warning); font-size: 0.75rem; font-weight: 600; border-radius: 4px; margin-top: 8px; margin-bottom: 4px;">Side B (${sideB.length})</li>`;
    html += sideB
      .map((p) => renderPlayerListItem(p, p.originalIndex, options))
      .join("");
  }

  return html;
}

/**
 * Render side summary showing player counts and names per side.
 */
function renderSideSummary(pageState) {
  if (!pageState.splitSidesEnabled || pageState.tempPlayers.length === 0)
    return "";

  const sideA = pageState.tempPlayers.filter((p) => p.side !== "B");
  const sideB = pageState.tempPlayers.filter((p) => p.side === "B");

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
}

/**
 * Get players hint text.
 */
function getPlayersHint(pageState) {
  const count = pageState.tempPlayers.length;

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
}

/**
 * Attach event listeners for setup form.
 */
function attachSetupListeners(container, pageState, addListener, onReRender) {
  const nameInput = container.querySelector("#wcNameInput");
  const skillSelect = container.querySelector("#wcSkillInput");
  const addBtn = container.querySelector("#addPlayerBtn");
  const importBtn = container.querySelector("#importBtn");
  const clearBtn = container.querySelector("#clearAllBtn");
  const generateBtn = container.querySelector("#generateWcBtn");
  const restartBtn = container.querySelector("#restartWcBtn");
  const helpBtn = container.querySelector("#wcHelpBtn");

  // Help button is handled by the main module

  // Split sides toggle
  const splitSidesToggle = container.querySelector("#wcSplitSides");
  if (splitSidesToggle) {
    addListener(splitSidesToggle, "change", () => {
      pageState.splitSidesEnabled = splitSidesToggle.checked;
      StorageService.setItem(
        "wc_split_sides",
        pageState.splitSidesEnabled ? "true" : "false"
      );
      renderSetup(container, pageState, addListener, onReRender);
    });
  }

  // Auto-assign by skill
  const autoAssignBtn = container.querySelector("#wcAutoAssignBtn");
  if (autoAssignBtn) {
    addListener(autoAssignBtn, "click", () => {
      const unknownIndices = [];
      pageState.tempPlayers.forEach((player, i) => {
        if (player.skill === 0) {
          unknownIndices.push(i);
          player.side = null;
        } else {
          player.side = player.skill >= 5 ? "A" : "B";
        }
      });

      let countA = pageState.tempPlayers.filter((p) => p.side === "A").length;
      let countB = pageState.tempPlayers.filter((p) => p.side === "B").length;

      // Shuffle unknown players
      for (let i = unknownIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unknownIndices[i], unknownIndices[j]] = [
          unknownIndices[j],
          unknownIndices[i],
        ];
      }

      unknownIndices.forEach((idx) => {
        if (countA <= countB) {
          pageState.tempPlayers[idx].side = "A";
          countA++;
        } else {
          pageState.tempPlayers[idx].side = "B";
          countB++;
        }
      });

      pageState.saveSetup();
      renderSetup(container, pageState, addListener, onReRender);
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
      showInfoModal("About Skill Levels", HELP_SKILL_LEVELS);
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

            let skill = 0;
            if (parts.length > 1) {
              const val = parseInt(parts[1].trim());
              if (!isNaN(val) && val >= 1 && val <= 10) skill = val;
            }

            pageState.tempPlayers.push({ name, skill });
            added++;
          });

          if (added > 0) {
            pageState.saveSetup();
            renderSetup(container, pageState, addListener, onReRender);
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

    const exists = pageState.tempPlayers.some(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      showToast("Player already exists!", "error");
      return;
    }

    if (name && skill >= 0 && skill <= 10) {
      const side =
        pageState.splitSidesEnabled && skill > 0 && skill < 5 ? "B" : "A";
      pageState.tempPlayers.push({ name, skill, side });
      pageState.saveSetup();
      nameInput.value = "";
      renderSetup(container, pageState, addListener, onReRender);
      container.querySelector("#wcNameInput").focus();

      const skillText = skill === 0 ? "-" : skill;
      const sideText = pageState.splitSidesEnabled ? ` → Side ${side}` : "";
      showToast(`${name} (${skillText}) added${sideText}`, "success");
    }
  };

  if (addBtn) addListener(addBtn, "click", addPlayer);
  if (nameInput) {
    addListener(nameInput, "keypress", (e) => {
      if (e.key === "Enter") addPlayer();
    });
  }

  // Clear all
  if (clearBtn) {
    addListener(clearBtn, "click", () => {
      pageState.tempPlayers = [];
      pageState.saveSetup();
      renderSetup(container, pageState, addListener, onReRender);
    });
  }

  // Side toggle (event delegation)
  const playersList = container.querySelector("#wcPlayersList");
  if (playersList) {
    addListener(playersList, "click", (e) => {
      const toggle = e.target.closest(".side-toggle");
      if (toggle) {
        const index = parseInt(toggle.dataset.index);
        pageState.tempPlayers[index].side =
          pageState.tempPlayers[index].side === "B" ? "A" : "B";
        pageState.saveSetup();
        renderSetup(container, pageState, addListener, onReRender);
      }
    });

    // Remove player
    addListener(playersList, "click", (e) => {
      if (e.target.classList.contains("player-remove")) {
        const index = parseInt(e.target.dataset.index);
        pageState.tempPlayers.splice(index, 1);
        pageState.saveSetup();
        renderSetup(container, pageState, addListener, onReRender);
      }
    });

    // Handle skill change
    addListener(playersList, "change", (e) => {
      if (e.target.dataset.action === "update-skill") {
        const index = parseInt(e.target.dataset.index);
        const newSkill = parseInt(e.target.value);
        if (pageState.tempPlayers[index]) {
          pageState.tempPlayers[index].skill = newSkill;
          pageState.saveSetup();
        }
      }
    });
  }

  // Toggle show all players
  const toggleBtn = container.querySelector("#wcTogglePlayersBtn");
  if (toggleBtn) {
    if (pageState.tempPlayers.length > 10) {
      toggleBtn.style.display = "block";
      toggleBtn.innerHTML = pageState.listExpanded
        ? "Show Less ▲"
        : `Show All (${pageState.tempPlayers.length}) ▼`;
    } else {
      toggleBtn.style.display = "none";
    }

    addListener(toggleBtn, "click", () => {
      const list = container.querySelector("#wcPlayersList");
      pageState.listExpanded = !pageState.listExpanded;

      if (pageState.listExpanded) {
        list.style.setProperty("max-height", "2000px", "important");
        toggleBtn.innerHTML = "Show Less ▲";
      } else {
        list.style.setProperty("max-height", "400px", "important");
        toggleBtn.innerHTML = `Show All (${pageState.tempPlayers.length}) ▼`;
      }
    });
  }

  // Generate
  if (generateBtn) {
    addListener(generateBtn, "click", () => {
      handleGenerate(container.parentElement, pageState, onReRender);
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
          onReRender();
        }
      );
    });
  }
}

/**
 * Handle generate button click.
 */
function handleGenerate(mainContainer, pageState, onReRender) {
  const twist = document.getElementById("wcTwist")?.checked || false;

  const sideA = pageState.tempPlayers.filter((p) => p.side !== "B");
  const sideB = pageState.tempPlayers.filter((p) => p.side === "B");

  const playersBySide = { A: sideA, B: sideB };
  const courtCountA = Math.floor(sideA.length / 4);
  const courtCountB = Math.floor(sideB.length / 4);
  const courtCountBySide = { A: courtCountA, B: courtCountB };

  if (courtCountA === 0 && courtCountB === 0) {
    showToast("Need at least 4 players on a side to start", "error");
    return;
  }

  try {
    initWinnersCourt(playersBySide, courtCountBySide, twist);

    const totalCourts = courtCountA + courtCountB;
    showToast(`Winners Court created with ${totalCourts} court(s)`, "success");

    onReRender();
  } catch (e) {
    showToast(e.message, "error");
  }
}
