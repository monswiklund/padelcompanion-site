import { injectLayout } from "../shared/layout.js";
import { state, loadState, saveState, undoLastAction } from "./state.js";
import { initHistory } from "./history.js";
import { initTheme, toggleTheme, updateThemeIcon } from "../shared/theme.js";
import { showToast } from "../shared/utils.js";
import {
  addPlayer,
  removePlayer,
  removeAllPlayers,
  importPlayers as importPlayersData,
  addLatePlayer,
  addPreferredPair,
  removePreferredPair,
  updatePreferredPair,
  getAvailablePlayersForPairing,
} from "./players.js";
import {
  showInputModal,
  showFinalStandings,
  showConfirmModal,
  showInfoModal,
} from "./modals.js";
import {
  initElements,
  getElements,
  renderPlayers,
  renderSchedule,
  renderLeaderboard,
  renderPreferredPartners,
  showPlayerInput,
  hidePlayerInput,
  showImportModal,
  hideImportModal,
  toggleCustomCourtNames,
  renderCustomCourtNames,
  updateCustomCourtName,
  updateSetupUI,
  updateScoringLabel,
  togglePlayerList,
  autoFillScore,
  toggleManualBye,
  toggleRoundCollapse,
  completeRound,
  editRound,
  generateSchedule,
  resetSchedule,
  toggleLeaderboardVisibility,
  togglePositionChanges,
  updateRankingCriteria,
  endTournament,
  onSliderManualChange,
  handleResize,
  updateGridColumns,
  updateTextSize,
  validateCourts,
  updateRoundScale,
  toggleToolbar,
  exportTournamentData,
  shareResults,
  setupCustomSelects,
} from "./ui/index.js";
import { initPWA } from "../shared/pwa.js";

// ===== Initialize Application =====
function init() {
  injectLayout({ activeLink: "tournament" });

  // Initialize PWA
  initPWA("installBtn", () => {
    showInfoModal(
      "Install App on iPhone",
      `
      <div style="text-align: center;">
        <p style="margin-bottom: 20px;">To install <strong>Tournament - Padel Companion</strong> as an app on your Home Screen:</p>
        <ol style="text-align: left; padding-left: 20px; line-height: 1.6;">
          <li style="margin-bottom: 12px;">Tap the <strong>Share</strong> button <span style="font-size: 1.2em">⎋</span> (square with arrow) at the bottom in Safari.</li>
          <li style="margin-bottom: 12px;">Scroll down and tap <strong>Add to Home Screen</strong> <span style="font-size: 1.2em">⊞</span>.</li>
          <li>Tap <strong>Add</strong> in the top right corner.</li>
        </ol>
      </div>
      `
    );
  });

  // Initialize theme
  const theme = initTheme();

  // Initialize DOM elements
  const elements = initElements();

  // Update theme icon
  updateThemeIcon(elements.themeToggle, theme);

  // Load saved state
  const hasState = loadState();

  // Sync UI with state
  elements.format.value = state.format;
  elements.courts.value = state.courts;
  elements.scoringMode.value = state.scoringMode;
  elements.points.value = state.pointsPerMatch;
  elements.courtFormat.value = state.courtFormat;
  elements.maxRepeats.value = state.maxRepeats;
  if (elements.pairingStrategy) {
    elements.pairingStrategy.value = state.pairingStrategy;
  }

  const rankingCriteriaSelect = document.getElementById("rankingCriteria");
  if (rankingCriteriaSelect) {
    rankingCriteriaSelect.value = state.rankingCriteria;
  }

  const strictStrategy = document.getElementById("strictStrategy");
  if (strictStrategy) {
    strictStrategy.checked = state.strictStrategy || false;
  }

  toggleCustomCourtNames();
  renderPlayers();

  // Restore active tournament if exists
  if (state.schedule.length > 0) {
    elements.scheduleSection.style.display = "block";
    elements.leaderboardSection.style.display = "block";
    const actionsSection = document.getElementById("tournamentActionsSection");
    if (actionsSection) actionsSection.style.display = "block";
    renderSchedule();
    renderLeaderboard();
    updateGridColumns();
  }

  // Initialize event listeners
  initEventListeners(elements);

  // Initialize Custom Selects (must be after values are set and listeners are ready)
  setupCustomSelects();

  // Initialize event delegation for dynamic content
  initEventDelegation();

  // Initialize History
  initHistory();

  // Setup resize handler
  window.addEventListener("resize", handleResize);

  // Setup scroll-to-top button
  initScrollToTop();

  // Initial UI Sync
  updateSetupUI();
  updateScoringLabel();

  // Initialize scroll animations
  initScrollAnimations();
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    ".section-title, .card-header-basic h3, .card-header-advanced h3, .leaderboard-header h3, .players-header h3"
  );

  // Immediately animate elements visible on load
  targets.forEach((el) => el.classList.add("animate-in"));

  // Also watch for new elements coming into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    },
    { threshold: 0.1 }
  );

  targets.forEach((el) => observer.observe(el));
}

// ===== Scroll to Top =====
function initScrollToTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===== Event Listeners =====
function initEventListeners(elements) {
  // Theme toggle
  elements.themeToggle.addEventListener("click", () => {
    const newTheme = toggleTheme();
    updateThemeIcon(elements.themeToggle, newTheme);
  });

  // Mobile Nav Toggle
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      navToggle.classList.toggle("active");
    });

    // Close on click outside or on link click
    document.addEventListener("click", (e) => {
      if (
        nav.classList.contains("open") &&
        !nav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        nav.classList.remove("open");
        navToggle.classList.remove("active");
      }
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.classList.remove("active");
      });
    });
  }

  // Undo Action
  const undoBtn = document.getElementById("undoBtn");
  if (undoBtn) {
    undoBtn.addEventListener("click", () => {
      if (undoLastAction()) {
        showToast("Undo successful");

        // Refresh UI
        elements.format.value = state.format;
        renderPlayers();
        renderSchedule();
        renderLeaderboard();
        updateSetupUI();
        updateGridColumns();

        // Toggle sections based on schedule
        if (state.schedule.length > 0) {
          elements.scheduleSection.style.display = "block";
          elements.leaderboardSection.style.display = "block";
          const actions = document.getElementById("tournamentActionsSection");
          if (actions) actions.style.display = "block";
        } else {
          elements.scheduleSection.style.display = "none";
          elements.leaderboardSection.style.display = "none";
          const actions = document.getElementById("tournamentActionsSection");
          if (actions) actions.style.display = "none";
        }
      }
    });

    // Keyboard Shortcut (Ctrl/Cmd + Z)
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undoBtn.click();
      }
    });
  }

  // Player management
  elements.addPlayerBtn.addEventListener("click", showPlayerInput);
  elements.cancelAddBtn.addEventListener("click", hidePlayerInput);

  if (elements.clearAllPlayersBtn) {
    elements.clearAllPlayersBtn.addEventListener("click", () => {
      removeAllPlayers(() => {
        renderPlayers();
        renderPreferredPartners();
        updateSetupUI();
      });
    });
  }

  // Bulk Import
  elements.importPlayersBtn.addEventListener("click", showImportModal);
  elements.closeImportModal.addEventListener("click", hideImportModal);
  elements.cancelImportBtn.addEventListener("click", hideImportModal);
  elements.confirmImportBtn.addEventListener("click", () => {
    const text = elements.importTextarea.value;
    const result = importPlayersData(text);

    let statusMsg = `Added ${result.added} players.`;
    if (result.duplicates > 0)
      statusMsg += ` Skipped ${result.duplicates} duplicates.`;
    if (result.hitLimit) statusMsg += ` Stopped at 24 max limit.`;

    elements.importStatus.textContent = statusMsg;
    renderPlayers();

    if (result.added > 0 && result.duplicates === 0 && !result.hitLimit) {
      setTimeout(hideImportModal, 1500);
      showToast(`Imported ${result.added} players`);
    }
  });

  elements.confirmAddBtn.addEventListener("click", () => {
    if (addPlayer(elements.playerNameInput.value)) {
      elements.playerNameInput.value = "";
      elements.playerNameInput.focus();
      renderPlayers();
    }
  });

  elements.playerNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (addPlayer(elements.playerNameInput.value)) {
        elements.playerNameInput.value = "";
        renderPlayers();
      }
    } else if (e.key === "Escape") {
      hidePlayerInput();
    }
  });

  // Form changes
  elements.format.addEventListener("change", () => {
    state.format = elements.format.value;
    updateSetupUI();
    saveState();
  });

  elements.courts.addEventListener("change", () => {
    state.courts = parseInt(elements.courts.value);
    saveState();
  });

  elements.points.addEventListener("change", () => {
    state.pointsPerMatch = parseInt(elements.points.value);
    saveState();
    if (state.schedule.length > 0) {
      renderSchedule();
    }
  });

  elements.scoringMode.addEventListener("change", () => {
    state.scoringMode = elements.scoringMode.value;
    updateScoringLabel();
    saveState();
    if (state.schedule.length > 0) {
      renderSchedule();
    }
  });

  const rankingCriteriaSelect = document.getElementById("rankingCriteria");
  if (rankingCriteriaSelect) {
    rankingCriteriaSelect.addEventListener("change", () => {
      state.rankingCriteria = rankingCriteriaSelect.value;
      updateRankingCriteria();
      saveState();
    });
  }

  elements.courtFormat.addEventListener("change", () => {
    state.courtFormat = elements.courtFormat.value;
    toggleCustomCourtNames();
    saveState();
  });

  elements.courts.addEventListener("input", () => {
    const MAX_COURTS = 50;
    const rawVal = elements.courts.value;

    // Allow empty input while typing
    if (rawVal === "") return;

    let val = parseInt(rawVal) || 1;
    val = Math.max(1, Math.min(MAX_COURTS, val));
    elements.courts.value = val;
    state.courts = val;
    saveState();
    if (state.courtFormat === "custom") {
      renderCustomCourtNames();
    }
  });

  // Matchup settings (always enabled, with confirmation during tournament)
  elements.maxRepeats.addEventListener("change", (e) => {
    const newValue = parseInt(e.target.value);
    const oldValue = state.maxRepeats;

    if (state.isLocked) {
      // Revert visually first
      e.target.value = oldValue;

      showConfirmModal(
        "Change Matchup Setting?",
        "The tournament is running. This change will affect how future rounds are generated.",
        "Apply Change",
        () => {
          state.maxRepeats = newValue;
          elements.maxRepeats.value = newValue;
          saveState();
          showToast("Max Partner Repeats updated");
        }
      );
    } else {
      state.maxRepeats = newValue;
      saveState();
    }
  });

  const strictStrategy = document.getElementById("strictStrategy");
  if (strictStrategy) {
    strictStrategy.addEventListener("change", (e) => {
      const newValue = e.target.checked;
      const oldValue = state.strictStrategy;

      if (state.isLocked) {
        e.target.checked = !!oldValue; // Revert
        showConfirmModal(
          "Update Strict Mode?",
          "The tournament is running. This change will affect how future rounds are generated.",
          "Apply Change",
          () => {
            state.strictStrategy = newValue;
            strictStrategy.checked = newValue;
            saveState();
            showToast("Strict Mode updated");
          }
        );
      } else {
        state.strictStrategy = newValue;
        saveState();
      }
    });
  }

  if (elements.pairingStrategy) {
    elements.pairingStrategy.addEventListener("change", (e) => {
      const newValue = e.target.value;
      const oldValue = state.pairingStrategy;

      if (state.isLocked) {
        // Revert visually first
        e.target.value = oldValue;

        showConfirmModal(
          "Change Matchup Setting?",
          "The tournament is running. This change will affect how future rounds are generated.",
          "Apply Change",
          () => {
            state.pairingStrategy = newValue;
            elements.pairingStrategy.value = newValue;
            // Reset strictStrategy when switching to optimal
            if (newValue === "optimal") {
              state.strictStrategy = false;
              const strictCheckbox = document.getElementById("strictStrategy");
              if (strictCheckbox) strictCheckbox.checked = false;
            }
            saveState();
            updateSetupUI(); // Update visibility of Strict toggle
            showToast("Pairing Strategy updated");
          }
        );
      } else {
        state.pairingStrategy = newValue;
        // Reset strictStrategy when switching to optimal
        if (newValue === "optimal") {
          state.strictStrategy = false;
          const strictCheckbox = document.getElementById("strictStrategy");
          if (strictCheckbox) strictCheckbox.checked = false;
        }
        saveState();
        updateSetupUI(); // Update visibility of Strict toggle
      }
    });
  }

  elements.addPartnerPairBtn.addEventListener("click", () => {
    addPreferredPair();
    renderPreferredPartners();
  });

  // Contextual Help
  const helpFormat = document.getElementById("helpFormat");
  if (helpFormat) {
    helpFormat.addEventListener("click", () => {
      showInfoModal(
        "Tournament Formats",
        `
        <ul style="padding-left: 20px; margin: 0; list-style: none;">
          <li style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Americano</div>
            <div style="margin-bottom: 8px;">Individual scoring. You rotate partner every round based on a fixed schedule.</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Very social – you play with everyone.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Skill gaps can lead to one-sided matches.</div>
            </div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
          <li style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Mexicano</div>
            <div style="margin-bottom: 8px;">Dynamic matchmaking. After each round, similar-ranked players face off.</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Competitive, exciting, close matches.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Less mixing – you play with fewer people overall.</div>
            </div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
          <li>
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Team Formats</div>
            <div style="margin-bottom: 8px;">Fixed partners throughout. Enter as a duo.</div>
             <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Play with your friend, build chemistry.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Need an even number of teams.</div>
            </div>
          </li>
        </ul>
        `
      );
    });
  }

  const helpScoring = document.getElementById("helpScoring");
  if (helpScoring) {
    helpScoring.addEventListener("click", () => {
      showInfoModal(
        "Scoring Modes",
        `
        <ul style="padding-left: 20px; margin: 0; list-style: none;">
          <li style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Total Points (e.g. 24)</div>
            <div style="margin-bottom: 8px;">Play all 24 points. Both teams score their actual points (e.g., 15-9).</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Every point matters, fixed duration.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Closing games can feel slow if one team is far ahead.</div>
            </div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
          <li style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Race (First to X)</div>
            <div style="margin-bottom: 8px;">First to X wins (e.g., first to 21). Winner gets X, loser keeps their score.</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Classic feel, dramatic comebacks possible.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Game length is unpredictable.</div>
            </div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
          <li>
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Timed (X minutes)</div>
            <div style="margin-bottom: 8px;">Play for a set time. Whoever has more points when time runs out wins.</div>
            <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> Perfect scheduling, maximize court time.</div>
               <div class="text-error"><strong>❌ Cons:</strong> Buzzer beaters can feel anticlimactic.</div>
            </div>
          </li>
        </ul>
        `
      );
    });
  }

  /* Matchup Rules Help */
  const helpMatchup = document.getElementById("helpMatchup");
  if (helpMatchup) {
    helpMatchup.addEventListener("click", () => {
      showInfoModal(
        "Matchup Rules",
        `
        <p style="margin-bottom: 20px;">Fine-tune how players are paired in <strong>Mexicano</strong> and <strong>Team Mexicano</strong>.</p>
        <ul style="padding-left: 20px; margin: 0; list-style: none;">
          <li style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Max Partner Repeats</div>
            <div style="margin-bottom: 8px;">Limits consecutive rounds with the same partner. Set to 0 to prevent back-to-back repeats.</div>
             <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
               <div class="text-success"><strong>✅ Pros:</strong> More variety, fairer mixing.</div>
               <div class="text-error"><strong>❌ Cons:</strong> May create slightly less balanced games.</div>
            </div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
          <li style="margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Pairing Strategy</div>
            <div style="margin-bottom: 8px;">How to form teams from the top 4 players each round.</div>
            <ul style="padding-left: 0; margin-top: 8px; list-style: none;">
              <li style="margin-bottom: 8px; padding-left: 12px; border-left: 2px solid var(--border-color);">
                <strong>Optimal (Recommended)</strong>
                <div style="font-size: 0.85em; margin-top: 2px;">Automatically picks the pairing that avoids the most partner repeats.</div>
              </li>
              <li style="margin-bottom: 8px; padding-left: 12px; border-left: 2px solid var(--border-color);">
                <strong>Standard (1&3 vs 2&4)</strong>
                <div style="font-size: 0.85em; margin-top: 2px;">Balanced and predictable. Classic Mexicano pattern.</div>
              </li>
            </ul>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 16px 0;">
          <li>
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Strict Pattern</div>
            <div style="margin-bottom: 8px; font-size: 0.9em;">What happens when a fixed strategy (e.g., Standard) conflicts with Max Repeats.</div>
             <div style="font-size: 0.9em; display: grid; grid-template-columns: 1fr; gap: 8px;">
               <div class="text-success"><strong>🔳 OFF (Smart):</strong> Automatically deviates from the pattern to avoid repeats.</div>
               <div class="text-error"><strong>✅ ON (Strict):</strong> Forces the pattern even if it causes repeating partners.</div>
            </div>
          </li>
        </ul>
        `
      );
    });
  }

  /* Leaderboard Help */
  const helpLeaderboard = document.getElementById("helpLeaderboard");
  if (helpLeaderboard) {
    helpLeaderboard.addEventListener("click", () => {
      showInfoModal(
        "Leaderboard",
        `
        <p style="margin-bottom: 20px;">Track player standings throughout the tournament. Rankings update after each completed round.</p>
        <ul style="padding-left: 20px; margin: 0; list-style: none;">
          <li style="margin-bottom: 12px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;"># (Rank)</div>
            <div style="font-size: 0.9em;">Current position based on the selected ranking criteria. Arrows indicate movement since last round.</div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 12px 0;">
          <li style="margin-bottom: 12px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Pts (Points)</div>
            <div style="font-size: 0.9em;">Total points scored across all matches. This is the default ranking criteria.</div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 12px 0;">
          <li style="margin-bottom: 12px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">W (Wins)</div>
            <div style="font-size: 0.9em;">Number of matches won.</div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 12px 0;">
          <li style="margin-bottom: 12px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Diff (Point Difference)</div>
            <div style="font-size: 0.9em;">Points scored minus points conceded. Positive = scoring more than you give up.</div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 12px 0;">
          <li style="margin-bottom: 12px;">
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">% (Win Rate)</div>
            <div style="font-size: 0.9em;">Percentage of matches won out of total matches played.</div>
          </li>
          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 12px 0;">
          <li>
            <div style="font-weight: 700; font-size: 1.1em; margin-bottom: 4px;">Pl (Played)</div>
            <div style="font-size: 0.9em;">Total number of matches played. Players on bye rounds are not counted.</div>
          </li>
        </ul>
        `
      );
    });
  }

  // Schedule actions
  elements.generateBtn.addEventListener("click", generateSchedule);
  elements.printBtn.addEventListener("click", () => window.print());
  elements.resetBtn.addEventListener("click", resetSchedule);

  // Grid columns slider
  if (elements.gridColumns) {
    elements.gridColumns.addEventListener("input", onSliderManualChange);
  }

  // Text size slider
  if (elements.textSize) {
    elements.textSize.addEventListener("input", () => {
      state.textSize = parseInt(elements.textSize.value);
      updateTextSize();
      saveState();
    });
  }

  // Factory/Emergency Reset
  const factoryResetBtn = document.getElementById("factoryResetBtn");
  if (factoryResetBtn) {
    factoryResetBtn.addEventListener("click", () => {
      showConfirmModal(
        "⚠️ Factory Reset",
        "This will clear the current tournament and reset the app. Your saved history will NOT be deleted. Are you sure?",
        "Yes, Reset App",
        () => {
          localStorage.removeItem("tournament-state");
          window.location.reload();
        },
        true // isDanger
      );
    });
  }

  // Round scale slider
  const roundScaleInput = document.getElementById("roundScale");
  if (roundScaleInput) {
    roundScaleInput.addEventListener("input", updateRoundScale);
  }
}

// ===== Event Delegation System =====
// Centralized event handling instead of window.* globals

/**
 * Initialize event delegation for dynamically rendered content
 */
function initEventDelegation() {
  // Click event delegation
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;
    const id = target.dataset.id ? parseInt(target.dataset.id) : null;
    const roundIndex = target.dataset.round
      ? parseInt(target.dataset.round)
      : null;

    switch (action) {
      case "remove-player":
        if (id !== null) {
          removePlayer(id);
          renderPlayers();
        }
        break;
      case "toggle-player-list":
        togglePlayerList();
        break;
      case "remove-pair":
        if (id !== null) {
          removePreferredPair(id);
          renderPreferredPartners();
        }
        break;
      case "toggle-bye":
        if (id !== null) {
          toggleManualBye(id);
        }
        break;
      case "toggle-round":
        if (roundIndex !== null) {
          toggleRoundCollapse(roundIndex);
        }
        break;
      case "complete-round":
        completeRound();
        break;
      case "edit-round":
        if (roundIndex !== null) {
          editRound(roundIndex);
        }
        break;
      case "toggle-visibility":
        toggleLeaderboardVisibility();
        break;
      case "toggle-position":
        togglePositionChanges();
        break;
      case "end-tournament":
        endTournament(showFinalStandings);
        break;
      case "toggle-toolbar":
        toggleToolbar();
        break;
      case "export-data":
        exportTournamentData();
        break;
      case "share-results":
        shareResults();
        break;
      case "add-late-player":
        promptAddLatePlayer();
        break;
    }
  });

  // Change event delegation for selects
  document.addEventListener("change", (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;
    const pairId = target.dataset.pairId
      ? parseInt(target.dataset.pairId)
      : null;
    const which = target.dataset.which ? parseInt(target.dataset.which) : null;

    if (action === "update-partner" && pairId !== null && which !== null) {
      updatePreferredPair(pairId, which, parseInt(target.value));
      renderPreferredPartners();
    }
  });

  // Input event delegation for score autofill
  document.addEventListener("input", (e) => {
    const target = e.target.closest("[data-action='autofill-score']");
    if (!target) return;

    const roundIndex = parseInt(target.dataset.round);
    const matchIndex = parseInt(target.dataset.match);
    const team = parseInt(target.dataset.team);
    autoFillScore(roundIndex, matchIndex, team, target.value);
  });
}

// Call in init
function promptAddLatePlayer() {
  const isTeam = state.format === "team" || state.format === "teamMexicano";
  showInputModal(
    isTeam ? "Add Late Team" : "Add Late Player",
    isTeam ? "Enter new team name:" : "Enter new player name:",
    (name) => {
      if (name && name.trim()) {
        if (state.format === "americano" || state.format === "team") {
          const confirmSwitch = confirm(
            "Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"
          );
          if (!confirmSwitch) return;
          state.format = "mexicano";
          state.allRounds = null;
          showToast("Switched to Mexicano format");
        }

        addLatePlayer(name.trim());

        const countSpan = document.getElementById("playerCount");
        if (countSpan) {
          countSpan.textContent = `(${state.players.length})`;
        }

        renderLeaderboard();
        showToast(`Added ${name.trim()} to tournament`);
      }
    }
  );
}

// ===== Legacy Window Functions (Backward Compatibility) =====
// Keep for onclick="" handlers until all HTML is migrated to data-action
window.removePlayer = (id) => {
  removePlayer(id);
  renderPlayers();
};
window.togglePlayerList = togglePlayerList;
window.updatePreferredPair = (pairId, which, playerId) => {
  updatePreferredPair(pairId, which, playerId);
  renderPreferredPartners();
};
window.removePreferredPair = (pairId) => {
  removePreferredPair(pairId);
  renderPreferredPartners();
};
window.updateCustomCourtName = updateCustomCourtName;
window.autoFillScore = autoFillScore;
window.toggleManualBye = toggleManualBye;
window.toggleRoundCollapse = toggleRoundCollapse;
window.completeRound = completeRound;
window.editRound = editRound;
window.toggleLeaderboardVisibility = toggleLeaderboardVisibility;
window.togglePositionChanges = togglePositionChanges;
window.updateRankingCriteria = updateRankingCriteria;
window.updateSetupUI = updateSetupUI;
window.endTournament = () => endTournament(showFinalStandings);
window.validateCourts = validateCourts;
window.toggleToolbar = toggleToolbar;
window.exportTournamentData = exportTournamentData;
window.shareResults = shareResults;
window.promptAddLatePlayer = promptAddLatePlayer;

// ===== Start Application =====
init();
