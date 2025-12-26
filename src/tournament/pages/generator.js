/**
 * Generator Page Module
 * Americano/Mexicano tournament generator.
 * This is the default page shown at /tournament/ and /tournament/#/generator
 *
 * This module is self-contained, handling its own event listeners and lifecycle.
 */

import { getGeneratorTemplate } from "../ui/generatorTemplates.js";
import {
  initElements,
  getElements,
  updateSetupUI,
  updateScoringLabel,
  renderTournamentConfig,
  renderPlayers,
  renderSchedule,
  renderLeaderboard,
  updateGridColumns,
  renderPreferredPartners,
  renderCustomCourtNames,
  toggleCustomCourtNames,
  updateRankingCriteria,
  setupCustomSelects,
  showImportModal,
  hideImportModal,
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
  endTournament,
  onSliderManualChange,
  updateTextSize,
  updateRoundScale,
  toggleToolbar,
  exportTournamentData,
  shareResults,
  renderGameDetails,
  updateCustomCourtName,
  validateCourts,
} from "../ui/index.js";
import { state, loadState, saveState, undoLastAction } from "../state.js";
import { initHistory, renderHistory } from "../history.js";
import { showToast } from "../../shared/utils.js";
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
} from "../players.js";
import {
  showInputModal,
  showFinalStandings,
  showConfirmModal,
  showInfoModal,
} from "../modals.js";

// Track attached listeners for cleanup
const listeners = [];

/**
 * Track a listener for cleanup on unmount.
 * @param {Element} el
 * @param {string} event
 * @param {Function} handler
 */
function addListener(el, event, handler) {
  if (!el) return;
  el.addEventListener(event, handler);
  listeners.push({ el, event, handler });
}

/**
 * Remove all tracked listeners.
 */
function removeAllListeners() {
  listeners.forEach(({ el, event, handler }) => {
    el.removeEventListener(event, handler);
  });
  listeners.length = 0;
}

/**
 * Prompt to add a late player to the tournament.
 */
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

/**
 * Attach all event listeners for the Generator page.
 * This is called from mount() and handles all user interactions.
 */
function attachListeners() {
  const elements = getElements();

  // ===== Undo Button =====
  const undoBtn = document.getElementById("undoBtn");
  if (undoBtn) {
    addListener(undoBtn, "click", () => {
      if (undoLastAction()) {
        showToast("Undo successful");

        // Refresh UI
        if (elements.format) elements.format.value = state.format;
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
  }

  // ===== Clear All Players =====
  if (elements.clearAllPlayersBtn) {
    addListener(elements.clearAllPlayersBtn, "click", () => {
      removeAllPlayers(() => {
        renderPlayers();
        renderPreferredPartners();
        updateSetupUI();
      });
    });
  }

  // ===== Bulk Import =====
  if (elements.importPlayersBtn) {
    addListener(elements.importPlayersBtn, "click", showImportModal);
  }
  if (elements.closeImportModal) {
    addListener(elements.closeImportModal, "click", hideImportModal);
  }
  if (elements.cancelImportBtn) {
    addListener(elements.cancelImportBtn, "click", hideImportModal);
  }
  if (elements.confirmImportBtn) {
    addListener(elements.confirmImportBtn, "click", () => {
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

  // ===== Add Player Button =====
  if (elements.confirmAddBtn) {
    addListener(elements.confirmAddBtn, "click", () => {
      if (addPlayer(elements.playerNameInput.value)) {
        elements.playerNameInput.value = "";
        elements.playerNameInput.focus();
        renderPlayers();
      }
    });
  }

  // ===== Player Input Enter Key =====
  if (elements.playerNameInput) {
    addListener(elements.playerNameInput, "keydown", (e) => {
      if (e.key === "Enter") {
        if (addPlayer(elements.playerNameInput.value)) {
          elements.playerNameInput.value = "";
          renderPlayers();
        }
      }
    });
  }

  // ===== Format Change =====
  if (elements.format) {
    addListener(elements.format, "change", () => {
      state.format = elements.format.value;
      updateSetupUI();
      saveState();
      if (state.schedule.length > 0) {
        renderGameDetails();
      }
    });
  }

  // ===== Courts Change =====
  if (elements.courts) {
    addListener(elements.courts, "change", () => {
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

    addListener(elements.courts, "input", () => {
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

  // ===== Points Change =====
  if (elements.points) {
    addListener(elements.points, "change", () => {
      state.pointsPerMatch = parseInt(elements.points.value);
      saveState();
      renderTournamentConfig();
      if (state.schedule.length > 0) {
        renderSchedule();
      }
    });
  }

  // ===== Scoring Mode Change =====
  if (elements.scoringMode) {
    addListener(elements.scoringMode, "change", () => {
      state.scoringMode = elements.scoringMode.value;
      updateScoringLabel();
      saveState();
      renderTournamentConfig();
      if (state.schedule.length > 0) {
        renderSchedule();
      }
    });
  }

  // ===== Ranking Criteria =====
  const rankingCriteriaSelect = document.getElementById("rankingCriteria");
  if (rankingCriteriaSelect) {
    addListener(rankingCriteriaSelect, "change", () => {
      state.rankingCriteria = rankingCriteriaSelect.value;
      updateRankingCriteria();
      saveState();
    });
  }

  // ===== Court Format Change =====
  if (elements.courtFormat) {
    addListener(elements.courtFormat, "change", () => {
      state.courtFormat = elements.courtFormat.value;
      toggleCustomCourtNames();
      saveState();
    });
  }

  // ===== Matchup Settings =====
  if (elements.maxRepeats) {
    addListener(elements.maxRepeats, "change", (e) => {
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

  // ===== Strict Strategy =====
  const strictStrategy = document.getElementById("strictStrategy");
  if (strictStrategy) {
    addListener(strictStrategy, "change", (e) => {
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

  // ===== Pairing Strategy =====
  if (elements.pairingStrategy) {
    addListener(elements.pairingStrategy, "change", (e) => {
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

  // ===== Add Partner Pair =====
  if (elements.addPartnerPairBtn) {
    addListener(elements.addPartnerPairBtn, "click", () => {
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

  // ===== Help Buttons =====
  attachHelpListeners();

  // ===== Schedule Actions =====
  if (elements.generateBtn) {
    addListener(elements.generateBtn, "click", generateSchedule);
  }
  if (elements.printBtn) {
    addListener(elements.printBtn, "click", () => window.print());
  }
  if (elements.resetBtn) {
    addListener(elements.resetBtn, "click", resetSchedule);
  }

  // ===== Grid Columns Slider =====
  if (elements.gridColumns) {
    addListener(elements.gridColumns, "input", onSliderManualChange);
  }

  // ===== Text Size Slider =====
  if (elements.textSize) {
    addListener(elements.textSize, "input", () => {
      state.textSize = parseInt(elements.textSize.value);
      updateTextSize();
      saveState();
    });
  }

  // ===== Factory Reset =====
  const factoryResetBtn = document.getElementById("factoryResetBtn");
  if (factoryResetBtn) {
    addListener(factoryResetBtn, "click", () => {
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

  // ===== Round Scale Slider =====
  const roundScaleInput = document.getElementById("roundScale");
  if (roundScaleInput) {
    addListener(roundScaleInput, "input", updateRoundScale);
  }

  // ===== Global Keyboard Shortcut (Ctrl/Cmd + Z for Undo) =====
  // Only attach once, even if mount is called multiple times
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

/**
 * Attach help button event listeners.
 */
function attachHelpListeners() {
  const helpFormat = document.getElementById("helpFormat");
  if (helpFormat) {
    addListener(helpFormat, "click", () => {
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
    addListener(helpScoring, "click", () => {
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

  const helpMatchup = document.getElementById("helpMatchup");
  if (helpMatchup) {
    addListener(helpMatchup, "click", () => {
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

  const helpLeaderboard = document.getElementById("helpLeaderboard");
  if (helpLeaderboard) {
    addListener(helpLeaderboard, "click", () => {
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
}

/**
 * Initialize event delegation for dynamically rendered content.
 * This handles clicks and changes on elements created after mount.
 */
function initEventDelegation(container) {
  // Click event delegation
  addListener(container, "click", (e) => {
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
  addListener(container, "change", (e) => {
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
  addListener(container, "input", (e) => {
    if (e.target.classList.contains("score-input")) {
      if (e.target.value.length > 2) {
        e.target.value = e.target.value.slice(0, 2);
      }
    }

    // Smart scoring (Total Points only)
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

/**
 * Legacy window functions for backward compatibility.
 * These support onclick="" handlers until all HTML is migrated to data-action.
 */
function setupLegacyWindowFunctions() {
  window.removePlayer = (id) => {
    removePlayer(id);
    renderPlayers();
  };

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
}

export const generatorPage = {
  /**
   * Mount the generator page.
   * @param {HTMLElement} container - The page container
   * @param {URLSearchParams} params - URL query params
   */
  mount(container, params) {
    console.log("[GeneratorPage] Mounting...");
    if (!container) {
      console.error("[GeneratorPage] Mount failed: Container is null");
      return;
    }

    // Render the template
    container.innerHTML = getGeneratorTemplate();

    // Re-initialize element references in the UI module
    // This updates the 'elements' object that main.js and others use
    initElements();

    // Attach all event listeners for this page
    attachListeners();

    // Initialize event delegation for dynamically rendered content
    initEventDelegation(container);

    // Setup legacy window functions for onclick handlers
    setupLegacyWindowFunctions();

    // Initialize UI State
    updateSetupUI();
    updateScoringLabel();
    renderTournamentConfig();
    renderPlayers();
    renderPreferredPartners();

    // Trigger animations for section headers (they start with opacity: 0)
    const playersHeader = document.querySelector(".players-header h3");
    if (playersHeader) playersHeader.classList.add("animate-in");

    // Setup specific UI components
    setupCustomSelects();

    // History
    // We need to re-init history to find the new elements
    initHistory();
    // Render history if the section exists
    const historySection = document.getElementById("historySectionPage");
    if (historySection) {
      renderHistory();
    }

    // Restore active tournament view if needed
    if (state.schedule.length > 0) {
      const els = getElements();
      if (els.scheduleSection) els.scheduleSection.style.display = "block";
      if (els.leaderboardSection)
        els.leaderboardSection.style.display = "block";
      const actions = document.getElementById("tournamentActionsSection");
      if (actions) actions.style.display = "block";

      renderSchedule();
      renderLeaderboard();
      updateGridColumns();
    }

    console.log("[GeneratorPage] Mounted successfully");
  },

  /**
   * Unmount the generator page.
   */
  unmount() {
    console.log("[GeneratorPage] Unmounting...");
    // Remove all tracked listeners to prevent leaks
    removeAllListeners();
  },
};
