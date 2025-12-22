// Modal Management Module
// Confirm, Input, Final standings, and Completion modals

import { launchConfetti } from "./confetti.js";

/**
 * Show a confirmation modal
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 * @param {string} confirmText - Confirm button text
 * @param {Function} onConfirm - Callback on confirm
 * @param {boolean} isDanger - Use danger styling for destructive actions
 */
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
  // Remove existing modal
  const existing = document.querySelector(".confirm-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "modal-overlay confirm-modal";
  modal.style.display = "flex";

  const btnClass = isDanger ? "btn btn-danger" : "btn btn-primary";

  modal.innerHTML = `
    <div class="modal" style="max-width: 400px; text-align: center;">
      <div class="modal-header">
        <h3>${title}</h3>
      </div>
      <div class="modal-body">
        <p>${message}</p>
      </div>
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
    </div>
  `;

  document.body.appendChild(modal);

  // Animate in (CSS starts with opacity: 0)
  setTimeout(() => modal.classList.add("visible"), 10);

  // Stop clicks inside modal from bubbling to overlay
  const innerModal = modal.querySelector(".modal");
  if (innerModal) {
    innerModal.addEventListener("click", (e) => e.stopPropagation());
  }

  const cancelBtn = modal.querySelector("#modalCancelBtn");
  const confirmBtn = modal.querySelector("#modalConfirmBtn");
  const secondaryBtn = modal.querySelector("#modalSecondaryBtn");

  const close = () => modal.remove();

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

  // Click outside (on overlay) to dismiss
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
}

/**
 * Show an input modal
 * @param {string} title - Modal title
 * @param {string} placeholder - Input placeholder
 * @param {Function} onConfirm - Callback with input value
 */
export function showInputModal(title, placeholder, onConfirm) {
  // Remove existing modal
  const existing = document.querySelector(".input-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "modal-overlay input-modal";
  modal.style.display = "flex";

  modal.innerHTML = `
    <div class="modal" style="max-width: 400px; text-align: center;">
      <div class="modal-header">
        <h3>${title}</h3>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <input type="text" id="modalInput" class="form-input" placeholder="${placeholder}" style="width: 100%;">
        </div>
      </div>
      <div class="modal-footer" style="justify-content: center; gap: 10px;">
        <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
        <button class="btn btn-primary" id="modalConfirmBtn">Add</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Animate in (CSS starts with opacity: 0)
  setTimeout(() => modal.classList.add("visible"), 10);

  const input = modal.querySelector("#modalInput");
  const cancelBtn = modal.querySelector("#modalCancelBtn");
  const confirmBtn = modal.querySelector("#modalConfirmBtn");

  const close = () => modal.remove();

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
        <button class="btn btn-secondary" onclick="window.shareResults()">Share</button>
        <button class="btn btn-secondary" onclick="window.exportTournamentData()">Download CSV</button>
        <button class="btn btn-primary" onclick="window.closeFinalModal()">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Launch confetti celebration
  launchConfetti();

  // Animate in
  setTimeout(() => modal.classList.add("visible"), 10);
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
  // Remove existing modal
  const existing = document.querySelector(".alert-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "modal-overlay alert-modal";
  modal.style.display = "flex";

  modal.innerHTML = `
    <div class="modal" style="max-width: 400px; text-align: center;">
      <div class="modal-header">
        <h3>${title}</h3>
      </div>
      <div class="modal-body">
        <p>${message}</p>
      </div>
      <div class="modal-footer" style="justify-content: center;">
        <button class="btn btn-primary" id="modalOkBtn">OK</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Animate in
  setTimeout(() => modal.classList.add("visible"), 10);

  const innerModal = modal.querySelector(".modal");
  if (innerModal) {
    innerModal.addEventListener("click", (e) => e.stopPropagation());
  }

  const okBtn = modal.querySelector("#modalOkBtn");

  const close = () => {
    modal.remove();
    if (onDismiss) onDismiss();
  };

  if (okBtn) {
    okBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      close();
    });
  }

  // Click outside to dismiss
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  // Click outside to dismiss
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
}

/**
 * Show a rich info modal with HTML content
 * @param {string} title - Modal title
 * @param {string} htmlContent - HTML content to display
 */
export function showInfoModal(title, htmlContent) {
  // Remove existing modal
  const existing = document.querySelector(".info-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "modal-overlay info-modal";
  modal.style.display = "flex";

  modal.innerHTML = `
    <div class="modal" style="max-width: 500px; text-align: left;">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="close-modal" id="modalCloseX" style="background:none; border:none; cursor:pointer; font-size:1.5rem; color:var(--text-muted);">&times;</button>
      </div>
      <div class="modal-body" style="font-size: 0.95rem; line-height: 1.6;">
        ${htmlContent}
      </div>
      <div class="modal-footer" style="justify-content: flex-end;">
        <button class="btn btn-primary btn-sm" id="modalOkBtn">Got it</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Animate in
  setTimeout(() => modal.classList.add("visible"), 10);

  const innerModal = modal.querySelector(".modal");
  if (innerModal) {
    innerModal.addEventListener("click", (e) => e.stopPropagation());
  }

  const okBtn = modal.querySelector("#modalOkBtn");
  const closeX = modal.querySelector("#modalCloseX");

  const close = () => modal.remove();

  if (okBtn) okBtn.onclick = close;
  if (closeX) closeX.onclick = close;

  // Click outside to dismiss
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
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

// Global registration for onclick handlers
window.closeFinalModal = closeFinalModal;
