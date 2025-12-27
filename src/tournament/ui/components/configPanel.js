/**
 * Config Panel Component
 * Handles the rendering and interaction of the tournament configuration options.
 */

import { showAlertModal } from "../../core/modals.js";
import { showToast } from "../../../shared/utils.js";

/**
 * Configuration options for each setting
 */
export const CONFIG_OPTIONS = {
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
 * Get dynamic label for points setting based on scoring mode
 */
function getPointsLabel(scoringMode) {
  if (scoringMode === "time") return "Minutes";
  if (scoringMode === "race") return "Race to";
  return "Total Points";
}

function getEffectiveConfig(key, playerCount = 0) {
  const config = { ...CONFIG_OPTIONS[key] };

  if (key === "courts") {
    // 4 players per court
    const calculatedMax = Math.floor(playerCount / 4);
    config.max = Math.max(1, calculatedMax); // Always allow at least 1 for UI sanity
  }

  return config;
}

/**
 * Render a custom select
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
 * Render a custom numeric stepper
 */
function renderCustomStepper(key, value, config, scoringMode) {
  const min = config.min ?? 1;
  const max = config.max ?? 99;
  const val = Number.isFinite(value) ? value : min;

  const decDisabled = val <= min;
  const incDisabled = val >= max;

  // Step 2 for points/race depending on scoring mode
  const step = key === "pointsPerMatch" && scoringMode !== "time" ? 2 : 1;

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
 * Render a custom toggle/switch
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

/**
 * Render a single configuration row
 */
function renderConfigRow(
  key,
  value,
  playerCount,
  extraOptions = {},
  scoringMode = null
) {
  const config = getEffectiveConfig(key, playerCount);
  const isReadonly = extraOptions.readonly;

  const rowLabel = extraOptions.label ?? config?.label ?? key;

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
    controlHtml = renderCustomStepper(key, value, config, scoringMode);
  } else if (config.type === "toggle") {
    controlHtml = renderCustomToggle(key, value, extraOptions);
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
 * Render the full configuration panel
 * @param {HTMLElement} container - The container element
 * @param {Object} config - Current configuration object (from state)
 * @param {Array} players - List of players
 * @param {Array} preferredPartners - List of fixed pairs
 * @param {Boolean} isInteractive - Whether the panel is interactive (unused?)
 */
export function renderConfigPanel(
  container,
  config,
  players = [],
  preferredPartners = []
) {
  if (!container) return;

  const playerCount = players.length;
  // Format checks
  const isTeam = config.format === "team" || config.format === "teamMexicano";
  const isMexicano =
    config.format === "mexicano" || config.format === "teamMexicano";

  // Build configuration rows
  let html = `<div class="config-grid">`;

  // Common: Format
  html += renderConfigRow("format", config.format, playerCount);

  if (isMexicano) {
    html += `<div class="config-spacer"></div>`;
    html += renderConfigRow("scoringMode", config.scoringMode, playerCount);
    html += renderConfigRow(
      "pointsPerMatch",
      config.pointsPerMatch,
      playerCount,
      { label: getPointsLabel(config.scoringMode) },
      config.scoringMode
    );
    html += renderConfigRow("maxRepeats", config.maxRepeats, playerCount);
    html += renderConfigRow("courts", config.courts, playerCount);
    html += renderConfigRow(
      "pairingStrategy",
      config.pairingStrategy,
      playerCount
    );
    html += renderConfigRow(
      "strictStrategy",
      config.strictStrategy,
      playerCount,
      {
        disabled: config.pairingStrategy === "optimal",
      }
    );

    const hasConflict =
      config.pairingStrategy !== "optimal" &&
      config.strictStrategy &&
      config.maxRepeats === 0;

    if (hasConflict) {
      html += `
        <div class="config-warning">
          <span class="warning-icon">(!)</span>
          <span>Prioritize Pattern may override 'No repeats' when the pattern requires it.</span>
        </div>
      `;
    }
  } else {
    // Americano layout
    html += renderConfigRow("courts", config.courts, playerCount);
    html += renderConfigRow("scoringMode", config.scoringMode, playerCount);
    html += renderConfigRow(
      "pointsPerMatch",
      config.pointsPerMatch,
      playerCount,
      { label: getPointsLabel(config.scoringMode) },
      config.scoringMode
    );
  }

  html += `</div>`;

  // Fixed Pairs section
  if (isMexicano && preferredPartners.length > 0) {
    const pairNames = preferredPartners
      .map((pair) => {
        const p1 = players.find((p) => String(p.id) === String(pair.player1Id));
        const p2 = players.find((p) => String(p.id) === String(pair.player2Id));
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
 * Attach interaction listeners
 * @param {HTMLElement} container
 * @param {Object} callbacks - { onUpdate: (key, val) => {}, onAddPair: () => {}, onEditPairs: () => {}, onShowHelp: (id) => {} }
 * @param {Function} getState - Returns current state/config for validation
 * @param {Function} getPlayers - Returns players list for validation
 */
export function attachConfigPanelListeners(
  container,
  callbacks,
  getState,
  getPlayers
) {
  if (container.dataset.listenersAttached) return;
  container.dataset.listenersAttached = "true";

  // Stepper / Input Events
  container.addEventListener("change", (e) => {
    const target = e.target;
    if (
      target.classList.contains("config-input") ||
      target.classList.contains("stepper-input")
    ) {
      const stepper = target.closest(".ui-stepper");
      const key = target.dataset.key || stepper?.dataset.key;
      if (!key) return;

      const playerCount = getPlayers ? getPlayers().length : 0;
      const config = getEffectiveConfig(key, playerCount);
      const min = config?.min ?? 1;
      const max = config?.max ?? 99;
      let newVal = parseInt(target.value, 10);
      if (isNaN(newVal)) newVal = min;

      if (key === "courts" && newVal > max) {
        showAlertModal(
          "Too many courts",
          `You need at least ${
            newVal * 4
          } players to use ${newVal} courts. With ${playerCount} players, you can have a maximum of ${max} courts.`
        );
      }

      const clamped = Math.min(max, Math.max(min, newVal));
      callbacks.onUpdate(key, clamped);
    }
  });

  // Click Events
  container.addEventListener("click", (e) => {
    // 0. Stepper Interaction
    const stepBtn = e.target.closest(".stepper-btn");
    if (stepBtn) {
      const stepper = stepBtn.closest(".ui-stepper");
      const key = stepper?.dataset.key;
      if (!key) return;

      const playerCount = getPlayers ? getPlayers().length : 0;
      const config = getEffectiveConfig(key, playerCount);
      const delta = parseInt(stepBtn.dataset.delta, 10) || 0;

      const min = config?.min ?? 1;
      const max = config?.max ?? 99;

      const state = getState();
      const current = parseInt(state[key], 10);

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

      if (next !== current) callbacks.onUpdate(key, next);
      return;
    }

    // 0.1 Toggle Interaction
    const toggle = e.target.closest(".ui-toggle");
    if (toggle && !toggle.classList.contains("disabled")) {
      const key = toggle.dataset.key;
      const state = getState();
      const newVal = !state[key];
      callbacks.onUpdate(key, newVal);
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

      let parsedVal = val;
      if (
        key === "courts" ||
        key === "maxRepeats" ||
        key === "pointsPerMatch"
      ) {
        if (!isNaN(val) && val.trim() !== "") parsedVal = parseInt(val);
      }

      callbacks.onUpdate(key, parsedVal);
    }

    // Buttons
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;

    if (action === "show-help") {
      if (callbacks.onShowHelp) callbacks.onShowHelp(target.dataset.helpId);
    }

    if (action === "add-pair") {
      // Validation Logic
      const players = getPlayers ? getPlayers() : [];
      const state = getState();

      const pairedPlayerIds = new Set();
      if (state.preferredPartners) {
        state.preferredPartners.forEach((pair) => {
          pairedPlayerIds.add(String(pair.player1Id));
          pairedPlayerIds.add(String(pair.player2Id));
        });
      }
      const availableCount = players.filter(
        (p) => !pairedPlayerIds.has(String(p.id))
      ).length;

      if (availableCount < 2) {
        showToast("Not enough available players to form a pair", "error");
        return;
      }

      if (callbacks.onAddPair) callbacks.onAddPair();
    }

    if (action === "edit-pairs") {
      // Actually both open the same modal in previous implementation
      if (callbacks.onEditPairs) callbacks.onEditPairs();
    }
  });

  // Global Outside Click Handler (for dropdowns)
  // We can attach it to document. But beware of multiple attachments.
  // The caller can handle global setup, or we attach lazily?
  // Let's attach once.
  if (!document.body.dataset.configOutsideClickAttached) {
    document.addEventListener("click", handleOutsideClick);
    document.body.dataset.configOutsideClickAttached = "true";
  }
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
