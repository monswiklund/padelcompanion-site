/**
 * Setup UI Module
 * Handles UI state updates based on tournament configuration.
 */

import { state } from "../../core/state.js";
import { getElements } from "../elements.js";
import { updateAddPartnerPairButton } from "../partners.js";

// Forward declaration for tournament config render
let renderTournamentConfigCallback = null;

/**
 * Set callback for tournament config rendering.
 * @param {Function} fn - Callback function
 */
export function setRenderTournamentConfigCallback(fn) {
  renderTournamentConfigCallback = fn;
}

/**
 * Update setup UI based on state.
 */
export function updateSetupUI() {
  const els = getElements();
  const format = state.format;
  const isTeam = format === "team" || format === "teamMexicano";

  // Update labels based on format
  const labels = {
    americano: {
      title: "Americano Setup",
      description: "Add players and configure your tournament settings.",
    },
    mexicano: {
      title: "Mexicano Setup",
      description:
        "Dynamic schedule that adjusts pairings based on leaderboard.",
    },
    team: {
      title: "Team Americano Setup",
      description: "Play with fixed teams.",
    },
    teamMexicano: {
      title: "Team Mexicano Setup",
      description: "Dynamic schedule for fixed teams.",
    },
  };

  const current = labels[state.format] || labels.americano;
  const titleEl = document.querySelector(".page-title");
  const descEl = document.querySelector(".page-subtitle");

  if (titleEl) titleEl.textContent = current.title;
  if (descEl) descEl.textContent = current.description;

  // Update UI labels for Team Mode
  const playersHeader = document.getElementById("playersHeader");
  if (playersHeader) {
    if (playersHeader.firstChild) {
      playersHeader.firstChild.textContent = isTeam ? "Teams " : "Players ";
    }
  }

  if (els.addPlayerBtn) {
    els.addPlayerBtn.textContent = isTeam ? "+ Add Team" : "+ Add Player";
  }

  if (els.playerNameInput) {
    els.playerNameInput.placeholder = isTeam
      ? "Enter team name..."
      : "Enter name...";
  }

  // Ensure Matchup Rules are NOT disabled
  const matchupContainer = document.getElementById("advancedSettingsContent");
  if (matchupContainer) {
    const matchupInputs = matchupContainer.querySelectorAll(
      "input, select, button"
    );
    matchupInputs.forEach((input) => {
      input.disabled = false;
      input.classList.remove("locked");

      if (input.tagName === "SELECT") {
        const wrapper = input.closest(".custom-select-wrapper");
        if (wrapper) {
          const customSelect = wrapper.querySelector(".custom-select");
          if (customSelect) customSelect.classList.remove("disabled");
        }
      }
    });

    updateAddPartnerPairButton();
  }

  // Update generate button text
  const runningBadge = document.getElementById("runningBadge");
  if (state.isLocked) {
    if (els.generateBtn) els.generateBtn.style.display = "none";
    if (runningBadge) runningBadge.style.display = "inline-flex";
  } else {
    if (els.generateBtn) {
      els.generateBtn.style.display = "block";
      els.generateBtn.textContent = "Generate Schedule";
      els.generateBtn.disabled = false;
    }
    if (runningBadge) runningBadge.style.display = "none";
  }

  // Toggle Advanced Settings visibility based on Format
  const fmt = String(format).trim();
  const isMexicano = fmt.toLowerCase() === "mexicano";
  const isTeamMexicano = fmt === "teamMexicano";
  const isMexicanoRelated = isMexicano || isTeamMexicano;

  const advancedContent = els.advancedSettingsContent;
  if (advancedContent) {
    if (isMexicanoRelated) {
      advancedContent.classList.remove("collapsed");
      advancedContent.classList.add("expanded");
    } else {
      advancedContent.classList.remove("expanded");
      advancedContent.classList.add("collapsed");
    }
  }

  // Disable Strict Pattern checkbox when Optimal pairing strategy is selected
  const strictStrategy = document.getElementById("strictStrategy");
  if (strictStrategy) {
    strictStrategy.disabled = false;
  }

  // Update tournament config
  if (renderTournamentConfigCallback) {
    renderTournamentConfigCallback();
  }
}

/**
 * Render tournament summary bullet points.
 */
export function renderTournamentSummary() {
  const summaryList = document.getElementById("summaryList");
  const summarySection = document.getElementById("tournamentSummary");
  if (!summaryList || !summarySection) return;

  if (state.isLocked) {
    summarySection.style.display = "none";
    return;
  }
  summarySection.style.display = "block";

  const formatLabels = {
    americano: "Americano",
    mexicano: "Mexicano",
    team: "Team Americano",
    teamMexicano: "Team Mexicano",
  };

  const isTeam = state.format === "team" || state.format === "teamMexicano";
  const isMexicano =
    state.format === "mexicano" || state.format === "teamMexicano";
  const playerCount = state.players?.length || 0;
  const playerLabel = isTeam ? "teams" : "players";

  const items = [
    { label: "Format", value: formatLabels[state.format] || state.format },
    {
      label: isTeam ? "Teams" : "Players",
      value: playerCount > 0 ? `${playerCount} ${playerLabel}` : "None added",
    },
    { label: "Courts", value: state.courts || 2 },
    {
      label: "Scoring",
      value:
        state.scoringMode === "time"
          ? `${state.pointsPerMatch} minutes`
          : state.scoringMode === "race"
          ? `First to ${state.pointsPerMatch}`
          : `${state.pointsPerMatch} total points`,
    },
  ];

  if (isMexicano) {
    const maxRepeatsLabel =
      state.maxRepeats === 99
        ? "Unlimited"
        : state.maxRepeats === 0
        ? "No repeats"
        : `Max ${state.maxRepeats}x`;
    items.push({ label: "Repeats", value: maxRepeatsLabel });

    const strategyLabels = {
      oneThree: "1&3 vs 2&4",
      oneTwo: "1&2 vs 3&4",
      oneFour: "1&4 vs 2&3",
      optimal: "Optimal",
    };
    items.push({
      label: "Pairing",
      value: strategyLabels[state.pairingStrategy] || state.pairingStrategy,
    });

    if (state.preferredPartners?.length > 0) {
      const pairNames = state.preferredPartners
        .map((pair) => {
          const p1 = state.players.find((p) => p.id === pair.player1Id);
          const p2 = state.players.find((p) => p.id === pair.player2Id);
          if (p1 && p2) return `${p1.name} & ${p2.name}`;
          return null;
        })
        .filter(Boolean);

      if (pairNames.length > 0) {
        items.push({ label: "Fixed Pairs", value: pairNames, isChips: true });
      }
    }
  }

  summaryList.innerHTML = items
    .map((item) => {
      if (item.isChips) {
        return `
          <li class="summary-item summary-item-chips">
            <span class="summary-label">${item.label}:</span>
            <div class="summary-chips">
              ${item.value
                .map((name) => `<span class="summary-chip">${name}</span>`)
                .join("")}
            </div>
          </li>
        `;
      }
      return `
        <li class="summary-item">
          <span class="summary-label">${item.label}:</span>
          <span class="summary-value">${item.value}</span>
        </li>
      `;
    })
    .join("");
}
