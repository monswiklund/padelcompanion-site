import { injectLayout } from "../shared/layout.js";
import { state, loadState, saveState, undoLastAction } from "./state.js";
import { initHistory } from "./history.js";
import { initTheme } from "../shared/theme.js";
import { registerRoute, initRouter, getCurrentRoute } from "./router.js";
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
  renderGameDetails,
  renderLeaderboard,
  renderPreferredPartners,
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
  renderTournamentSummary,
  renderTournamentConfig,
  setRenderTournamentConfigCallback,
} from "./ui/index.js";
import { initPWA } from "../shared/pwa.js";

// Page modules for routing
import { generatorPage } from "./pages/generator.js";
import { bracketPage } from "./pages/bracket.js";
import { winnersCourtPage } from "./pages/winnersCourt.js";

// ===== Initialize Application =====
function init() {
  try {
    console.log("Tournament App: Initialized");
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

    // Update theme icon - Handled in layout.js now

    // Load saved state
    const hasState = loadState();

    // Sync UI with state
    // REMOVED: Premature access to UI elements that may not exist yet.
    // The generatorPage.mount() method handles initial state sync for these elements.
    /*
    if (elements.format) elements.format.value = state.format;
    if (elements.courts) elements.courts.value = state.courts;
    if (elements.scoringMode) elements.scoringMode.value = state.scoringMode;
    if (elements.points) elements.points.value = state.pointsPerMatch;
    if (elements.courtFormat) elements.courtFormat.value = state.courtFormat;
    if (elements.maxRepeats) elements.maxRepeats.value = state.maxRepeats;
    if (elements.pairingStrategy) {
      elements.pairingStrategy.value = state.pairingStrategy;
    }
    */

    // No need to manually set these here anymore as they will be set
    // when the generator page mounts and calls updateSetupUI/renderLeaderboard.
    // We can just rely on the initial state sync happening in generatorPage.mount()

    toggleCustomCourtNames();

    // Set callback to avoid circular dependency
    setRenderTournamentConfigCallback(renderTournamentConfig);

    // Note: renderPlayers, renderSchedule etc. removed from here because
    // the container doesn't exist yet! It will be rendered by generatorPage.mount().

    // Initialize event listeners
    // Note: We still call this to setup global listeners (like PWA, History init, etc if any?)
    // But attachCoreListeners will fail to find elements initially?
    // YES. But that's fine, it handles null checks.
    // And when Generator mounts, it triggers the custom event to re-run it.

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
    renderTournamentConfig();

    // Initialize ripple effect on buttons
    initRippleEffect();

    // Initialize scroll animations
    initScrollAnimations();

    // ===== Router Setup =====
    // Register page routes
    registerRoute("", generatorPage); // Default
    registerRoute("generator", generatorPage); // Explicit generator
    registerRoute("bracket", bracketPage); // Bracket view
    registerRoute("winners-court", winnersCourtPage); // Finals/podium

    // Add page navigation tabs
    injectPageNavigation();

    // Initialize router (will mount appropriate page based on hash)
    // For Phase 1, generator page just logs - existing UI remains active
    initRouter();
    console.log(
      "[Tournament] Router initialized. Current route:",
      getCurrentRoute()
    );
  } catch (e) {
    console.error("CRITICAL ERROR IN INIT:", e);
    showToast("Application failed to start: " + e.message, "error");
  }
}

// ===== Ripple Effect =====
function initRippleEffect() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${Math.max(
      rect.width,
      rect.height
    )}px`;
    ripple.style.left = `${e.clientX - rect.left - ripple.offsetWidth / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - ripple.offsetHeight / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// ===== Page Navigation Tabs =====
function injectPageNavigation() {
  const container = document.querySelector(".tournament-page .container");
  const toolHeader = container?.querySelector(".tool-header");

  if (!toolHeader) {
    console.error(
      "[Router] Could not find .tool-header to inject navigation. Check HTML structure."
    );
    if (!container)
      console.error("[Router] .tournament-page .container not found either.");
    return;
  }

  // Create navigation tabs
  const nav = document.createElement("nav");
  nav.className = "page-nav";
  nav.innerHTML = `
    <div class="page-nav-tabs">
      <a href="#/generator" class="page-nav-tab" data-route="generator">
        <span class="tab-label">Generator</span>
      </a>
      <a href="#/bracket" class="page-nav-tab" data-route="bracket">
        <span class="tab-label">Bracket</span>
      </a>
      <a href="#/winners-court" class="page-nav-tab" data-route="winners-court">
        <span class="tab-label">Winners Court</span>
      </a>
    </div>
  `;

  // Insert after header
  toolHeader.after(nav);

  // Add page container for routed content (bracket/winners pages)
  // Generator uses existing HTML, other pages render into this
  let pageContainer = document.getElementById("pageContainer");
  if (!pageContainer) {
    pageContainer = document.createElement("div");
    pageContainer.id = "pageContainer";
    pageContainer.className = "page-container";
    pageContainer.style.display = "none"; // Hidden by default, shown for non-generator pages

    // Insert after navigation
    nav.after(pageContainer);
  }

  // Update active tab on route change
  function updateActiveTab() {
    const { route } = getCurrentRoute();
    const currentRoute = route || "generator";

    nav.querySelectorAll(".page-nav-tab").forEach((tab) => {
      if (tab.dataset.route === currentRoute) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    // Update page title and subtitle based on route
    const titleEl = document.getElementById("toolTitle");
    const subtitleEl = document.getElementById("toolSubtitle");
    if (titleEl && subtitleEl) {
      const titles = {
        generator: {
          title: "Americano & Mexicano Generator",
          subtitle:
            "Create Americano and Mexicano schedules for your padel group in seconds.",
        },
        bracket: {
          title: "Bracket Generator",
          subtitle: "Create single or dual elimination tournament brackets.",
        },
        "winners-court": {
          title: "Winners Court",
          subtitle: "Skill-based court placement for balanced matches.",
        },
      };
      const config = titles[currentRoute] || titles.generator;
      titleEl.textContent = config.title;
      subtitleEl.textContent = config.subtitle;
    }

    // Toggle visibility:
    // generator, bracket, winners - all render into pageContainer now.
    // The previous logic hid pageContainer for generator and showed static HTML.
    // Now we ALWAYS show pageContainer and hide nothing (since static HTML is gone).

    // Actually, we should check if there are any other sections we need to hide?
    // No, we removed them from HTML.

    if (pageContainer.style.display === "none") {
      pageContainer.style.display = "block";
    }
  }

  // Initial update
  updateActiveTab();

  // Listen for route changes
  window.addEventListener("hashchange", updateActiveTab);
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    ".section-title, .leaderboard-header h3, .players-header h3"
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
// ===== Event Listeners =====
function initEventListeners(elements) {
  // Theme toggle handled in layout.js

  // Handle re-attachment of listeners when Generator page re-mounts
  window.addEventListener("tournament-generator-mounted", () => {
    // Re-bind specific listeners that are not delegated
    // Note: 'elements' in this closure is the *initial* elements object.
    // The generator page has called initElements(), so the module-level 'elements'
    // in ui/index.js are updated. We need to fetch fresh references here if we want to bind them.
    // But since this function scope is closed over the initial 'elements' object,
    // we need to ask getElements() again.

    const freshElements = getElements();

    // Format
    if (freshElements.format) {
      freshElements.format.addEventListener("change", () => {
        state.format = freshElements.format.value;
        updateSetupUI();
        saveState();
        if (state.schedule.length > 0) {
          renderGameDetails();
        }
      });
    }

    // Scoring Mode
    if (freshElements.scoringMode) {
      freshElements.scoringMode.addEventListener("change", () => {
        state.scoringMode = freshElements.scoringMode.value;
        updateScoringLabel();
        saveState();
        renderTournamentConfig();
        if (state.schedule.length > 0) {
          renderSchedule();
        }
      });
    }

    // Points
    if (freshElements.points) {
      freshElements.points.addEventListener("change", () => {
        state.pointsPerMatch = parseInt(freshElements.points.value);
        saveState();
        renderTournamentConfig();
        if (state.schedule.length > 0) {
          renderSchedule();
        }
      });
    }

    // Courts (Input & Change)
    if (freshElements.courts) {
      freshElements.courts.addEventListener("change", () => {
        state.courts = parseInt(freshElements.courts.value);
        saveState();
        renderTournamentConfig();
        if (state.schedule.length > 0) {
          renderGameDetails();
        }
        if (state.courtFormat === "custom") {
          renderCustomCourtNames();
        }
      });

      freshElements.courts.addEventListener("input", () => {
        const MAX_COURTS = 50;
        const rawVal = freshElements.courts.value;
        if (rawVal === "") return;
        let val = parseInt(rawVal) || 1;
        val = Math.max(1, Math.min(MAX_COURTS, val));
        if (state.isLocked) return;
        freshElements.courts.value = val;
        state.courts = val;
        saveState();
        if (state.courtFormat === "custom") {
          renderCustomCourtNames();
        }
        if (state.schedule.length > 0) {
          renderGameDetails();
        }
      });
    }

    // Court Format
    if (freshElements.courtFormat) {
      freshElements.courtFormat.addEventListener("change", () => {
        state.courtFormat = freshElements.courtFormat.value;
        toggleCustomCourtNames();
        saveState();
      });
    }

    // Player Input Enter
    const playerInput = document.getElementById("playerNameInput");
    if (playerInput) {
      playerInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          if (addPlayer(playerInput.value)) {
            playerInput.value = "";
            renderPlayers();
          }
        }
      });
    }
    const addBtn = document.getElementById("confirmAddBtn");
    if (addBtn && playerInput) {
      addBtn.addEventListener("click", () => {
        if (addPlayer(playerInput.value)) {
          playerInput.value = "";
          playerInput.focus();
          renderPlayers();
        }
      });
    }

    // Import/Clear Buttons
    if (freshElements.clearAllPlayersBtn) {
      freshElements.clearAllPlayersBtn.addEventListener("click", () => {
        removeAllPlayers(() => {
          renderPlayers();
          renderPreferredPartners();
          updateSetupUI();
        });
      });
    }

    const importBtn = document.getElementById("importPlayersBtn");
    const closeImport = document.getElementById("closeImportModal");
    const cancelImport = document.getElementById("cancelImportBtn");
    const confirmImport = document.getElementById("confirmImportBtn");

    if (importBtn) importBtn.addEventListener("click", showImportModal);
    if (closeImport) closeImport.addEventListener("click", hideImportModal);
    if (cancelImport) cancelImport.addEventListener("click", hideImportModal);
    if (confirmImport) {
      confirmImport.addEventListener("click", () => {
        const textarea = document.getElementById("importTextarea");
        if (!textarea) return;
        const text = textarea.value;
        const result = importPlayersData(text);

        let statusMsg = `Added ${result.added} players.`;
        if (result.duplicates > 0)
          statusMsg += ` Skipped ${result.duplicates} duplicates.`;
        if (result.hitLimit) statusMsg += ` Stopped at 24 max limit.`;

        const statusEl = document.getElementById("importStatus");
        if (statusEl) statusEl.textContent = statusMsg;
        renderPlayers();

        if (result.added > 0 && result.duplicates === 0 && !result.hitLimit) {
          setTimeout(hideImportModal, 1500);
          showToast(`Imported ${result.added} players`);
        }
      });
    }

    // Help Buttons (re-attach)
    const helpFit = document.getElementById("helpFormat");
    if (helpFit)
      helpFit.addEventListener("click", () => {
        // Trigger same help modal (we can trigger the event manually or call logic)
        // Since we can't easily access the closures for help content, we'll need to duplicate
        // or move those help listeners to a shared helper function.
        // For now, simpler to leave them non-functional or copy paste the help modal calls.
        // Actually, let's just re-run initEventListeners(freshElements)?
        // NO, that would duplicate the 'tournament-generator-mounted' listener itself!
        // We will call a helper function `attachCoreListeners(freshElements)` which we will extract.
      });

    // Instead of duplicating all this logic above, let's extract the core listener logic.
    attachCoreListeners(freshElements);
  });
  // Theme toggle handled in layout.js

  // Initial attach
  attachCoreListeners(elements);
}

/**
 * Attach core event listeners to elements.
 * Extracted so it can be re-run when Generator component re-mounts.
 */
function attachCoreListeners(elements) {
  // Undo Action
  const undoBtn = document.getElementById("undoBtn");
  if (undoBtn) {
    // Clone to remove old listeners if we are re-attaching,
    // otherwise we might stack listeners or leak.
    // Actually, since the elements are destroyed and recreated,
    // picking them up by ID gives us fresh elements with NO listeners.
    // So simple addEventListener is fine.

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
          if (elements.scheduleSection)
            elements.scheduleSection.style.display = "block";
          if (elements.leaderboardSection)
            elements.leaderboardSection.style.display = "block";
          const actions = document.getElementById("tournamentActionsSection");
          if (actions) actions.style.display = "block";
        } else {
          if (elements.scheduleSection)
            elements.scheduleSection.style.display = "none";
          if (elements.leaderboardSection)
            elements.leaderboardSection.style.display = "none";
          const actions = document.getElementById("tournamentActionsSection");
          if (actions) actions.style.display = "none";
        }
      }
    });

    // Keyboard Shortcut (Ctrl/Cmd + Z)
    // Document level - only attach once!
    if (!window._undoListenerAttached) {
      document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          const btn = document.getElementById("undoBtn");
          if (btn && !btn.disabled) btn.click();
        }
      });
      window._undoListenerAttached = true;
    }
  }

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
  if (elements.importPlayersBtn)
    elements.importPlayersBtn.addEventListener("click", showImportModal);
  if (elements.closeImportModal)
    elements.closeImportModal.addEventListener("click", hideImportModal);
  if (elements.cancelImportBtn)
    elements.cancelImportBtn.addEventListener("click", hideImportModal);
  if (elements.confirmImportBtn) {
    elements.confirmImportBtn.addEventListener("click", () => {
      const text = elements.importTextarea ? elements.importTextarea.value : "";
      const result = importPlayersData(text);

      let statusMsg = `Added ${result.added} players.`;
      if (result.duplicates > 0)
        statusMsg += ` Skipped ${result.duplicates} duplicates.`;
      if (result.hitLimit) statusMsg += ` Stopped at 24 max limit.`;

      if (elements.importStatus) elements.importStatus.textContent = statusMsg;
      renderPlayers();

      if (result.added > 0 && result.duplicates === 0 && !result.hitLimit) {
        setTimeout(hideImportModal, 1500);
        showToast(`Imported ${result.added} players`);
      }
    });
  }

  if (elements.confirmAddBtn) {
    elements.confirmAddBtn.addEventListener("click", () => {
      if (addPlayer(elements.playerNameInput.value)) {
        elements.playerNameInput.value = "";
        elements.playerNameInput.focus();
        renderPlayers();
      }
    });
  }

  if (elements.playerNameInput) {
    elements.playerNameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (addPlayer(elements.playerNameInput.value)) {
          elements.playerNameInput.value = "";
          renderPlayers();
        }
      }
    });
  }

  // Form changes
  if (elements.format) {
    elements.format.addEventListener("change", () => {
      state.format = elements.format.value;
      updateSetupUI();
      saveState();
      if (state.schedule.length > 0) {
        renderGameDetails();
      }
    });
  }

  if (elements.courts) {
    elements.courts.addEventListener("change", () => {
      state.courts = parseInt(elements.courts.value);
      saveState();
      renderTournamentConfig();
      if (state.schedule.length > 0) {
        renderGameDetails();
      }
      if (state.courtFormat === "custom") {
        renderCustomCourtNames();
      }
    });
  }

  if (elements.points) {
    elements.points.addEventListener("change", () => {
      state.pointsPerMatch = parseInt(elements.points.value);
      saveState();
      renderTournamentConfig();
      if (state.schedule.length > 0) {
        renderSchedule();
      }
    });
  }

  if (elements.scoringMode) {
    elements.scoringMode.addEventListener("change", () => {
      state.scoringMode = elements.scoringMode.value;
      updateScoringLabel();
      saveState();
      renderTournamentConfig();
      if (state.schedule.length > 0) {
        renderSchedule();
      }
    });
  }

  const rankingCriteriaSelect = document.getElementById("rankingCriteria");
  if (rankingCriteriaSelect) {
    rankingCriteriaSelect.addEventListener("change", () => {
      state.rankingCriteria = rankingCriteriaSelect.value;
      updateRankingCriteria();
      saveState();
    });
  }

  if (elements.courtFormat) {
    elements.courtFormat.addEventListener("change", () => {
      state.courtFormat = elements.courtFormat.value;
      toggleCustomCourtNames();
      saveState();
    });
  }

  if (elements.courts) {
    elements.courts.addEventListener("input", () => {
      const MAX_COURTS = 50;
      const rawVal = elements.courts.value;

      // Allow empty input while typing
      if (rawVal === "") return;

      let val = parseInt(rawVal) || 1;
      val = Math.max(1, Math.min(MAX_COURTS, val));

      // If locked, do not update state actively
      if (state.isLocked) return;

      elements.courts.value = val;
      state.courts = val;
      saveState();
      if (state.courtFormat === "custom") {
        renderCustomCourtNames();
      }
      if (state.schedule.length > 0) {
        renderGameDetails();
      }
    });
  }

  // Matchup settings (always enabled, with confirmation during tournament)
  if (elements.maxRepeats) {
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
            renderTournamentConfig();
            showToast("Max Partner Repeats updated");
          },
          true // isDanger
        );
      } else {
        state.maxRepeats = newValue;
        saveState();
        renderTournamentConfig();
      }
    });
  }

  const strictStrategy = document.getElementById("strictStrategy");
  if (strictStrategy) {
    strictStrategy.addEventListener("change", (e) => {
      // Feedback: Not available with Optimal strategy
      if (state.pairingStrategy === "optimal") {
        e.target.checked = false;
        showToast(
          "Strict Pattern is not available with Optimal pairing",
          "info"
        );
        return;
      }

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
          },
          true // isDanger
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
          },
          true // isDanger
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

  if (elements.addPartnerPairBtn) {
    elements.addPartnerPairBtn.addEventListener("click", () => {
      const available = getAvailablePlayersForPairing();
      if (available.length < 2) {
        showToast("Not enough available players to form a pair", "error");
        return;
      }

      addPreferredPair();
      renderPreferredPartners();
      updateSetupUI();
      setupCustomSelects();
      showToast("Fixed pair added", "success");
    });
  }

  // Contextual Help
  const helpFormat = document.getElementById("helpFormat");
  if (helpFormat) {
    helpFormat.addEventListener("click", () => {
      showInfoModal(
        "Tournament Formats",
        `
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <section>
            <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              <span>Americano</span>
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">The ultimate social format. You play with a different partner every round, ensuring everyone mixes and gets to know each other.</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 8px; font-size: 0.9em;"><strong style="color: #4ade80;">✅ Social mixing:</strong> Perfect for corporate events or social clubs.</div>
               <div style="font-size: 0.9em; opacity: 0.8; display: flex; align-items: center; gap: 6px;">
                 <span style="font-size: 1.1em;">ℹ️</span> <span>Players collect individual points for every game won.</span>
               </div>
            </div>
          </section>

          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

          <section>
            <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              <span>Mexicano</span>
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">Competitive and dynamic. The system matches players of similar skill levels. As the tournament progresses, matches become tighter and more exciting.</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 8px; font-size: 0.9em;"><strong style="color: #60a5fa;">🏆 Level matches:</strong> Smart matchmaking based on current leaderboard rank.</div>
               <div style="font-size: 0.9em; opacity: 0.8; display: flex; align-items: center; gap: 6px;">
                 <span style="font-size: 1.1em;">ℹ️</span> <span>"Winners play winners" logic keeps the competition fierce.</span>
               </div>
            </div>
          </section>

          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

          <section>
            <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
              <span>Team Formats</span>
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">Bring your own partner. You stay together as a fixed duo throughout the entire tournament. Can be played using Americano or Mexicano rules.</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 8px; font-size: 0.9em;"><strong style="color: #f472b6;">🤝 Fixed Teams:</strong> Ideal for club championships or pre-defined pairs.</div>
               <div style="font-size: 0.9em; opacity: 0.8; display: flex; align-items: center; gap: 6px;">
                 <span style="font-size: 1.1em;">ℹ️</span> <span>The leaderboard tracks team performance instead of individuals.</span>
               </div>
            </div>
          </section>
        </div>
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
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <section>
            <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px;">Total Points</div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">Every single point matters. You play a fixed number of points (e.g., 24), and the final score is recorded exactly as it ends.</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 4px; font-size: 0.9em;"><strong>Example:</strong> Team A: 14, Team B: 10</div>
               <div style="font-size: 0.9em; opacity: 0.8;">These points are added directly to each player's global total.</div>
            </div>
          </section>

          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

          <section>
            <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px;">Race (First to X)</div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">A classic match feel. The first team to reach the target score wins the match immediately.</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 4px; font-size: 0.9em;"><strong>Example:</strong> First to 21 wins.</div>
               <div style="font-size: 0.9em; opacity: 0.8;">Perfect for keeping that "winning the set" excitement.</div>
            </div>
          </section>

          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

          <section>
            <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px;">Timed (Minutes)</div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">Play against the clock. When the buzzer sounds, the team currently leading wins the match.</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 4px; font-size: 0.9em;">⏱️ <strong>Strict Schedule:</strong> Ensures all matches finish at the exact same time.</div>
               <div style="font-size: 0.9em; opacity: 0.8;">Great for tournaments with limited court time.</div>
            </div>
          </section>
        </div>
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
        <div style="display: flex; flex-direction: column; gap: 24px;">
          <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">Fine-tune how the <strong>Mexicano</strong> engine pairs players together.</p>

          <section>
            <div style="font-weight: 700; font-size: 1.1em; color: var(--text-primary); margin-bottom: 6px;">Max Partner Repeats</div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 0.95em;">Controls variety. How many times can you play with the same partner?</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 8px; font-size: 0.9em;">🔄 <strong>Set to 0:</strong> Maximum variety (never repeat if possible).</div>
               <div style="font-size: 0.9em; opacity: 0.8;">♾️ <strong>Unlimited:</strong> Purest competition (best pairing always used).</div>
            </div>
          </section>

          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

          <section>
            <div style="font-weight: 700; font-size: 1.1em; color: var(--text-primary); margin-bottom: 6px;">Pairing Strategy</div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 0.95em;">How to form teams from the top 4 available players (Rank 1-4) each round.</p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="padding-left: 12px; border-left: 2px solid #60a5fa;">
                <div style="font-weight: 600; font-size: 0.95em; color: var(--text-primary);">Optimal (Smart)</div>
                <div style="font-size: 0.9em; color: var(--text-secondary);">AI analyzes all options to find the pair that best avoids partner repeats.</div>
              </div>
              <div style="padding-left: 12px; border-left: 2px solid rgba(255, 255, 255, 0.2);">
                <div style="font-weight: 600; font-size: 0.95em; color: var(--text-primary);">Standard (1&3 vs 2&4)</div>
                <div style="font-size: 0.9em; color: var(--text-secondary);">The classic Mexicano logic. Always pairs 1st with 3rd against 2nd & 4th.</div>
              </div>
            </div>
          </section>

          <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

          <section>
            <div style="font-weight: 700; font-size: 1.1em; color: var(--text-primary); margin-bottom: 6px;">Strict Pattern</div>
            <p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 0.95em;">What happens when the "Standard" pattern conflicts with your "Max Repeats" setting?</p>
            <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
               <div style="margin-bottom: 8px; font-size: 0.9em;">⬜ <strong>OFF (Smart):</strong> Pattern is broken to avoid repeats.</div>
               <div style="font-size: 0.9em;">✅ <strong>ON (Strict):</strong> Pattern is forced, even if it causes a repeat.</div>
            </div>
          </section>
        </div>
        `
      );
    });
  }

  /* Leaderboard Help */
  const helpLeaderboard = document.getElementById("helpLeaderboard");
  if (helpLeaderboard) {
    helpLeaderboard.addEventListener("click", () => {
      showInfoModal(
        "Leaderboard Guide",
        `
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">Track player standings throughout the tournament. Rankings update automatically after each round.</p>
          
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;"># (Rank)</div>
              <div style="font-size: 0.9em; color: var(--text-secondary);">Current position based on your chosen criteria. Arrows indicate movement since the last round.</div>
            </section>

            <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Pts (Points)</div>
              <div style="font-size: 0.9em; color: var(--text-secondary);">Total points won across all matches. This is the primary way players are ranked.</div>
            </section>

            <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">W (Wins)</div>
              <div style="font-size: 0.9em; color: var(--text-secondary);">The total number of matches you have won.</div>
            </section>

            <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Diff (Difference)</div>
              <div style="font-size: 0.9em; color: var(--text-secondary);">Point difference (Points Won - Points Lost). Crucial for breaking ties in the rankings.</div>
            </section>

            <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">% (Win Rate)</div>
              <div style="font-size: 0.9em; color: var(--text-secondary);">Your efficiency. The percentage of wins compared to matches played.</div>
            </section>

            <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Pl (Played)</div>
              <div style="font-size: 0.9em; color: var(--text-secondary);">Total matches played. Note: Bye rounds do not count as played matches.</div>
            </section>
          </div>
        </div>
        `
      );
    });
  }

  // Schedule actions
  if (elements.generateBtn)
    elements.generateBtn.addEventListener("click", generateSchedule);
  if (elements.printBtn)
    elements.printBtn.addEventListener("click", () => window.print());
  if (elements.resetBtn)
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
    const id = target.dataset.id ? Number(target.dataset.id) : null;
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
          updateSetupUI();
          setupCustomSelects();
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
    const pairId = target.dataset.pairId ? Number(target.dataset.pairId) : null;
    const which = target.dataset.which ? parseInt(target.dataset.which) : null;

    if (action === "update-partner" && pairId !== null && which !== null) {
      updatePreferredPair(pairId, which, Number(target.value));
      renderPreferredPartners();
      updateSetupUI();
      setupCustomSelects();
    }

    // Handle Race Mode autofill on change (blur)
    if (action === "autofill-score" && state.scoringMode === "race") {
      const roundIndex = parseInt(target.dataset.round);
      const matchIndex = parseInt(target.dataset.match);
      const team = parseInt(target.dataset.team);
      const value = target.value;
      autoFillScore(roundIndex, matchIndex, team, value);
    }
  });

  // Global input listener to limit score inputs to 2 digits
  document.addEventListener("input", (e) => {
    if (e.target.classList.contains("score-input")) {
      if (e.target.value.length > 2) {
        e.target.value = e.target.value.slice(0, 2);
      }
    }
  });

  // Input event delegation for smart scoring (Total Points only)
  document.addEventListener("input", (e) => {
    const target = e.target.closest('[data-action="autofill-score"]');
    if (!target) return;

    // Skip Race mode on input (wait for blur)
    if (state.scoringMode === "race") return;

    const roundIndex = parseInt(target.dataset.round);
    const matchIndex = parseInt(target.dataset.match);
    const team = parseInt(target.dataset.team);
    const value = target.value;

    autoFillScore(roundIndex, matchIndex, team, value);
  });
}

// Call in init
function promptAddLatePlayer() {
  const isTeam = state.format === "team" || state.format === "teamMexicano";
  const entityName = isTeam ? "team" : "player";

  const description = `The new ${entityName} will join with 0 points and be included starting from the next round. Their ranking will adjust based on future match results.`;

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
    },
    description
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
