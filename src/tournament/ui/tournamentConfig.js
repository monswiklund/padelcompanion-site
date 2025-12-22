// Tournament Configuration Module
// Interactive configuration panel for tournament settings

import { state, saveState } from "../state.js";
import { createId } from "../../shared/utils.js";
import { showInfoModal, showConfirmModal } from "../modals.js";
import { getElements } from "./elements.js";
import {
  removePreferredPair,
  getAvailablePlayersForPairing,
} from "../players.js";

/**
 * Configuration options for each setting
 */
const CONFIG_OPTIONS = {
  format: {
    label: "Format",
    type: "select",
    options: [
      { value: "americano", label: "Americano" },
      { value: "mexicano", label: "Mexicano" },
      { value: "team", label: "Team Americano" },
      { value: "teamMexicano", label: "Team Mexicano" },
    ],
    helpId: "helpFormat",
  },
  courts: {
    label: "Courts",
    type: "number",
    min: 1,
    max: 50,
  },
  scoringMode: {
    label: "Scoring",
    type: "select",
    options: [
      { value: "total", label: "Total Points" },
      { value: "race", label: "Race to" },
      { value: "time", label: "Timed" },
    ],
    helpId: "helpScoring",
  },
  pointsPerMatch: {
    label: "Points",
    type: "number",
    min: 1,
    max: 99,
  },
  maxRepeats: {
    label: "Repeats",
    type: "select",
    options: [
      { value: 0, label: "No repeats" },
      { value: 1, label: "Max 1x" },
      { value: 2, label: "Max 2x" },
      { value: 3, label: "Max 3x" },
      { value: 99, label: "Unlimited" },
    ],
    mexicanoOnly: true,
    helpId: "helpMatchup",
  },
  pairingStrategy: {
    label: "Pairing",
    type: "select",
    options: [
      { value: "optimal", label: "Optimal" },
      { value: "oneThree", label: "1&3 vs 2&4" },
      { value: "oneTwo", label: "1&2 vs 3&4" },
      { value: "oneFour", label: "1&4 vs 2&3" },
    ],
    mexicanoOnly: true,
    helpId: "helpMatchup",
  },
};

/**
 * Get formatted display value for a setting
 */
function getDisplayValue(key, value) {
  const config = CONFIG_OPTIONS[key];
  if (!config) return value;

  if (config.type === "select") {
    const option = config.options.find((o) => o.value === value);
    return option ? option.label : value;
  }

  // Special formatting for scoring display
  if (key === "pointsPerMatch") {
    if (state.scoringMode === "time") return `${value} minutes`;
    if (state.scoringMode === "race") return `First to ${value}`;
    return `${value} total points`;
  }

  return value;
}

/**
 * Render the interactive tournament configuration panel
 */
export function renderTournamentConfig() {
  const container = document.getElementById("tournamentConfig");
  if (!container) return;

  // Safe to call repeatedly thanks to internal guard
  attachConfigListeners(container);

  // Hide if tournament is running
  if (state.isLocked) {
    container.style.display = "none";
    return;
  }
  container.style.display = "block";

  const isTeam = state.format === "team" || state.format === "teamMexicano";
  const isMexicano =
    state.format === "mexicano" || state.format === "teamMexicano";
  const playerCount = state.players?.length || 0;
  const playerLabel = isTeam ? "teams" : "players";

  // Build configuration rows
  let html = `
    <div class="config-grid">
      ${renderConfigRow("format", state.format)}
      ${renderConfigRow(
        "players",
        playerCount > 0 ? `${playerCount} ${playerLabel}` : "None added",
        { readonly: true }
      )}
      ${renderConfigRow("courts", state.courts)}
      ${renderConfigRow("scoringMode", state.scoringMode)}
  `;

  // Mexicano-specific settings
  if (isMexicano) {
    html += `
      ${renderConfigRow("maxRepeats", state.maxRepeats)}
      ${renderConfigRow("pairingStrategy", state.pairingStrategy)}
    `;
  }

  html += `</div>`;

  // Fixed Pairs section (for Mexicano)
  if (isMexicano && state.preferredPartners?.length > 0) {
    const pairNames = state.preferredPartners
      .map((pair) => {
        const p1 = state.players.find((p) => p.id === pair.player1Id);
        const p2 = state.players.find((p) => p.id === pair.player2Id);
        if (p1 && p2) return `${p1.name} & ${p2.name}`;
        return null;
      })
      .filter(Boolean);

    if (pairNames.length > 0) {
      html += `
        <div class="config-pairs-section">
          <span class="config-pairs-label">Fixed Pairs:</span>
          <div class="config-pairs-list">
            ${pairNames
              .map((name) => `<span class="config-pair-chip">${name}</span>`)
              .join("")}
          </div>
          <button class="config-edit-link" data-action="edit-pairs">Edit</button>
        </div>
      `;
    }
  } else if (isMexicano) {
    html += `
      <div class="config-pairs-section config-pairs-empty">
        <button class="config-add-pair-btn" data-action="add-pair">+ Add Fixed Pair</button>
      </div>
    `;
  }

  container.innerHTML = html;
}

/**
 * Render a single configuration row
 */
function renderCustomSelect(key, value, config) {
  const currentOpt = config.options.find(
    (o) => String(o.value) === String(value)
  );
  const label = currentOpt ? currentOpt.label : value;

  return `
    <div class="ui-select-wrapper" data-key="${key}" tabindex="0">
      <div class="ui-trigger">
        <span>${label}</span>
        <div class="ui-arrow"></div>
      </div>
      <div class="ui-options">
        ${config.options
          .map(
            (opt) =>
              `<div class="ui-option ${
                String(opt.value) === String(value) ? "selected" : ""
              }" data-value="${opt.value}">${opt.label}</div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderConfigRow(key, value, options = {}) {
  const config = CONFIG_OPTIONS[key];
  const isReadonly = options.readonly;

  let controlHtml = "";

  if (!config || isReadonly) {
    let display = value;
    if (config && config.options) {
      const opt = config.options.find((o) => o.value === value);
      if (opt) display = opt.label;
    }
    controlHtml = `<span class="config-value-static">${display}</span>`;
  } else if (config.type === "select") {
    controlHtml = renderCustomSelect(key, value, config);
  } else if (config.type === "number") {
    controlHtml = `
      <input type="number" class="config-input" data-key="${key}" value="${value}" 
             min="${config.min || 1}" max="${config.max || 99}">
    `;
  } else {
    controlHtml = `<span class="config-value">${value}</span>`;
  }

  return `
    <div class="config-row" data-config-key="${key}">
      <span class="config-label">${config?.label || key}:</span>
      ${controlHtml}
      ${
        config?.helpId
          ? `<button class="config-help" data-action="show-help" data-help-id="${config.helpId}">?</button>`
          : ""
      }
    </div>
  `;
}

/**
 * Update a configuration value
 */
function updateConfigValue(key, value) {
  state[key] = value;
  saveState();

  // Sync with original form elements for compatibility
  const els = getElements();
  if (key === "format" && els.format) els.format.value = value;
  if (key === "courts" && els.courts) els.courts.value = value;
  if (key === "scoringMode" && els.scoringMode) els.scoringMode.value = value;
  if (key === "pointsPerMatch" && els.points) els.points.value = value;
  if (key === "maxRepeats" && els.maxRepeats) els.maxRepeats.value = value;
  if (key === "pairingStrategy" && els.pairingStrategy)
    els.pairingStrategy.value = value;

  // Re-render
  renderTournamentConfig();

  // Update other UI components
  import("./players.js").then((m) => m.renderPlayers && m.renderPlayers());
}

function attachConfigListeners(container) {
  if (container.dataset.listenersAttached) return;
  container.dataset.listenersAttached = "true";

  // Input changes (number)
  container.addEventListener("change", (e) => {
    const target = e.target;
    if (target.classList.contains("config-input")) {
      const key = target.dataset.key;
      let newVal = parseInt(target.value);
      updateConfigValue(key, newVal);
    }
  });

  // Custom Select Interaction
  container.addEventListener("click", (e) => {
    // 1. Toggle Select
    const select = e.target.closest(".ui-select-wrapper");
    if (select) {
      if (!e.target.closest(".ui-option")) {
        const wasOpen = select.classList.contains("open");

        // Close others
        document.querySelectorAll(".ui-select-wrapper.open").forEach((el) => {
          el.classList.remove("open");
          const opts = el.querySelector(".ui-options");
          if (opts) opts.style.display = "none";
          if (el.closest(".config-row"))
            el.closest(".config-row").style.zIndex = "";
        });

        if (!wasOpen) {
          select.classList.add("open");
          const opts = select.querySelector(".ui-options");
          if (opts) opts.style.display = "block";
          if (select.closest(".config-row"))
            select.closest(".config-row").style.zIndex = "100";
        }
      }
    }

    // 2. Choose Option
    const option = e.target.closest(".ui-option");
    if (option) {
      const selectEl = option.closest(".ui-select-wrapper");
      const val = option.dataset.value;
      const key = selectEl.dataset.key;

      const config = CONFIG_OPTIONS[key];
      let parsedVal = val;

      if (
        config.type === "number" ||
        key === "courts" ||
        key === "maxRepeats" ||
        key === "pointsPerMatch"
      ) {
        if (!isNaN(val) && val.trim() !== "") parsedVal = parseInt(val);
      }

      updateConfigValue(key, parsedVal);
    }

    // Buttons
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;

    if (action === "show-help") {
      const helpId = target.dataset.helpId;
      const helpBtn = document.getElementById(helpId);
      if (helpBtn) helpBtn.click();
    }

    if (action === "edit-pairs" || action === "add-pair") {
      openAddPairModal();
    }
  });

  // Close on outside click is handled by global listener or here?
  // Let's add a global listener for outside click once.
  // Or assume a global handler exists.
  // I'll add the global handler here, but it might be added multiple times if attachConfigListeners is called multiple times?
  // No, tournamentConfig is likely initialized once. "initTournamentConfig" calls it.

  // Safe to add document listener if we check?
  // Better: Add click listener to document only once.
  // Or handle document click in the init function.
  // Since I can't change init easily, I'll add it here but it's not ideal.
  // Actually, attachConfigListeners is likely called once on init.
  // Global listener is handled outside to prevent duplication
}

function handleOutsideClick(e) {
  if (!e.target.closest(".ui-select-wrapper")) {
    document.querySelectorAll(".ui-select-wrapper.open").forEach((el) => {
      el.classList.remove("open");
      const opts = el.querySelector(".ui-options");
      if (opts) opts.style.display = "none";
      if (el.closest(".config-row"))
        el.closest(".config-row").style.zIndex = "";
    });
  }
}

/**
 * Show inline editor for a config value
 */
function showInlineEditor(element, key) {
  const config = CONFIG_OPTIONS[key];
  if (!config) return;

  // Remove any existing editors
  closeAllEditors();

  const currentValue = state[key];

  let editorHtml = "";
  if (config.type === "select") {
    editorHtml = `
      <div class="inline-editor">
        <select class="inline-select" data-key="${key}">
          ${config.options
            .map(
              (opt) =>
                `<option value="${opt.value}" ${
                  opt.value === currentValue ? "selected" : ""
                }>${opt.label}</option>`
            )
            .join("")}
        </select>
      </div>
    `;
  } else if (config.type === "number") {
    editorHtml = `
      <div class="inline-editor">
        <input type="number" class="inline-input" data-key="${key}" 
               value="${currentValue}" min="${config.min || 1}" max="${
      config.max || 99
    }">
      </div>
    `;
  }

  // Insert editor
  element.classList.add("editing");
  element.innerHTML = editorHtml;

  // Focus the input
  const input = element.querySelector("select, input");
  if (input) {
    input.focus();
    if (input.tagName === "INPUT") input.select();

    // Handle change
    input.addEventListener("change", (e) => {
      const newValue =
        config.type === "number" ? parseInt(e.target.value) : e.target.value;
      updateConfigValue(key, newValue);
    });

    // Handle Enter/Escape
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const newValue =
          config.type === "number" ? parseInt(e.target.value) : e.target.value;
        updateConfigValue(key, newValue);
      } else if (e.key === "Escape") {
        closeAllEditors();
      }
    });
  }
}

/**
 * Close all inline editors and re-render
 */
function closeAllEditors() {
  renderTournamentConfig();
}

/**
 * Update a configuration value
 */
function updateConfigValue_UNUSED(key, value) {
  state[key] = value;
  saveState();

  // Sync with original form elements for compatibility
  const els = getElements();
  if (key === "format" && els.format) els.format.value = value;
  if (key === "courts" && els.courts) els.courts.value = value;
  if (key === "scoringMode" && els.scoringMode) els.scoringMode.value = value;
  if (key === "pointsPerMatch" && els.points) els.points.value = value;
  if (key === "maxRepeats" && els.maxRepeats) els.maxRepeats.value = value;
  if (key === "pairingStrategy" && els.pairingStrategy)
    els.pairingStrategy.value = value;

  // Re-render
  renderTournamentConfig();

  // Update other UI components
  import("./players.js").then((m) => m.renderPlayers && m.renderPlayers());
}

/**
 * Attach event listeners to config container
 */
// function deleted
/*

      target.classList.contains("config-input")
    ) {
      const key = target.dataset.key;
      let newVal = target.value;
      const config = CONFIG_OPTIONS[key];
      if (config && config.type === "number") {
        newVal = parseInt(newVal);
      }
      updateConfigValue(key, newVal);
    }
  });

  // Buttons and Links
  container.addEventListener("click", (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;

    if (action === "show-help") {
      const helpId = target.dataset.helpId;
      const helpBtn = document.getElementById(helpId);
      if (helpBtn) helpBtn.click();
    }

    if (action === "edit-pairs" || action === "add-pair") {
      openAddPairModal();
    }
  });
}

*/
function openAddPlayerModal_UNUSED() {
  const container = document.createElement("div");
  container.className = "modal-overlay active";
  container.innerHTML = `
    <div class="modal-content" style="max-width: 400px;">
      <h3>Add Player</h3>
      <p>Enter player name to add to the tournament.</p>
      
      <div class="form-group" style="margin: 1.5rem 0;">
        <input type="text" id="quickPlayerInput" class="form-input" placeholder="Player Name" autofocus>
      </div>
      
      <div class="modal-buttons">
        <button class="btn btn-secondary" id="cancelAddPlayer">Cancel</button>
        <button class="btn btn-primary" id="confirmAddPlayer">Add Player</button>
      </div>
      
      <div style="margin-top: 1rem; text-align: center; border-top: 1px solid var(--border-color); padding-top: 1rem;">
        <button class="btn-text" id="manageAllPlayers" style="font-size: 0.85rem;">Manage All (Import/Delete)</button>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  const input = container.querySelector("#quickPlayerInput");
  const close = () => container.remove();

  const submit = () => {
    const name = input.value.trim();
    if (name) {
      addPlayer(name);
      import("./players.js").then((m) => m.renderPlayers && m.renderPlayers());
      updateConfigValue("players", state.players.length); // Trigger re-render
      close();
    }
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submit();
    if (e.key === "Escape") close();
  });

  container
    .querySelector("#confirmAddPlayer")
    .addEventListener("click", submit);
  container.querySelector("#cancelAddPlayer").addEventListener("click", close);

  container.querySelector("#manageAllPlayers").addEventListener("click", () => {
    close();
    // Scroll to full player list as fallback
    const playerSection = document.querySelector(".players-section");
    if (playerSection) {
      playerSection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // click outside
  container.addEventListener("click", (e) => {
    if (e.target === container) close();
  });

  input.focus();
}

/**
 * Open modal to add/edit fixed pairs
 */
/**
 * Open modal to add/edit fixed pairs with Custom UI
 */
function openAddPairModal() {
  state.preferredPartners ||= [];
  const container = document.createElement("div");
  container.className = "modal-overlay active";

  // Helpers for type-safe comparisons
  const sameId = (a, b) => String(a) === String(b);
  const findPlayerByRawId = (raw) =>
    state.players.find((p) => sameId(p.id, raw));
  const findPairByRawId = (raw) =>
    state.preferredPartners.find((p) => sameId(p.id, raw));

  let p1Val = null;
  let p2Val = null;

  const styles = `
    <style>
      .pair-modal-content { 
        max-width: 500px; width: 90%; 
        background: var(--bg-surface); 
        border: 1px solid var(--border-color); 
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
      }
      .custom-select { position: relative; flex: 1; font-family: inherit; }
      .select-trigger { 
        display: flex; justify-content: space-between; align-items: center;
        padding: 12px 14px; 
        background: var(--input-bg); 
        border: 1px solid var(--border-color); 
        border-radius: 10px; cursor: pointer; 
        color: var(--text-muted); 
        transition: all 0.2s;
        font-size: 0.95rem; user-select: none;
      }
      .select-trigger.filled { color: var(--text-primary); border-color: rgba(255,255,255,0.2); }
      .select-trigger:hover { background: var(--bg-card-hover); }
      .select-trigger.active { border-color: #4CAF50; box-shadow: 0 0 0 2px rgba(76,175,80,0.2); }
      .select-arrow { transition: transform 0.2s; opacity: 0.5; }
      .select-trigger.active .select-arrow { transform: rotate(180deg); opacity: 1; }
      
      .select-options {
        position: absolute; top: calc(100% + 8px); left: 0; right: 0;
        background: var(--bg-surface); 
        border: 1px solid var(--border-color); 
        border-radius: 12px;
        max-height: 240px; overflow-y: auto; z-index: 100; display: none;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5); padding: 4px;
        -webkit-overflow-scrolling: touch;
      }
      .select-options.open { display: block; animation: slideDown 0.15s ease-out; }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      
      .option { 
        padding: 10px 12px; cursor: pointer; border-radius: 8px; 
        color: var(--text-secondary);
        display: flex; align-items: center; font-size: 0.95rem;
      }
      .option:hover { background: rgba(255,255,255,0.08); color: var(--text-primary); }
      .option.selected { color: #4CAF50; background: rgba(76, 175, 80, 0.1); }
      .option.disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; text-decoration: line-through; }
      
      .add-action-btn {
        padding: 0 20px; height: 44px; border-radius: 10px; border: none;
        font-weight: 600; cursor: pointer; transition: 0.2s;
        background: #3f3f46; color: #71717a;
      }
      .add-action-btn.ready { background: #4CAF50; color: #fff; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3); }
      .add-action-btn.ready:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4); }

      .pair-list-clean { 
        margin-top: 1rem; max-height: 300px; overflow-y: auto; padding-right: 4px;
        -webkit-overflow-scrolling: touch;
      }
      .pair-item-clean { 
        display: flex; justify-content: space-between; align-items: center; 
        padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.06); 
      }
      .pair-names { font-size: 1rem; color: #fff; font-weight: 500; }
      .pair-remove-icon { 
        width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
        color: #71717a; cursor: pointer; border-radius: 50%; transition: 0.2s;
      }
      .pair-remove-icon:hover { color: #fff; background: rgba(255, 80, 80, 0.8); }

      /* Custom Scrollbar */
      .pair-list-clean, .select-options {
        scrollbar-width: thin;
        scrollbar-color: rgba(255,255,255,0.25) transparent;
      }
      .pair-list-clean::-webkit-scrollbar,
      .select-options::-webkit-scrollbar { width: 10px; }
      .pair-list-clean::-webkit-scrollbar-thumb,
      .select-options::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.18);
        border-radius: 999px;
      }
      .pair-list-clean::-webkit-scrollbar-thumb:hover,
      .select-options::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.28);
      }
    </style>
  `;

  // Render Main Modal
  container.innerHTML = `
    ${styles}
    <div class="modal-content pair-modal-content">
      <h3 style="margin-bottom: 0.5rem; font-size: 1.5rem;">Manage Fixed Pairs</h3>
      <p style="color: #a1a1aa; margin-bottom: 2rem;">Select two players to pair together consistently.</p>
      
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 2rem;">
        <div class="custom-select" id="sel1"></div>
        <span style="color: #71717a; font-weight: bold;">&</span>
        <div class="custom-select" id="sel2"></div>
        <button class="add-action-btn" id="addBtn">Add</button>
      </div>

      <div class="pair-list-clean" id="pairsList"></div>
      
      <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
        <button class="btn-text" id="closePairsModal" style="color:#a1a1aa;">Done</button>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // Close logic with cleanup
  const onKeyDown = (e) => {
    if (e.key === "Escape") closeModal();
  };
  document.addEventListener("keydown", onKeyDown);

  const cleanup = () => document.removeEventListener("keydown", onKeyDown);
  const closeModal = () => {
    cleanup();
    container.remove();
  };

  // Helper Elements
  const elSel1 = container.querySelector("#sel1");
  const elSel2 = container.querySelector("#sel2");
  const elAddBtn = container.querySelector("#addBtn");
  const elList = container.querySelector("#pairsList");

  // Render Dropdown
  const renderSelect = (el, selectedId, placeholder) => {
    const selectedPlayer = state.players.find((p) => sameId(p.id, selectedId));
    const label = selectedPlayer ? selectedPlayer.name : placeholder;
    const isFilled = !!selectedPlayer;

    let html = `
      <div class="select-trigger ${isFilled ? "filled" : ""}">
        <span>${label}</span>
        <span class="select-arrow">▼</span>
      </div>
      <div class="select-options">
    `;

    // List of occupied players (already in a fixed pair)
    const occupiedIds = new Set();
    state.preferredPartners.forEach((pp) => {
      if (pp.player1Id) occupiedIds.add(String(pp.player1Id));
      if (pp.player2Id) occupiedIds.add(String(pp.player2Id));
    });

    state.players.forEach((p) => {
      const pIdStr = String(p.id);
      const isSelected = sameId(p.id, selectedId);

      // Determine if disabled
      // 1. In another fixed pair?
      const isOccupied = occupiedIds.has(pIdStr);

      // 2. Selected in the OTHER dropdown?
      // If we are renderSelect for sel1, check p2Val. If sel2, check p1Val.
      // But 'renderSelect' doesn't know if it's sel1 or sel2 easily unless we pass it or check el.id
      // We passed 'el'. Let's check ID.
      const isOther =
        (el.id === "sel1" && sameId(p.id, p2Val)) ||
        (el.id === "sel2" && sameId(p.id, p1Val));

      const isDisabled = isOccupied || isOther;

      html += `<div class="option ${isSelected ? "selected" : ""} ${
        isDisabled ? "disabled" : ""
      }" data-val="${p.id}">${p.name} ${isOccupied ? "(Paired)" : ""}</div>`;
    });

    html += `</div>`;
    el.innerHTML = html;
  };

  // Render List
  const renderList = () => {
    if (state.preferredPartners.length === 0) {
      elList.innerHTML = `<div style="text-align: center; padding: 2rem; color: #52525b;">No fixed pairs yet</div>`;
      return;
    }
    elList.innerHTML = state.preferredPartners
      .map((pair) => {
        const p1 = state.players.find((p) => sameId(p.id, pair.player1Id));
        const p2 = state.players.find((p) => sameId(p.id, pair.player2Id));
        if (!p1 || !p2) return "";
        return `
        <div class="pair-item-clean">
          <span class="pair-names">${p1.name} & ${p2.name}</span>
          <div class="pair-remove-icon" data-remove="${String(pair.id)}">✕</div>
        </div>
      `;
      })
      .join("");
  };

  // UI Updates
  const updateUI = () => {
    renderSelect(elSel1, p1Val, "Select Player 1");
    renderSelect(elSel2, p2Val, "Select Player 2");
    renderList();

    // Update button
    if (p1Val && p2Val && !sameId(p1Val, p2Val)) {
      elAddBtn.classList.add("ready");
      elAddBtn.disabled = false;
    } else {
      elAddBtn.classList.remove("ready");
      elAddBtn.disabled = true;
    }
  };

  // Initial Render
  updateUI();

  // Event Delegation
  container.addEventListener("click", (e) => {
    // Close Logic
    if (e.target === container || e.target.id === "closePairsModal") {
      closeModal();
      return;
    }

    // Close Dropdowns on outside click
    if (!e.target.closest(".custom-select")) {
      container
        .querySelectorAll(".select-options")
        .forEach((el) => el.classList.remove("open"));
      container
        .querySelectorAll(".select-trigger")
        .forEach((el) => el.classList.remove("active"));
    }

    // Toggle Dropdown
    const trigger = e.target.closest(".select-trigger");
    if (trigger) {
      const parent = trigger.parentElement; // .custom-select
      const opts = parent.querySelector(".select-options");
      const wasOpen = opts.classList.contains("open");

      // Close all others
      container
        .querySelectorAll(".select-options")
        .forEach((el) => el.classList.remove("open"));
      container
        .querySelectorAll(".select-trigger")
        .forEach((el) => el.classList.remove("active"));

      if (!wasOpen) {
        opts.classList.add("open");
        trigger.classList.add("active");
      }
    }

    // Select Option
    const option = e.target.closest(".option");
    if (option) {
      const raw = option.dataset.val;
      const player = findPlayerByRawId(raw);

      if (player) {
        const parentId = option.closest(".custom-select").id;
        if (parentId === "sel1") p1Val = player.id;
        if (parentId === "sel2") p2Val = player.id;

        updateUI();

        // Close dropdowns
        container
          .querySelectorAll(".select-options")
          .forEach((el) => el.classList.remove("open"));
        container
          .querySelectorAll(".select-trigger")
          .forEach((el) => el.classList.remove("active"));
      }
    }

    // Add Pair
    if (e.target.closest("#addBtn") && !elAddBtn.disabled) {
      // Check duplicate
      const exists = state.preferredPartners.some(
        (p) =>
          (sameId(p.player1Id, p1Val) && sameId(p.player2Id, p2Val)) ||
          (sameId(p.player1Id, p2Val) && sameId(p.player2Id, p1Val))
      );

      if (exists) {
        alert("Pair already exists");
        return;
      }

      // Check if players occupied
      const busy = state.preferredPartners.some(
        (p) =>
          sameId(p.player1Id, p1Val) ||
          sameId(p.player2Id, p1Val) ||
          sameId(p.player1Id, p2Val) ||
          sameId(p.player2Id, p2Val)
      );
      if (busy) {
        if (
          !confirm(
            "One of these players is already in another pair. Create anyway?"
          )
        )
          return;
      }

      state.preferredPartners.push({
        id: createId(),
        player1Id: p1Val,
        player2Id: p2Val,
      });
      saveState();

      // Reset selection
      p1Val = null;
      p2Val = null;
      updateUI();
      renderTournamentConfig();
    }

    // Remove Pair
    const removeBtn = e.target.closest(".pair-remove-icon");
    if (removeBtn) {
      const raw = removeBtn.dataset.remove;
      const pair = findPairByRawId(raw);
      if (pair) {
        removePreferredPair(pair.id);
        updateUI();
        renderTournamentConfig();
      }
    }
  });
}
export function initTournamentConfig() {
  const container = document.getElementById("tournamentConfig");
  // Attach listeners once
  if (container) attachConfigListeners(container);

  renderTournamentConfig();
}

// Initialize global listeners
document.addEventListener("click", handleOutsideClick);
