// Modal Management Module
// Confirm, Input, Final standings, and Completion modals

import { launchConfetti } from "../confetti.js";
import {
  createModal,
  animateIn,
  buildHeader,
  buildBody,
  buildFooter,
} from "./modalBase.js";

/**
 * Show a confirmation modal
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 * @param {string} confirmText - Confirm button text
 * @param {Function} onConfirm - Callback on confirm
 * @param {boolean} isDanger - Use danger styling for destructive actions
 * @param {string} secondaryText - Optional secondary action text
 * @param {Function} onSecondary - Optional callback for secondary action
 */
export function showConfirmModal(
  title,
  message,
  confirmText = "Confirm",
  onConfirm,
  isDanger = false,
  secondaryText = null,
  onSecondary = null
) {
  const { overlay, innerModal, close } = createModal({
    className: "confirm-modal",
    maxWidth: "400px",
  });

  const btnClass = isDanger ? "btn btn-danger" : "btn btn-primary";

  innerModal.style.textAlign = "center";
  innerModal.innerHTML = `
    ${buildHeader(title)}
    ${buildBody(`<p>${message}</p>`)}
    <div class="modal-footer" style="flex-direction: column; gap: 12px;">
      <div class="modal-actions-row" style="display: flex; gap: 10px; width: 100%;">
        ${
          secondaryText
            ? `<button class="btn btn-outline" id="modalSecondaryBtn" style="flex: 1;">${secondaryText}</button>`
            : ""
        }
        <button class="${btnClass}" id="modalConfirmBtn" style="flex: 1;">${confirmText}</button>
      </div>
      <button class="btn btn-secondary" id="modalCancelBtn" style="width: 100%;">Cancel</button>
    </div>
  `;

  animateIn(overlay);

  const cancelBtn = innerModal.querySelector("#modalCancelBtn");
  const confirmBtn = innerModal.querySelector("#modalConfirmBtn");
  const secondaryBtn = innerModal.querySelector("#modalSecondaryBtn");

  if (cancelBtn) {
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      close();
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      close();
      onConfirm();
    });
  }

  if (secondaryBtn && onSecondary) {
    secondaryBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      close();
      onSecondary();
    });
  }
}

/**
 * Show an input modal
 * @param {string} title - Modal title
 * @param {string} placeholder - Input placeholder
 * @param {Function} onConfirm - Callback with input value
 * @param {string} [description] - Optional description text to display above the input
 * @param {string} [inputType] - 'text' or 'textarea'
 */
export function showInputModal(
  title,
  placeholder,
  onConfirm,
  description = "",
  inputType = "text"
) {
  const { overlay, innerModal, close } = createModal({
    className: "input-modal",
    maxWidth: "400px",
    dismissOnEscape: false, // We handle escape separately for input
  });

  const descriptionHtml = description
    ? `<p class="modal-hint" style="margin-bottom: var(--space-md); text-align: left;">${description}</p>`
    : "";

  const inputHtml =
    inputType === "textarea"
      ? `<textarea id="modalInput" class="form-input" placeholder="${placeholder}" style="width: 100%; min-height: 120px; resize: vertical;"></textarea>`
      : `<input type="text" id="modalInput" class="form-input" placeholder="${placeholder}" style="width: 100%;">`;

  innerModal.style.textAlign = "center";
  innerModal.innerHTML = `
    ${buildHeader(title)}
    <div class="modal-body">
      ${descriptionHtml}
      <div class="form-group">
        ${inputHtml}
      </div>
    </div>
    ${buildFooter(
      `<button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
       <button class="btn btn-primary" id="modalConfirmBtn">Add</button>`,
      { "justify-content": "center", gap: "10px" }
    )}
  `;

  animateIn(overlay);

  const input = innerModal.querySelector("#modalInput");
  const cancelBtn = innerModal.querySelector("#modalCancelBtn");
  const confirmBtn = innerModal.querySelector("#modalConfirmBtn");

  cancelBtn.onclick = close;

  const submit = () => {
    const val = input.value;
    if (val && val.trim()) {
      close();
      onConfirm(val.trim());
    }
  };

  confirmBtn.onclick = submit;
  input.onkeydown = (e) => {
    if (e.key === "Enter") submit();
    if (e.key === "Escape") close();
  };

  setTimeout(() => input.focus(), 100);
}

/**
 * Show final tournament standings
 * @param {Array} standings - Sorted array of players
 */
export function showFinalStandings(standings) {
  // Remove existing modal
  const existing = document.querySelector(".final-modal");
  if (existing) existing.remove();

  const medal = (i) =>
    i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;

  const modal = document.createElement("div");
  modal.className = "final-modal";
  modal.innerHTML = `
    <div class="final-modal-content">
      <h2>Tournament Complete!</h2>
      <div class="final-standings">
        ${standings
          .map(
            (p, i) => `
          <div class="final-standing-row ${i < 3 ? "top-three" : ""}">
            <span class="medal">${medal(i)}</span>
            <span class="name">${p.name}</span>
            <span class="stats">${p.points} pts · ${p.played} games</span>
          </div>
        `
          )
          .join("")}
      </div>
      <div class="modal-actions-row" style="margin-top: 20px; gap: 10px; display: flex; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-secondary" data-action="share-results">Share</button>
        <button class="btn btn-secondary" data-action="export-data">Download CSV</button>
        <button class="btn btn-primary" data-action="close-final-modal">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Launch confetti celebration
  launchConfetti();

  // Animate in
  setTimeout(() => modal.classList.add("visible"), 10);

  // Handle close button via delegation
  modal.addEventListener("click", (e) => {
    if (e.target.closest('[data-action="close-final-modal"]')) {
      closeFinalModal();
    }
  });
}

/**
 * Close final standings modal
 */
export function closeFinalModal() {
  const modal = document.querySelector(".final-modal");
  if (modal) {
    modal.classList.remove("visible");
    setTimeout(() => {
      modal.remove();
      // Scroll to leaderboard after closing
      const leaderboard = document.getElementById("leaderboardSection");
      if (leaderboard) {
        leaderboard.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  }
}

/**
 * Show a simple alert modal
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 * @param {Function} onDismiss - Optional callback on dismiss
 */
export function showAlertModal(title, message, onDismiss) {
  const { overlay, innerModal, close } = createModal({
    className: "alert-modal",
    maxWidth: "400px",
    onClose: onDismiss,
  });

  innerModal.style.textAlign = "center";
  innerModal.innerHTML = `
    ${buildHeader(title)}
    ${buildBody(`<p>${message}</p>`)}
    ${buildFooter(
      `<button class="btn btn-primary" id="modalOkBtn">OK</button>`,
      { "justify-content": "center" }
    )}
  `;

  animateIn(overlay);

  const okBtn = innerModal.querySelector("#modalOkBtn");
  if (okBtn) {
    okBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      close();
    });
  }
}

/**
 * Show a rich info modal with HTML content
 * @param {string} title - Modal title
 * @param {string} htmlContent - HTML content to display
 */
export function showInfoModal(title, htmlContent) {
  const { overlay, innerModal, close } = createModal({
    className: "info-modal",
    maxWidth: "500px",
  });

  innerModal.style.textAlign = "left";
  innerModal.innerHTML = `
    ${buildHeader(title, true)}
    <div class="modal-body" style="font-size: 0.95rem; line-height: 1.6;">
      ${htmlContent}
    </div>
    ${buildFooter(
      `<button class="btn btn-primary btn-sm" id="modalOkBtn">Got it</button>`,
      { "justify-content": "flex-end" }
    )}
  `;

  animateIn(overlay);

  const okBtn = innerModal.querySelector("#modalOkBtn");
  const closeX = innerModal.querySelector(".modal-close-x");

  if (okBtn) okBtn.onclick = close;
  if (closeX) closeX.onclick = close;
}

/**
 * Show a countdown overlay (3-2-1-GO!)
 * @returns {Promise} Resolves when countdown is complete
 */
export function showCountdown() {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "countdown-overlay";
    overlay.innerHTML = '<div class="countdown-number">3</div>';
    overlay.style.cursor = "pointer";
    document.body.appendChild(overlay);

    let skipped = false;
    let timeoutId = null;

    // Skip countdown on click
    const skipCountdown = () => {
      if (skipped) return;
      skipped = true;
      if (timeoutId) clearTimeout(timeoutId);
      overlay.classList.remove("active");
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 100);
    };

    overlay.addEventListener("click", skipCountdown);

    // Activate overlay
    requestAnimationFrame(() => {
      overlay.classList.add("active");
    });

    const numberEl = overlay.querySelector(".countdown-number");
    const sequence = ["3", "2", "1", "GO!"];
    let index = 0;

    const showNext = () => {
      if (skipped) return;

      if (index >= sequence.length) {
        // Fade out and cleanup
        overlay.classList.remove("active");
        setTimeout(() => {
          overlay.remove();
          resolve();
        }, 300);
        return;
      }

      const val = sequence[index];
      numberEl.textContent = val;
      numberEl.className =
        "countdown-number" + (val === "GO!" ? " countdown-go" : "");

      // Trigger animation reset
      numberEl.style.animation = "none";
      requestAnimationFrame(() => {
        numberEl.style.animation = "";
      });

      index++;
      timeoutId = setTimeout(showNext, val === "GO!" ? 600 : 800);
    };

    // Start after brief delay
    timeoutId = setTimeout(showNext, 100);
  });
}
