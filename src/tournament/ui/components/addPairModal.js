/**
 * Add Pair Modal Component
 * Handles the UI for managing fixed pairs (preferred partners).
 */

import { state, saveState } from "../../state.js";
import { createId } from "../../../shared/utils.js";
import { removePreferredPair } from "../../players.js";

/**
 * Open modal to add/edit fixed pairs with Custom UI
 * @param {Function} onUpdate - Callback to trigger re-render of parent component
 */
export function openAddPairModal(onUpdate) {
  state.preferredPartners ||= [];
  const container = document.createElement("div");
  container.className = "modal-overlay active";
  container.style.display = "flex";

  // Helpers for type-safe comparisons
  const sameId = (a, b) => String(a) === String(b);
  const findPairByRawId = (raw) =>
    state.preferredPartners.find((p) => sameId(p.id, raw));
  const findPlayerByRawId = (raw) =>
    state.players.find((p) => sameId(p.id, raw));

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
      if (onUpdate) onUpdate();
    }

    // Remove Pair
    const removeBtn = e.target.closest(".pair-remove-icon");
    if (removeBtn) {
      const raw = removeBtn.dataset.remove;
      const pair = findPairByRawId(raw);
      if (pair) {
        removePreferredPair(pair.id);
        updateUI();
        if (onUpdate) onUpdate();
      }
    }
  });
}
