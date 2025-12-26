// Tournament Configuration Module
// Interactive configuration panel for tournament settings

import { state, saveState } from "../state.js";
import { createId, showToast } from "../../shared/utils.js";
import { showInfoModal, showConfirmModal, showAlertModal } from "../modals.js";
import { getElements } from "./elements.js";
import { removePreferredPair } from "../players.js";

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
    min: 4,
    max: 50,
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
  strictStrategy: {
    label: "Prioritize Pattern",
    type: "toggle",
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
 * Get dynamic label for points setting based on scoring mode
 */
function getPointsLabel() {
  if (state.scoringMode === "time") return "Minutes";
  if (state.scoringMode === "race") return "Race to";
  return "Total Points";
}

/**
 * Render the interactive tournament configuration panel
 */
export function renderTournamentConfig() {
  const container = document.getElementById("tournamentConfig");
  if (!container) return;

  // Safe to call repeatedly thanks to internal guard
  attachConfigListeners(container);

  container.style.display = "block";

  const isTeam = state.format === "team" || state.format === "teamMexicano";
  const isMexicano =
    state.format === "mexicano" || state.format === "teamMexicano";
  const playerCount = state.players?.length || 0;
  const playerLabel = isTeam ? "teams" : "players";

  // Clamp courts if they exceed max available for current players
  const maxCourts = Math.max(1, Math.floor(playerCount / 4));
  if (state.courts > maxCourts) {
    state.courts = maxCourts;
    saveState();
  }

  // Clamp pointsPerMatch if outside bounds (4-50)
  if (state.pointsPerMatch < 4) {
    state.pointsPerMatch = 4;
    saveState();
  } else if (state.pointsPerMatch > 50) {
    state.pointsPerMatch = 50;
    saveState();
  }

  // Build configuration rows - format-specific layouts
  let html = `<div class="config-grid">`;

  // Common: Format
  html += renderConfigRow("format", state.format);

  if (isMexicano) {
    // Mexicano layout: Format → Spacer → Scoring → Points → Repeats → Courts → Pairing → Prioritize Pattern
    html += `<div class="config-spacer"></div>`;
    html += renderConfigRow("scoringMode", state.scoringMode);
    html += renderConfigRow("pointsPerMatch", state.pointsPerMatch, {
      label: getPointsLabel(),
    });
    html += renderConfigRow("maxRepeats", state.maxRepeats);
    html += renderConfigRow("courts", state.courts);
    html += renderConfigRow("pairingStrategy", state.pairingStrategy);
    html += renderConfigRow("strictStrategy", state.strictStrategy, {
      disabled: state.pairingStrategy === "optimal",
    });

    // Inline warning for conflict combination
    const hasConflict =
      state.pairingStrategy !== "optimal" &&
      state.strictStrategy &&
      state.maxRepeats === 0;

    if (hasConflict) {
      html += `
        <div class="config-warning">
          <span class="warning-icon">(!)</span>
          <span>Prioritize Pattern may override 'No repeats' when the pattern requires it.</span>
        </div>
      `;
    }
  } else {
    // Americano layout: Format → Courts → Scoring → Points
    html += renderConfigRow("courts", state.courts);
    html += renderConfigRow("scoringMode", state.scoringMode);
    html += renderConfigRow("pointsPerMatch", state.pointsPerMatch, {
      label: getPointsLabel(),
    });
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
          <div class="config-pairs-header">
            <span class="config-pairs-label">Fixed Pairs:</span>
            <button class="btn btn-ghost btn-sm" data-action="edit-pairs">Edit</button>
          </div>
          <ul class="config-pairs-bullet-list">
            ${pairNames.map((name) => `<li>${name}</li>`).join("")}
          </ul>
        </div>
      `;
    }
  } else if (isMexicano) {
    html += `
      <div class="config-pairs-section config-pairs-empty">
        <button class="btn btn-dashed btn-sm" data-action="add-pair">+ Add Fixed Pair</button>
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

/**
 * Render a custom numeric stepper UI
 */
function renderCustomStepper(key, value, config) {
  const min = config.min ?? 1;
  const max = config.max ?? 99;
  const val = Number.isFinite(value) ? value : min;

  const decDisabled = val <= min;
  const incDisabled = val >= max;

  // Step 2 for points/race
  const step = key === "pointsPerMatch" && state.scoringMode !== "time" ? 2 : 1;

  return `
    <div class="ui-stepper" data-key="${key}" data-min="${min}" data-max="${max}">
      <button type="button" class="stepper-btn" data-delta="-${step}" ${
    decDisabled ? "disabled" : ""
  } aria-label="Decrease ${key}">−</button>
      <input type="number" class="stepper-input" value="${val}" min="${min}" max="${max}" step="${step}" aria-label="${key} value">
      <button type="button" class="stepper-btn" data-delta="${step}" ${
    incDisabled ? "disabled" : ""
  } aria-label="Increase ${key}">+</button>
    </div>
  `;
}

/**
 * Render a custom toggle/switch UI
 */
function renderCustomToggle(key, value, options = {}) {
  const isActive = !!value;
  const isDisabled = !!options.disabled;

  return `
    <div class="ui-toggle ${isActive ? "active" : ""} ${
    isDisabled ? "disabled" : ""
  }" 
         data-key="${key}" 
         role="switch" 
         aria-checked="${isActive}"
         tabindex="${isDisabled ? "-1" : "0"}">
      <div class="toggle-track">
        <div class="toggle-thumb"></div>
      </div>
    </div>
  `;
}

function getEffectiveConfig(key) {
  const config = { ...CONFIG_OPTIONS[key] };

  if (key === "courts") {
    const playerCount = state.players?.length || 0;
    // 4 players per court
    const calculatedMax = Math.floor(playerCount / 4);
    config.max = Math.max(1, calculatedMax); // Always allow at least 1 for UI sanity
  }

  return config;
}

function renderConfigRow(key, value, options = {}) {
  const config = getEffectiveConfig(key);
  const isReadonly = options.readonly;

  const rowLabel = options.label ?? config?.label ?? key;

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
    controlHtml = renderCustomStepper(key, value, config);
  } else if (config.type === "toggle") {
    controlHtml = renderCustomToggle(key, value, options);
  } else {
    controlHtml = `<span class="config-value">${value}</span>`;
  }

  return `
    <div class="config-row ${
      config?.type === "toggle" ? "toggle-row" : ""
    }" data-config-key="${key}">
      <div class="config-label-container">
        <span class="config-label">${rowLabel}:</span>
        ${
          config?.helpId
            ? `<button class="config-help" data-action="show-help" data-help-id="${config.helpId}">?</button>`
            : ""
        }
      </div>
      ${controlHtml}
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
  if (key === "scoringMode" && els.scoringMode) {
    els.scoringMode.value = value;
    // Set default points for the new scoring mode
    const defaults = { time: 10, race: 14, total: 28 };
    state.pointsPerMatch = defaults[value] || 28;
    if (els.points) els.points.value = state.pointsPerMatch;
  }
  if (key === "pointsPerMatch" && els.points) els.points.value = value;
  if (key === "maxRepeats" && els.maxRepeats) els.maxRepeats.value = value;
  if (key === "pairingStrategy" && els.pairingStrategy) {
    els.pairingStrategy.value = value;
    // If strategy becomes optimal, reset strictStrategy
    if (value === "optimal") {
      state.strictStrategy = false;
    }
  }

  if (key === "strictStrategy" && document.getElementById("strictStrategy")) {
    document.getElementById("strictStrategy").checked = value;
  }

  // Re-render
  renderTournamentConfig();

  // Update other UI components
  import("./players.js").then((m) => m.renderPlayers && m.renderPlayers());

  // Update section title when format changes
  if (key === "format") {
    import("./setup.js").then((m) => m.updateSetupUI && m.updateSetupUI());
  }
}

function attachConfigListeners(container) {
  if (container.dataset.listenersAttached) {
    console.log("Tournament Config: Listeners already attached");
    return;
  }
  container.dataset.listenersAttached = "true";
  console.log("Tournament Config: Attaching listeners to", container);

  // Input changes (number or stepper-input)
  container.addEventListener("change", (e) => {
    console.log("Tournament Config: Change event", e.target);
    const target = e.target;
    if (
      target.classList.contains("config-input") ||
      target.classList.contains("stepper-input")
    ) {
      const stepper = target.closest(".ui-stepper");
      const key = target.dataset.key || stepper?.dataset.key;
      if (!key) return;

      const config = getEffectiveConfig(key);
      const min = config?.min ?? 1;
      const max = config?.max ?? 99;
      let newVal = parseInt(target.value, 10);
      if (isNaN(newVal)) newVal = min;

      if (key === "courts" && newVal > max) {
        showAlertModal(
          "Too many courts",
          `You need at least ${
            newVal * 4
          } players to use ${newVal} courts. With ${
            state.players?.length || 0
          } players, you can have a maximum of ${max} courts.`
        );
      }

      // Clamp value
      const clamped = Math.min(max, Math.max(min, newVal));
    }
  });

  // Custom Select Interaction
  container.addEventListener("click", (e) => {
    console.log("Tournament Config: Click event", e.target);
    // 0. Stepper Interaction
    const stepBtn = e.target.closest(".stepper-btn");
    if (stepBtn) {
      const stepper = stepBtn.closest(".ui-stepper");
      const key = stepper?.dataset.key;
      if (!key) return;

      const config = getEffectiveConfig(key);
      const delta = parseInt(stepBtn.dataset.delta, 10) || 0;

      const min = config?.min ?? 1;
      const max = config?.max ?? 99;

      const current = parseInt(state[key], 10);

      // If user tries to increase above max, show alert
      if (delta > 0 && current >= max && key === "courts") {
        showAlertModal(
          "Too many courts",
          `You need at least ${(current + 1) * 4} players to use ${
            current + 1
          } courts.`
        );
        return;
      }

      const next = Math.min(
        max,
        Math.max(min, (Number.isFinite(current) ? current : min) + delta)
      );

      if (next !== current) updateConfigValue(key, next);
      return;
    }

    // 0.1 Toggle Interaction
    const toggle = e.target.closest(".ui-toggle");
    if (toggle && !toggle.classList.contains("disabled")) {
      const key = toggle.dataset.key;
      const newVal = !state[key];
      updateConfigValue(key, newVal);
      return;
    }

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
      // Validation for adding new pairs
      if (action === "add-pair") {
        try {
          // Inline check to avoid circular dependency import issues
          const pairedPlayerIds = new Set();
          if (state.preferredPartners) {
            state.preferredPartners.forEach((pair) => {
              pairedPlayerIds.add(String(pair.player1Id));
              pairedPlayerIds.add(String(pair.player2Id));
            });
          }
          const availableCount = state.players.filter(
            (p) => !pairedPlayerIds.has(String(p.id))
          ).length;

          if (availableCount < 2) {
            showToast("Not enough available players to form a pair", "error");
            return;
          }
        } catch (err) {
          console.error("Validation error:", err);
          // Fallback: open anyway if check fails
        }
      }
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
  container.style.display = "flex";

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
        min-height: 420px;
        background: var(--bg-card); 
        border: 1px solid var(--border-color); 
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        padding: 2rem;
        display: flex; flex-direction: column;
      }
      .custom-select { position: relative; flex: 1; font-family: inherit; }
      .select-trigger { 
        display: flex; justify-content: space-between; align-items: center;
        padding: 12px 14px; 
        background: var(--input-bg); 
        border: 1px solid var(--border-color); 
        border-radius: var(--radius-md); cursor: pointer; 
        color: var(--text-muted); 
        transition: all 0.2s;
        font-size: 0.95rem; user-select: none;
      }
      .select-trigger.filled { color: var(--text-primary); border-color: var(--border-color); }
      .select-trigger:hover { background: var(--bg-card-hover); border-color: var(--text-secondary); }
      .select-trigger.active { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(59,130,246,0.2); }
      .select-arrow { transition: transform 0.2s; opacity: 0.5; }
      .select-trigger.active .select-arrow { transform: rotate(180deg); opacity: 1; }
      
      .select-options {
        position: absolute; top: calc(100% + 8px); left: 0; right: 0;
        background: var(--bg-card); 
        border: 1px solid var(--border-color); 
        border-radius: var(--radius-md);
        max-height: 240px; overflow-y: auto; z-index: 100; display: none;
        box-shadow: var(--shadow-lg); padding: 4px;
        -webkit-overflow-scrolling: touch;
      }
      .select-options.open { display: block; animation: slideDown 0.15s ease-out; }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      
      .option { 
        padding: 12px 14px; cursor: pointer; border-radius: var(--radius-sm); 
        color: var(--text-secondary);
        display: flex; align-items: center; font-size: 0.95rem;
        border-bottom: 1px solid transparent;
      }
      .option:hover { background: var(--bg-card-hover); color: var(--text-primary); }
      .option.selected { color: var(--accent); background: rgba(59, 130, 246, 0.1); }
      .option.disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; text-decoration: line-through; }
      
      .add-action-btn {
        padding: 0 20px; height: 44px; border-radius: var(--radius-md); border: none;
        font-weight: 600; cursor: pointer; transition: 0.2s;
        background: var(--bg-secondary); color: var(--text-muted);
        border: 1px solid var(--border-color);
      }
      .add-action-btn.ready { background: var(--accent); color: #fff; border-color: var(--accent); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
      .add-action-btn.ready:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4); filter: brightness(1.1); }

      .pair-list-clean { 
        margin-top: 1rem; max-height: 300px; overflow-y: auto; padding-right: 4px;
        -webkit-overflow-scrolling: touch;
        border-top: 1px solid var(--border-color);
      }
      .pair-item-clean { 
        display: flex; justify-content: space-between; align-items: center; 
        padding: 16px 0; border-bottom: 1px solid var(--border-color); 
      }
      .pair-names { font-size: 1rem; color: var(--text-primary); font-weight: 500; }
      .pair-remove-icon { 
        width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
        color: var(--text-muted); cursor: pointer; border-radius: 50%; transition: 0.2s;
      }
      .pair-remove-icon:hover { color: #fff; background: var(--error); }

      .btn-text { 
        background: rgba(59, 130, 246, 0.1); 
        border: 1px solid rgba(59, 130, 246, 0.3);
        color: var(--accent) !important; 
        padding: 10px 24px; 
        border-radius: 999px; 
        font-weight: 600; 
        cursor: pointer; 
        transition: all 0.2s;
      }
      .btn-text:hover { 
        background: rgba(59, 130, 246, 0.2); 
        border-color: var(--accent);
        color: #fff !important;
      }

      /* Custom Scrollbar */
      .pair-list-clean, .select-options {
        scrollbar-width: thin;
        scrollbar-color: var(--text-muted) transparent;
      }
      .pair-list-clean::-webkit-scrollbar,
      .select-options::-webkit-scrollbar { width: 6px; }
      .pair-list-clean::-webkit-scrollbar-thumb,
      .select-options::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 999px;
      }
      .pair-list-clean::-webkit-scrollbar-thumb:hover,
      .select-options::-webkit-scrollbar-thumb:hover {
        background: var(--text-muted);
      }
    </style>
  `;

  // Render Main Modal
  container.innerHTML = `
    ${styles}
    <div class="modal-content pair-modal-content">
      <h3 style="margin-bottom: 0.5rem; font-size: 1.5rem; color: var(--text-primary);">Manage Fixed Pairs</h3>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Select two players to pair together consistently.</p>
      
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 2rem;">
        <div class="custom-select" id="sel1"></div>
        <span style="color: var(--text-muted); font-weight: bold;">&</span>
        <div class="custom-select" id="sel2"></div>
        <button class="add-action-btn" id="addBtn">Add</button>
      </div>

      <div class="pair-list-clean" id="pairsList" style="flex: 1; min-height: 150px;"></div>
      
      <div style="margin-top: auto; padding-top: 1.5rem; display: flex; justify-content: flex-end;">
        <button class="btn-text" id="closePairsModal" style="color:var(--text-muted);">Done</button>
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

      // 1. In another fixed pair? Skip entirely (hide)
      const isOccupied = occupiedIds.has(pIdStr);
      if (isOccupied && !isSelected) return; // Hide paired players

      // 2. Selected in the OTHER dropdown?
      const isOther =
        (el.id === "sel1" && sameId(p.id, p2Val)) ||
        (el.id === "sel2" && sameId(p.id, p1Val));

      const isDisabled = isOther;

      html += `<div class="option ${isSelected ? "selected" : ""} ${
        isDisabled ? "disabled" : ""
      }" data-val="${p.id}">${p.name}</div>`;
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
