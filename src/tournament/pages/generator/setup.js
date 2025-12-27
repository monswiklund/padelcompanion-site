import { PageHeader } from "../../ui/components/PageHeader.js";
import { PlayerManager } from "../../ui/components/PlayerManager.js";
import { SettingsCard } from "../../ui/components/SettingsCard.js";
import { renderTournamentConfig } from "../../ui/tournamentConfig.js";
import { state, saveState } from "../../core/state.js";
import {
  addPlayer,
  removeAllPlayers,
  importPlayers,
  removePlayer,
} from "../../players.js";
import { showToast } from "../../../shared/utils.js";
import { showInputModal, showConfirmModal } from "../../core/modals.js";
import { renderPreferredPartners } from "../../ui/index.js";

/**
 * Render the setup form for Generator (Americano/Mexicano).
 *
 * @param {HTMLElement} container - The container to render into
 * @param {Function} onGenerate - Callback when generate button is clicked
 */
export function renderSetup(container, onGenerate) {
  if (!container) return;

  // --- 1. Page Header ---
  const headerHtml = PageHeader({
    title: "Americano Setup",
    subtitle: "Add players and configure your tournament settings.",
    actionId: "generatorHelpBtn",
    actionIcon: "?",
  });

  // --- 2. Player Manager ---
  const items = state.players || [];

  const playerManagerHtml = PlayerManager({
    items: items,
    mode: "players",
    inputId: "genNameInput",
    addBtnId: "genAddBtn",
    importBtnId: "genImportBtn",
    clearBtnId: "genClearBtn",
    listId: "genPlayerList",
    toggleBtnId: "genTogglePlayersBtn",
    hintId: "genPlayersHint",
    renderItem: (item, i) => {
      const courtOptions = ['<option value="">Auto</option>'];
      const courts = state.courts || 1;

      // Current lock value
      const currentLock = item.lockedCourt || "";

      for (let c = 1; c <= courts; c++) {
        const selected = currentLock === c ? "selected" : "";
        courtOptions.push(
          `<option value="${c}" ${selected}>Court ${c}</option>`
        );
      }

      return `
            <li class="player-item slide-in-up" data-index="${i}" style="display: flex; align-items: center; gap: 8px;">
                <span class="player-number" style="color: var(--text-muted); font-size: 0.8rem; width: 20px;">${
                  i + 1
                }.</span>
                <span class="player-name text-truncate" style="flex: 1; font-weight: 500;">${
                  item.name
                }</span>
                
                <select class="form-select btn-sm court-lock-select" 
                        data-index="${i}" 
                        style="width: 80px; padding: 2px 4px; font-size: 0.8rem; border-color: var(--border-color); background: var(--bg-surface);">
                    ${courtOptions.join("")}
                </select>
                
                <button class="player-remove" data-index="${i}" title="Remove" style="color: var(--text-muted); padding: 4px;">×</button>
            </li>
        `;
    },
    hintText: getGeneratorHint(items.length),
  });

  // --- 3. Settings (Tournament Config) ---
  const settingsContent = `
    <div id="tournamentConfig" class="config-panel-wrapper">
      <!-- Config injected here -->
    </div>
    <div id="preferredPartnersSection" style="margin-top: 16px;">
       <div id="preferredPartnersList" class="preferred-partners-list"></div>
       <div style="text-align: center; margin-top: 10px;">
         <button id="addPartnerPairBtn" class="btn btn-secondary btn-sm" style="display: none;">Add Fixed Pair</button>
       </div>
    </div>
  `;

  const settingsCardHtml = SettingsCard({
    content: settingsContent,
  });

  // --- 4. Main Actions ---
  const mainActionsHtml = `
    <button class="btn btn-primary btn-lg" id="genStartBtn" ${
      items.length < 4 ? "disabled" : ""
    } style="display: block; margin: 0 auto; margin-top: 24px;">Generate Schedule</button>
  `;

  // Render Structure
  container.innerHTML = `
    <div class="tournament-setup-view generator-setup">
      ${headerHtml}
      ${SettingsCard({ content: playerManagerHtml })}
      ${settingsCardHtml}
      ${mainActionsHtml}
    </div>
  `;

  // Init Config & Partners
  renderTournamentConfig();
  renderPreferredPartners();

  // Show/Hide Add Pair Button logic is handled in partners.js usually,
  // but we might need to ensure the ID "addPartnerPairBtn" exists if partners.js uses it.
  // It is included in settingsContent above.

  attachSetupListeners(container, onGenerate);
}

function getGeneratorHint(count) {
  if (count < 4) {
    return `Add at least ${4 - count} more players`;
  }
  const courts = state.courts || 1;
  const capacity = courts * 4;
  const isMultipleOf4 = count % 4 === 0;

  if (count > capacity) {
    return `<span style="color: var(--warning)">${count} ready | ${courts} courts (${capacity} playing +${
      count - capacity
    } waiting)</span>`;
  }
  if (!isMultipleOf4) {
    return `<span style="color: var(--warning)">${count} ready (Queue enabled)</span>`;
  }
  return `<span style="color: var(--success)">${count} players ready (${courts} courts)</span>`;
}

function attachSetupListeners(container, onGenerate) {
  const input = container.querySelector("#genNameInput");
  const addBtn = container.querySelector("#genAddBtn");
  const importBtn = container.querySelector("#genImportBtn");
  const clearBtn = container.querySelector("#genClearBtn");
  const startBtn = container.querySelector("#genStartBtn");
  const list = container.querySelector("#genPlayerList");

  // Add Player
  const handleAdd = () => {
    const val = input.value.trim();
    if (!val) return;
    if (addPlayer(val)) {
      input.value = "";
      renderSetup(container, onGenerate); // Re-render
      container.querySelector("#genNameInput").focus();
      showToast(`${val} added`, "success");
    }
  };

  addBtn?.addEventListener("click", handleAdd);
  input?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleAdd();
  });

  // Import
  importBtn?.addEventListener("click", () => {
    showInputModal(
      "Import Players",
      "",
      (text) => {
        const res = importPlayers(text);
        if (res.added > 0) {
          renderSetup(container, onGenerate);
          showToast(`Imported ${res.added} players`, "success");
        }
      },
      "Enter names, one per line."
    );
  });

  // Clear
  clearBtn?.addEventListener("click", () => {
    showConfirmModal(
      "Clear All?",
      "Remove all players?",
      "Clear",
      () => {
        removeAllPlayers(() => {
          renderSetup(container, onGenerate);
          showToast("Cleared all players");
        });
      },
      true
    );
  });

  // Event Delegation for List Items
  list?.addEventListener("click", (e) => {
    // Remove
    if (e.target.classList.contains("player-remove")) {
      const idx = parseInt(e.target.dataset.index);
      const player = state.players[idx];
      if (player) {
        removePlayer(player.id);
        renderSetup(container, onGenerate);
      }
    }
  });

  // Court Lock Change
  list?.addEventListener("change", (e) => {
    if (e.target.classList.contains("court-lock-select")) {
      const idx = parseInt(e.target.dataset.index);
      const val = e.target.value;
      const player = state.players[idx];
      if (player) {
        player.lockedCourt = val === "" ? null : parseInt(val);
        saveState();
        // Might need to update validation hint
        const hintEl = container.querySelector("#genPlayersHint");
        if (hintEl) hintEl.innerHTML = getGeneratorHint(state.players.length);
      }
    }
  });

  // Generate
  startBtn?.addEventListener("click", () => {
    if (onGenerate) onGenerate();
  });

  // Help Putton (in Header)
  const helpBtn = container.querySelector("#generatorHelpBtn");
  if (helpBtn) {
    helpBtn.addEventListener("click", () => {
      // Dispatch to global help handler or show modal directly?
      // index.js used helper. Let's trigger a custom event or click the old hidden help button if it exists?
      // Simplest: Show info modal directly.
      // Import HELP constant?
      // Let's assume user knows context. Or show simple help.
      import("../../content/help.js").then((m) => {
        showConfirmModal(
          "Americano Helper",
          m.HELP_AMERICANO || "Add players and click Generate.",
          "Got it",
          null,
          false
        );
      });
    });
  }
}
