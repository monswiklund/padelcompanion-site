// Tournament Generator - Padel Companion
// Americano & Mexicano scheduling algorithms

// ===== State Management =====
const state = {
  players: [],
  format: "americano",
  courts: 2,
  scoringMode: "total", // "total", "race", "time"
  pointsPerMatch: 24,
  rankingCriteria: "points", // "points", "wins", "winRatio", "pointRatio"
  courtFormat: "court", // "number", "court", "custom"
  customCourtNames: [], // Array of custom names when courtFormat is "custom"
  maxRepeats: 99, // 0 = never, 1+ = max times, 99 = unlimited
  pairingStrategy: "optimal", // "oneTwo", "oneThree", "oneFour", "optimal"
  preferredPartners: [], // Array of {player1Id, player2Id} pairs
  manualByes: [], // Array of player IDs manually selected to rest
  hideLeaderboard: false, // Toggle to hide standings during tournament
  showPositionChanges: true, // Show up/down arrows in leaderboard
  gridColumns: 0, // 0 = auto, 1-6 = fixed columns
  textSize: 100, // Text size percentage (50-150)
  isLocked: false, // Lock settings after tournament starts
  schedule: [],
  currentRound: 0,
  leaderboard: [],
};

// ===== DOM Elements =====
const elements = {
  format: document.getElementById("format"),
  courts: document.getElementById("courts"),
  scoringMode: document.getElementById("scoringMode"),
  points: document.getElementById("points"),
  courtFormat: document.getElementById("courtFormat"),
  customCourtNamesSection: document.getElementById("customCourtNamesSection"),
  customCourtNamesList: document.getElementById("customCourtNamesList"),
  maxRepeats: document.getElementById("maxRepeats"),
  pairingStrategy: document.getElementById("pairingStrategy"),
  preferredPartnersList: document.getElementById("preferredPartnersList"),
  addPartnerPairBtn: document.getElementById("addPartnerPairBtn"),
  playerList: document.getElementById("playerList"),
  playerCount: document.getElementById("playerCount"),
  playersHint: document.getElementById("playersHint"),
  addPlayerBtn: document.getElementById("addPlayerBtn"),
  playerInputRow: document.getElementById("playerInputRow"),
  playerNameInput: document.getElementById("playerNameInput"),
  confirmAddBtn: document.getElementById("confirmAddBtn"),
  cancelAddBtn: document.getElementById("cancelAddBtn"),
  generateBtn: document.getElementById("generateBtn"),
  scheduleSection: document.getElementById("scheduleSection"),
  roundsContainer: document.getElementById("roundsContainer"),
  leaderboardSection: document.getElementById("leaderboardSection"),
  leaderboardBody: document.getElementById("leaderboardBody"),
  printBtn: document.getElementById("printBtn"),
  resetBtn: document.getElementById("resetBtn"),
  gridColumns: document.getElementById("gridColumns"),
  gridColumnsLabel: document.getElementById("gridColumnsLabel"),
  textSize: document.getElementById("textSize"),
  textSizeLabel: document.getElementById("textSizeLabel"),
  themeToggle: document.getElementById("themeToggle"),
  importPlayersBtn: document.getElementById("importPlayersBtn"),
  importModal: document.getElementById("importModal"),
  closeImportModal: document.getElementById("closeImportModal"),
  importTextarea: document.getElementById("importTextarea"),
  importStatus: document.getElementById("importStatus"),
  cancelImportBtn: document.getElementById("cancelImportBtn"),
  confirmImportBtn: document.getElementById("confirmImportBtn"),
  clearAllPlayersBtn: document.getElementById("clearAllPlayersBtn"),
};

// ===== Theme Toggle =====
function initTheme() {
  const saved = localStorage.getItem("tournament-theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
    updateThemeIcon(saved);
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("tournament-theme", next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = elements.themeToggle.querySelector(".theme-icon");
  icon.textContent = theme === "dark" ? "🌙" : "☀️";
}

// ===== Player Management =====
function addPlayer(name) {
  if (!name.trim()) return false;

  const trimmedName = name.trim();

  if (state.players.length >= 24) {
    showToast("⚠️ Maximum 24 players allowed");
    return false;
  }

  // Check for duplicates (case-insensitive)
  if (
    state.players.some(
      (p) => p.name.toLowerCase() === trimmedName.toLowerCase()
    )
  ) {
    showToast(`⚠️ Player "${trimmedName}" already exists`);
    return false;
  }

  state.players.push({
    id: Date.now(),
    name: trimmedName,
    points: 0,
    wins: 0,
    losses: 0,
    pointsLost: 0,
    played: 0,
  });
  renderPlayers();
  saveState();
  return true;
}

function removePlayer(id) {
  state.players = state.players.filter((p) => p.id !== id);
  renderPlayers();
  saveState();
}

function removeAllPlayers() {
  console.log("removeAllPlayers called, players:", state.players.length);
  if (state.players.length === 0) {
    console.log("No players to remove");
    return;
  }

  showConfirmModal(
    "Remove All Players?",
    "Are you sure you want to clear the entire player list? This action cannot be undone.",
    "Yes, Remove All",
    () => {
      console.log("Confirm callback executed");
      state.players = [];
      state.preferredPartners = [];
      saveState();
      renderPlayers();
      console.log("Players cleared, state:", state.players);
      if (typeof renderPreferredPartnersList === "function")
        renderPreferredPartnersList();
      if (typeof updateSetupUI === "function") updateSetupUI();
    }
  );
}

// ===== Collapsible Player List =====
// ===== Collapsible Player List =====
function togglePlayerList() {
  const wrapper = document.getElementById("playerListWrapper");
  const btn = document.getElementById("expandPlayersBtn");

  if (wrapper.classList.contains("expanded")) {
    wrapper.classList.remove("expanded");
    btn.innerHTML = `Show All Players (${state.players.length}) ▼`;
  } else {
    wrapper.classList.add("expanded");
    btn.innerHTML = "Show Less ▲";
  }
}

// Ensure button text is correct on initial load/render
function updatePlayerToggleBtn() {
  const btn = document.getElementById("expandPlayersBtn");
  const wrapper = document.getElementById("playerListWrapper");
  if (btn && !wrapper.classList.contains("expanded")) {
    btn.innerHTML = `Show All Players (${state.players.length}) ▼`;
  }
}

window.togglePlayerList = togglePlayerList;

// ===== Bulk Import =====
function showImportModal() {
  elements.importModal.style.display = "flex";
  elements.importTextarea.value = "";
  elements.importStatus.textContent = "";
  elements.importTextarea.focus();
}

function hideImportModal() {
  elements.importModal.style.display = "none";
}

function importPlayers() {
  const text = elements.importTextarea.value;
  if (!text.trim()) return;

  // Split by newline or comma
  const rawNames = text
    .split(/[\n,]+/)
    .map((n) => n.trim())
    .filter((n) => n);

  if (rawNames.length === 0) return;

  let addedCount = 0;
  let skippedCount = 0;
  let duplicates = 0;

  // Add each name
  for (const name of rawNames) {
    // Check global limit
    if (state.players.length >= 24) {
      break;
    }

    // Check duplicate (case-insensitive)
    if (
      state.players.some((p) => p.name.toLowerCase() === name.toLowerCase())
    ) {
      duplicates++;
      continue;
    }

    state.players.push({
      id: Date.now() + Math.random(), // Ensure unique ID even in tight loop
      name: name,
      points: 0,
      played: 0,
    });
    addedCount++;
  }

  renderPlayers();
  saveState();

  const skipped = rawNames.length - addedCount;
  let statusMsg = `Added ${addedCount} players.`;
  if (duplicates > 0) statusMsg += ` Skipped ${duplicates} duplicates.`;
  if (state.players.length >= 24 && skipped > duplicates) {
    statusMsg += ` Stopped at 24 max limit.`;
  }

  elements.importStatus.textContent = statusMsg;
  console.log(`Imported ${addedCount}, Skipped ${skipped}`);

  // Auto-close if successful and no partial errors/limit reached
  if (skipped === 0) {
    setTimeout(hideImportModal, 1500);
    showToast(`✅ Imported ${addedCount} players`);
  }
}

function renderPlayers() {
  elements.playerList.innerHTML = state.players
    .map(
      (player, index) => `
    <li class="player-item" data-id="${player.id}">
      <span><span class="player-number">${index + 1}.</span> ${
        player.name
      }</span>
      <button class="player-remove" onclick="removePlayer(${
        player.id
      })">×</button>
    </li>
  `
    )
    .join("");

  elements.playerCount.textContent = `(${state.players.length})`;
  elements.generateBtn.disabled = state.players.length < 4;

  if (state.players.length >= 4) {
    elements.playersHint.textContent = `${state.players.length} players ready`;
    elements.playersHint.style.color = "var(--success)";
  } else {
    elements.playersHint.textContent = `Add at least ${
      4 - state.players.length
    } more player${4 - state.players.length > 1 ? "s" : ""}`;
    elements.playersHint.style.color = "";
  }

  // Update preferred partners UI
  renderPreferredPartners();
  updateAddPartnerPairButton();
}

function showPlayerInput() {
  elements.playerInputRow.style.display = "flex";
  elements.addPlayerBtn.style.display = "none";
  elements.playerNameInput.focus();
}

function hidePlayerInput() {
  elements.playerInputRow.style.display = "none";
  elements.addPlayerBtn.style.display = "block";
  elements.playerNameInput.value = "";
}

// ===== Preferred Partners Management =====
function updateAddPartnerPairButton() {
  // Enable button only if we have at least 2 players and not all are already paired
  const availablePlayers = getAvailablePlayersForPairing();
  elements.addPartnerPairBtn.disabled = availablePlayers.length < 2;
}

function getAvailablePlayersForPairing() {
  const pairedPlayerIds = new Set();
  state.preferredPartners.forEach((pair) => {
    pairedPlayerIds.add(pair.player1Id);
    pairedPlayerIds.add(pair.player2Id);
  });
  return state.players.filter((p) => !pairedPlayerIds.has(p.id));
}

function addPreferredPair() {
  const available = getAvailablePlayersForPairing();
  if (available.length < 2) return;

  // Add new pair with first two available players as defaults
  state.preferredPartners.push({
    id: Date.now(),
    player1Id: available[0].id,
    player2Id: available[1].id,
  });

  renderPreferredPartners();
  updateAddPartnerPairButton();
  saveState();
}

function removePreferredPair(pairId) {
  state.preferredPartners = state.preferredPartners.filter(
    (p) => p.id !== pairId
  );
  renderPreferredPartners();
  updateAddPartnerPairButton();
  saveState();
}

function updatePreferredPair(pairId, which, playerId) {
  const pair = state.preferredPartners.find((p) => p.id === pairId);
  if (pair) {
    if (which === 1) pair.player1Id = playerId;
    else pair.player2Id = playerId;
    saveState();
  }
}

function renderPreferredPartners() {
  // Get IDs of all players in ANY pair (except the given pair)
  const getAllPairedIds = (excludePairId) => {
    const ids = new Set();
    state.preferredPartners.forEach((p) => {
      if (p.id !== excludePairId) {
        ids.add(p.player1Id);
        ids.add(p.player2Id);
      }
    });
    return ids;
  };

  elements.preferredPartnersList.innerHTML = state.preferredPartners
    .map((pair) => {
      const pairedElsewhere = getAllPairedIds(pair.id);

      // Available: not paired elsewhere, OR is this pair's current selection
      const available = state.players.filter(
        (p) =>
          p.id === pair.player1Id ||
          p.id === pair.player2Id ||
          !pairedElsewhere.has(p.id)
      );

      // Available for dropdown 1: exclude player2's selection (unless it's player1's own selection)
      const availableFor1 = available.filter(
        (p) => p.id !== pair.player2Id || p.id === pair.player1Id
      );
      // Available for dropdown 2: exclude player1's selection (unless it's player2's own selection)
      const availableFor2 = available.filter(
        (p) => p.id !== pair.player1Id || p.id === pair.player2Id
      );

      return `
        <div class="partner-pair" data-pair-id="${pair.id}">
          <select class="form-select" onchange="updatePreferredPair(${
            pair.id
          }, 1, parseInt(this.value))">
            ${availableFor1
              .map(
                (p) =>
                  `<option value="${p.id}" ${
                    p.id === pair.player1Id ? "selected" : ""
                  }>${p.name}</option>`
              )
              .join("")}
          </select>
          <span class="pair-separator">&</span>
          <select class="form-select" onchange="updatePreferredPair(${
            pair.id
          }, 2, parseInt(this.value))">
            ${availableFor2
              .map(
                (p) =>
                  `<option value="${p.id}" ${
                    p.id === pair.player2Id ? "selected" : ""
                  }>${p.name}</option>`
              )
              .join("")}
          </select>
          <button class="remove-pair-btn" onclick="removePreferredPair(${
            pair.id
          })">✕</button>
        </div>
      `;
    })
    .join("");
}

// Make partner functions available globally
window.updatePreferredPair = updatePreferredPair;
window.removePreferredPair = removePreferredPair;

// ===== Court Naming Helper =====
function getCourtName(courtNumber) {
  switch (state.courtFormat) {
    case "number":
      return `${courtNumber}`;
    case "court":
      return `Court ${courtNumber}`;
    case "custom":
      return state.customCourtNames[courtNumber - 1] || `Court ${courtNumber}`;
    default:
      return `Court ${courtNumber}`;
  }
}

function toggleCustomCourtNames() {
  const isCustom = state.courtFormat === "custom";
  elements.customCourtNamesSection.style.display = isCustom ? "block" : "none";
  if (isCustom) {
    renderCustomCourtNames();
  }
}

function renderCustomCourtNames() {
  const count = state.courts || 2;
  // Ensure array has enough elements
  while (state.customCourtNames.length < count) {
    state.customCourtNames.push(`Court ${state.customCourtNames.length + 1}`);
  }

  elements.customCourtNamesList.innerHTML = Array.from(
    { length: count },
    (_, i) => `
    <div class="custom-court-name-row">
      <input type="text" class="form-input" 
             value="${state.customCourtNames[i] || `Court ${i + 1}`}"
             onchange="updateCustomCourtName(${i}, this.value)"
             placeholder="Court ${i + 1}">
    </div>
  `
  ).join("");
}

function updateCustomCourtName(index, value) {
  state.customCourtNames[index] = value || `Court ${index + 1}`;
  saveState();
}

window.updateCustomCourtName = updateCustomCourtName;

// ===== Americano Algorithm (Round Robin) =====
function generateAmericanoSchedule() {
  const players = [...state.players];
  const n = players.length;
  const courts = state.courts;

  // Handle odd number of players with a "bye" player
  if (n % 2 !== 0) {
    players.push({ id: -1, name: "BYE", isBye: true });
  }

  const numPlayers = players.length;
  const rounds = [];

  // Circle method for round-robin
  // Fix first player, rotate others
  const fixed = players[0];
  const rotating = players.slice(1);

  for (let round = 0; round < numPlayers - 1; round++) {
    const roundPlayers = [fixed, ...rotating];
    const pairs = [];

    // Create pairs: 0-last, 1-second-last, etc.
    for (let i = 0; i < numPlayers / 2; i++) {
      const p1 = roundPlayers[i];
      const p2 = roundPlayers[numPlayers - 1 - i];
      if (!p1.isBye && !p2.isBye) {
        pairs.push([p1, p2]);
      }
    }

    // Form matches from pairs (2 pairs = 1 match: Team1 vs Team2)
    const matches = [];
    const playersInMatches = new Set();
    for (let i = 0; i < pairs.length - 1; i += 2) {
      if (pairs[i] && pairs[i + 1]) {
        matches.push({
          court: Math.floor(i / 2) + 1,
          team1: pairs[i],
          team2: pairs[i + 1],
        });
        pairs[i].forEach((p) => playersInMatches.add(p.id));
        pairs[i + 1].forEach((p) => playersInMatches.add(p.id));
      }
    }

    // Determine byes: players not in matches for this round
    const roundMatches = matches.slice(0, courts);
    const playersInRound = new Set();
    roundMatches.forEach((m) => {
      m.team1.forEach((p) => playersInRound.add(p.id));
      m.team2.forEach((p) => playersInRound.add(p.id));
    });
    const byes = state.players.filter(
      (p) => !p.isBye && !playersInRound.has(p.id)
    );

    if (roundMatches.length > 0) {
      rounds.push({
        number: rounds.length + 1,
        matches: roundMatches,
        byes,
      });
    }

    // Rotate: move last to position 1
    rotating.unshift(rotating.pop());
  }

  return rounds;
}

// ===== Team Americano Algorithm (Round Robin 1v1) =====
function generateTeamSchedule() {
  const players = [...state.players];
  const n = players.length;
  const courts = state.courts;

  // Handle odd number of teams with a "bye" team
  if (n % 2 !== 0) {
    players.push({ id: -1, name: "BYE", isBye: true });
  }

  const numPlayers = players.length;
  const rounds = [];

  // Circle method for round-robin
  const fixed = players[0];
  const rotating = players.slice(1);

  for (let round = 0; round < numPlayers - 1; round++) {
    const roundPlayers = [fixed, ...rotating];

    // Create matches directly: 0 vs last, 1 vs second-last, etc.
    const matches = [];
    const playersInMatches = new Set();

    for (let i = 0; i < numPlayers / 2; i++) {
      const p1 = roundPlayers[i]; // Team 1
      const p2 = roundPlayers[numPlayers - 1 - i]; // Team 2

      if (!p1.isBye && !p2.isBye) {
        matches.push({
          court: matches.length + 1,
          team1: [p1], // Array for compatibility
          team2: [p2], // Array for compatibility
        });
        playersInMatches.add(p1.id);
        playersInMatches.add(p2.id);
      }
    }

    // Determine byes
    // Slice matches to fit available courts
    const roundMatches = matches.slice(0, courts);
    const playersInRound = new Set();
    roundMatches.forEach((m) => {
      m.team1.forEach((p) => playersInRound.add(p.id));
      m.team2.forEach((p) => playersInRound.add(p.id));
    });
    const byes = state.players.filter(
      (p) => !p.isBye && !playersInRound.has(p.id)
    );

    if (roundMatches.length > 0) {
      rounds.push({
        number: rounds.length + 1,
        matches: roundMatches,
        byes,
      });
    }

    // Rotate
    rotating.unshift(rotating.pop());
  }

  return rounds;
}

// ===== Team Mexicano Algorithm (Fixed Teams + Dynamic Pairing) =====
function generateTeamMexicanoFirstRound() {
  const teams = [...state.players];
  shuffleArray(teams);

  const courts = state.courts;
  const matches = [];
  const playersInMatches = new Set();

  for (let i = 0; i < teams.length - 1 && matches.length < courts; i += 2) {
    matches.push({
      court: matches.length + 1,
      team1: [teams[i]],
      team2: [teams[i + 1]],
    });
    playersInMatches.add(teams[i].id);
    playersInMatches.add(teams[i + 1].id);
  }

  const byes = teams.filter((t) => !playersInMatches.has(t.id));

  return [{ number: 1, matches, byes }];
}

function generateTeamMexicanoNextRound() {
  const sorted = [...state.leaderboard].sort((a, b) => b.points - a.points);
  const courts = state.courts;

  const available = sorted.filter((t) => !state.manualByes.includes(t.id));
  const manualByePlayers = sorted.filter((t) =>
    state.manualByes.includes(t.id)
  );

  const matches = [];
  const playersInMatches = new Set();

  for (let i = 0; i < available.length - 1 && matches.length < courts; i += 2) {
    matches.push({
      court: matches.length + 1,
      team1: [available[i]],
      team2: [available[i + 1]],
    });
    playersInMatches.add(available[i].id);
    playersInMatches.add(available[i + 1].id);
  }

  const byes = [
    ...manualByePlayers,
    ...available.filter((t) => !playersInMatches.has(t.id)),
  ];

  return { number: state.currentRound + 1, matches, byes };
}

// ===== Mexicano Algorithm (Dynamic Pairing) =====
function generateMexicanoFirstRound() {
  const courts = state.courts;
  const playersNeeded = courts * 4;

  // Sort by byeCount (priority to those who have sat out most), then random for ties
  const sorted = [...state.players].sort((a, b) => {
    const aByeCount =
      state.leaderboard.find((p) => p.id === a.id)?.byeCount || 0;
    const bByeCount =
      state.leaderboard.find((p) => p.id === b.id)?.byeCount || 0;
    if (bByeCount !== aByeCount) return bByeCount - aByeCount; // More byes = plays first
    return Math.random() - 0.5; // Random for ties
  });

  // Select players for matches (prioritize those with more byes)
  const playersInRound = sorted.slice(
    0,
    Math.min(playersNeeded, sorted.length)
  );
  const byes = sorted.slice(Math.min(playersNeeded, sorted.length));

  // Shuffle the selected players for team formation
  const shuffled = playersInRound.sort(() => Math.random() - 0.5);
  const matches = [];
  const playersInMatches = new Set();

  for (let i = 0; i < shuffled.length - 3; i += 4) {
    if (matches.length >= courts) break;
    const p1 = shuffled[i],
      p2 = shuffled[i + 1],
      p3 = shuffled[i + 2],
      p4 = shuffled[i + 3];

    // Apply pairing strategy even for first round (for non-optimal strategies)
    const pairings = [
      { name: "oneThree", team1: [p1, p3], team2: [p2, p4] },
      { name: "oneTwo", team1: [p1, p2], team2: [p3, p4] },
      { name: "oneFour", team1: [p1, p4], team2: [p2, p3] },
    ];

    // For first round, optimal = random (no history yet), so use oneThree as default
    let selectedPairing;
    if (state.pairingStrategy === "optimal") {
      // No history for optimal yet, use standard Mexicano pairing
      selectedPairing = pairings[0]; // oneThree
    } else {
      selectedPairing =
        pairings.find((p) => p.name === state.pairingStrategy) || pairings[0];
    }

    matches.push({
      court: matches.length + 1,
      team1: selectedPairing.team1,
      team2: selectedPairing.team2,
    });
    [p1, p2, p3, p4].forEach((p) => playersInMatches.add(p.id));
  }

  return [
    {
      number: 1,
      matches,
      byes,
    },
  ];
}

function generateMexicanoNextRound(leaderboard) {
  const courts = state.courts;
  const playersNeeded = courts * 4;

  // Separate manually selected byes from available players
  const manualByePlayers = leaderboard.filter((p) =>
    state.manualByes.includes(p.id)
  );
  const availablePlayers = leaderboard.filter(
    (p) => !state.manualByes.includes(p.id)
  );

  // Sort available players: those with most byes get priority to play
  const sortedByByes = [...availablePlayers].sort((a, b) => {
    // First priority: more byes = should play
    if ((b.byeCount || 0) !== (a.byeCount || 0)) {
      return (b.byeCount || 0) - (a.byeCount || 0);
    }
    // Second: fewer played games = should play
    return (a.played || 0) - (b.played || 0);
  });

  // Select who plays this round (excluding manual byes)
  const playersInRound = sortedByByes.slice(
    0,
    Math.min(playersNeeded, sortedByByes.length)
  );

  // Byes include: manual selections + anyone who couldn't play due to court limits
  const automaticByes = sortedByByes.slice(
    Math.min(playersNeeded, sortedByByes.length)
  );
  const byes = [...manualByePlayers, ...automaticByes];

  // Now sort the playing players by points for matchmaking
  const sortedByPoints = [...playersInRound].sort(
    (a, b) => b.points - a.points
  );

  const matches = [];
  const playersInMatches = new Set();

  // Group top 4, next 4, etc. and form teams based on strategy
  for (let i = 0; i < sortedByPoints.length - 3; i += 4) {
    if (matches.length >= courts) break;
    const p1 = sortedByPoints[i], // Best in group
      p2 = sortedByPoints[i + 1],
      p3 = sortedByPoints[i + 2],
      p4 = sortedByPoints[i + 3]; // Worst in group

    // All possible team formations
    const pairings = [
      { name: "oneThree", team1: [p1, p3], team2: [p2, p4] }, // 1&3 vs 2&4
      { name: "oneTwo", team1: [p1, p2], team2: [p3, p4] }, // 1&2 vs 3&4
      { name: "oneFour", team1: [p1, p4], team2: [p2, p3] }, // 1&4 vs 2&3
    ];

    let selectedPairing;

    if (state.pairingStrategy === "optimal") {
      // Score each pairing and pick the one with fewest partner repeats
      const scoredPairings = pairings.map((pairing) => {
        let score = 0;
        // Check how many times these partners have played together
        const t1p1 = state.leaderboard.find(
          (p) => p.id === pairing.team1[0].id
        );
        const t1p2 = state.leaderboard.find(
          (p) => p.id === pairing.team1[1].id
        );
        const t2p1 = state.leaderboard.find(
          (p) => p.id === pairing.team2[0].id
        );
        const t2p2 = state.leaderboard.find(
          (p) => p.id === pairing.team2[1].id
        );

        // Count partner history (stored in playedWith array)
        if (t1p1?.playedWith)
          score += t1p1.playedWith.filter(
            (id) => id === pairing.team1[1].id
          ).length;
        if (t2p1?.playedWith)
          score += t2p1.playedWith.filter(
            (id) => id === pairing.team2[1].id
          ).length;

        return { ...pairing, score };
      });

      // Pick pairing with lowest score (fewest repeats)
      selectedPairing = scoredPairings.sort((a, b) => a.score - b.score)[0];
    } else {
      // Use specified strategy
      selectedPairing =
        pairings.find((p) => p.name === state.pairingStrategy) || pairings[0];
    }

    matches.push({
      court: matches.length + 1,
      team1: selectedPairing.team1,
      team2: selectedPairing.team2,
    });
    [p1, p2, p3, p4].forEach((p) => playersInMatches.add(p.id));
  }

  return {
    number: state.currentRound + 1,
    matches,
    byes,
  };
}

// ===== Schedule Generation =====
function generateSchedule() {
  state.format = elements.format.value;
  state.courts = parseInt(elements.courts.value);
  state.scoringMode = elements.scoringMode.value;
  state.pointsPerMatch = parseInt(elements.points.value);
  state.currentRound = 1;

  // Validate player count vs courts
  const playersNeededPerCourt = state.format === "team" ? 2 : 4;
  const maxPossibleCourts = Math.floor(
    state.players.length / playersNeededPerCourt
  );

  if (state.courts > maxPossibleCourts) {
    if (maxPossibleCourts === 0) {
      alert(
        `You need at least ${playersNeededPerCourt} players/teams to start!`
      );
      return;
    }
    const confirmReduce = confirm(
      `You selected ${state.courts} courts, but only have ${state.players.length} players. ` +
        `This is enough for ${maxPossibleCourts} court(s). ` +
        `Reduce courts to ${maxPossibleCourts} and continue?`
    );
    if (!confirmReduce) return;
    state.courts = maxPossibleCourts;
    if (elements.courts) elements.courts.value = state.courts;
  }

  // Reset leaderboard
  state.leaderboard = state.players.map((p) => ({
    ...p,
    points: 0,
    wins: 0,
    losses: 0,
    pointsLost: 0,
    played: 0,
    byeCount: 0, // Track how many times this player has sat out
    playedWith: [], // Track partner history for optimal pairing
  }));

  if (state.format === "americano") {
    // Pre-generate all rounds but only show current
    state.allRounds = generateAmericanoSchedule();
    state.schedule = [state.allRounds[0]];
  } else if (state.format === "team") {
    // Pre-generate all rounds (1v1 team logic)
    state.allRounds = generateTeamSchedule();
    state.schedule = [state.allRounds[0]];
  } else if (state.format === "teamMexicano") {
    // Team Mexicano: dynamic pairing based on standings, but first round random
    state.schedule = generateTeamMexicanoFirstRound();
    state.allRounds = null;
  } else {
    // Mexicano: generate first round only
    state.schedule = generateMexicanoFirstRound();
    state.allRounds = null;
  }

  elements.leaderboardSection.style.display = "block";
  renderLeaderboard();
  renderSchedule();
  elements.scheduleSection.style.display = "block";
  elements.scheduleSection.scrollIntoView({ behavior: "smooth" });

  // Lock settings after starting tournament
  state.isLocked = true;
  updateSetupUI();

  saveState();
}

function renderSchedule() {
  const currentRound = state.schedule[state.schedule.length - 1];
  const isComplete = currentRound.completed;

  elements.roundsContainer.innerHTML = state.schedule
    .map(
      (round, roundIndex) => `
    <div class="round ${round.completed ? "completed" : ""}">
      <div class="round-header">Round ${round.number} ${
        round.completed ? "✓" : ""
      }</div>
      <div class="matches-grid">
        ${round.matches
          .map(
            (match, matchIndex) => `
          <div class="match-card">
            <div class="court-label">${getCourtName(match.court)}</div>
            <div class="match-info-sub" style="font-size: 0.8em; color: var(--text-secondary); margin-bottom: 4px;">
              ${
                state.scoringMode === "total"
                  ? `Total ${state.pointsPerMatch}`
                  : state.scoringMode === "race"
                  ? `Race to ${state.pointsPerMatch}`
                  : `${state.pointsPerMatch} mins`
              }
            </div>
            <div class="match-teams">
              <div class="team">
                <span>${match.team1[0].name}</span>
                ${match.team1[1] ? `<span>${match.team1[1].name}</span>` : ""}
              </div>
              <div class="team">
                <span>${match.team2[0].name}</span>
                ${match.team2[1] ? `<span>${match.team2[1].name}</span>` : ""}
              </div>
            </div>
            ${
              !round.completed
                ? `
            <div class="score-input-row">
              <input type="number" class="score-input" id="score-${roundIndex}-${matchIndex}-1" 
                     min="0" max="${
                       state.scoringMode === "total"
                         ? state.pointsPerMatch
                         : 999
                     }" placeholder="0" 
                     value="${match.score1 || ""}"
                     oninput="autoFillScore(${roundIndex}, ${matchIndex}, 1, this.value)">
              <span class="score-separator">-</span>
              <input type="number" class="score-input" id="score-${roundIndex}-${matchIndex}-2" 
                     min="0" max="${
                       state.scoringMode === "total"
                         ? state.pointsPerMatch
                         : 999
                     }" placeholder="0"
                     value="${match.score2 || ""}"
                     oninput="autoFillScore(${roundIndex}, ${matchIndex}, 2, this.value)">
            </div>
            `
                : `
            <div class="score-input-row">
              <span class="score-display">${match.score1} - ${match.score2}</span>
              <button class="btn btn-sm btn-ghost edit-score-btn" onclick="editRound(${roundIndex})">✏️</button>
            </div>
            `
            }
          </div>
        `
          )
          .join("")}
      </div>
      ${
        round.byes && round.byes.length > 0
          ? `
      <div class="waiting-players">
        <span class="waiting-label">⏳ Resting:</span>
        <span class="waiting-names">${round.byes
          .map((p) => p.name)
          .join(", ")}</span>
      </div>
      `
          : ""
      }
      ${
        !round.completed && roundIndex === state.schedule.length - 1
          ? `
      <div class="bye-selector">
        <div class="bye-selector-header">
          <span class="bye-selector-label">🛋️ Toggle who rests next round:</span>
          <small class="bye-hint">(${state.manualByes.length} selected)</small>
        </div>
        <div class="bye-chips">
          ${state.leaderboard
            .map(
              (p) => `
            <button class="bye-chip ${
              state.manualByes.includes(p.id) ? "selected" : ""
            }" 
                    onclick="toggleManualBye(${p.id})">
              ${p.name}
              <span class="bye-count">(${p.byeCount || 0})</span>
            </button>
          `
            )
            .join("")}
        </div>
      </div>
      <button class="btn btn-primary complete-round-btn" onclick="completeRound()">
        Complete Round ${round.number}
      </button>
      `
          : ""
      }
    </div>
  `
    )
    .join("");

  // Update slider max based on courts and apply grid settings
  updateSliderMax();
  updateGridColumns();
  updateTextSize();
}

// ===== Complete Round & Generate Next =====
function completeRound() {
  const currentRoundIndex = state.schedule.length - 1;
  const currentRound = state.schedule[currentRoundIndex];

  // Collect scores from inputs
  let allScoresValid = true;
  currentRound.matches.forEach((match, matchIndex) => {
    const score1Input = document.getElementById(
      `score-${currentRoundIndex}-${matchIndex}-1`
    );
    const score2Input = document.getElementById(
      `score-${currentRoundIndex}-${matchIndex}-2`
    );

    const score1 = parseInt(score1Input?.value) || 0;
    const score2 = parseInt(score2Input?.value) || 0;

    // Validation based on mode
    if (state.scoringMode === "total") {
      // Must equal exact total points
      if (score1 + score2 !== state.pointsPerMatch) {
        allScoresValid = false;
        score1Input?.classList.add("error");
        score2Input?.classList.add("error");
      } else {
        score1Input?.classList.remove("error");
        score2Input?.classList.remove("error");
      }
    } else {
      // Race or Time: Just ensure non-negative numbers
      // We allow 0-0 temporarily, but generally expect scores
      if (score1 < 0 || score2 < 0) {
        allScoresValid = false;
        score1Input?.classList.add("error");
        score2Input?.classList.add("error");
      } else {
        score1Input?.classList.remove("error");
        score2Input?.classList.remove("error");
      }
    }

    match.score1 = score1;
    match.score2 = score2;

    const isDraw = score1 === score2;
    const team1Won = score1 > score2;
    const team2Won = score2 > score1;

    // Update leaderboard with partner tracking
    // updatePlayerStats(playerId, pointsFor, pointsAgainst, isWin, isDraw, partnerId)
    updatePlayerStats(
      match.team1[0].id,
      score1,
      score2,
      team1Won,
      isDraw,
      match.team1[1].id
    );
    updatePlayerStats(
      match.team1[1].id,
      score1,
      score2,
      team1Won,
      isDraw,
      match.team1[0].id
    );
    updatePlayerStats(
      match.team2[0].id,
      score2,
      score1,
      team2Won,
      isDraw,
      match.team2[1].id
    );
    updatePlayerStats(
      match.team2[1].id,
      score2,
      score1,
      team2Won,
      isDraw,
      match.team2[0].id
    );
  });

  if (!allScoresValid) {
    if (state.scoringMode === "total") {
      showToast(`⚠️ Scores must sum to ${state.pointsPerMatch}`);
    } else {
      showToast("⚠️ Please enter valid positive scores");
    }
    return;
  }

  currentRound.completed = true;

  // Increment byeCount for players who sat out this round
  if (currentRound.byes && currentRound.byes.length > 0) {
    currentRound.byes.forEach((byePlayer) => {
      const player = state.leaderboard.find((p) => p.id === byePlayer.id);
      if (player) {
        player.byeCount = (player.byeCount || 0) + 1;
      }
    });
  }

  // Clear manual byes selection for next round
  state.manualByes = [];

  state.currentRound++;

  // Generate next round
  if (
    state.format === "americano" &&
    state.allRounds &&
    state.currentRound <= state.allRounds.length
  ) {
    const nextRound = { ...state.allRounds[state.currentRound - 1] };
    state.schedule.push(nextRound);
  } else if (
    state.format === "team" &&
    state.allRounds &&
    state.currentRound <= state.allRounds.length
  ) {
    const nextRound = { ...state.allRounds[state.currentRound - 1] };
    state.schedule.push(nextRound);
  } else if (state.format === "teamMexicano") {
    if (state.currentRound <= 8) {
      const nextRound = generateTeamMexicanoNextRound();
      if (nextRound.matches.length > 0) {
        state.schedule.push(nextRound);
      }
    }
  } else if (state.format === "mexicano") {
    // Check if we should generate more rounds (e.g., max 6-8 rounds)
    if (state.currentRound <= 8) {
      const nextRound = generateMexicanoNextRound(state.leaderboard);
      if (nextRound.matches.length > 0) {
        state.schedule.push(nextRound);
      }
    }
  }

  renderLeaderboard();
  renderSchedule();
  saveState();

  // Scroll to new round
  elements.roundsContainer.scrollIntoView({ behavior: "smooth", block: "end" });
}

function updatePlayerStats(
  playerId,
  pointsFor,
  pointsAgainst,
  isWin,
  isDraw,
  partnerId = null
) {
  const player = state.leaderboard.find((p) => p.id === playerId);
  if (player) {
    player.points += pointsFor;
    player.played += 1;
    player.pointsLost = (player.pointsLost || 0) + pointsAgainst;

    if (isWin) player.wins = (player.wins || 0) + 1;
    else if (!isDraw) player.losses = (player.losses || 0) + 1;

    // Track partner for optimal pairing
    if (partnerId && !player.playedWith) {
      player.playedWith = [];
    }
    if (partnerId) {
      player.playedWith.push(partnerId);
    }
  }
}

// ===== Smart Score Auto-Fill =====
function autoFillScore(roundIndex, matchIndex, team, value) {
  let parsed = parseInt(value);
  if (isNaN(parsed) || parsed < 0) return;

  // Only auto-fill for Total Points mode
  if (state.scoringMode !== "total") return;

  // Clamp to max points
  if (parsed > state.pointsPerMatch) {
    parsed = state.pointsPerMatch;
    const currentInput = document.getElementById(
      `score-${roundIndex}-${matchIndex}-${team}`
    );
    if (currentInput) currentInput.value = parsed;
  }

  const otherTeam = team === 1 ? 2 : 1;
  const otherScore = state.pointsPerMatch - parsed;
  const otherInput = document.getElementById(
    `score-${roundIndex}-${matchIndex}-${otherTeam}`
  );

  if (otherInput && otherScore >= 0) {
    otherInput.value = otherScore;
  }
}

// Make functions available globally
window.autoFillScore = autoFillScore;

// ===== Manual Bye Selection =====
function toggleManualBye(playerId) {
  const index = state.manualByes.indexOf(playerId);

  // If already selected, always allow removal
  if (index !== -1) {
    state.manualByes.splice(index, 1);
    renderSchedule();
    return;
  }

  // Adding a player to rest - check max limit
  const playersNeeded = state.courts * 4;
  const totalPlayers = state.leaderboard.length;
  const maxResting = Math.max(0, totalPlayers - playersNeeded);

  if (maxResting === 0) {
    showToast(
      `⚠️ All ${totalPlayers} players needed for ${state.courts} courts.`
    );
    return;
  }

  if (state.manualByes.length >= maxResting) {
    showToast(`⚠️ Max ${maxResting} can rest. Deselect someone first.`);
    return;
  }

  state.manualByes.push(playerId);
  renderSchedule();
}

// Toast notification
function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("visible"), 10);
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

window.toggleManualBye = toggleManualBye;

// ===== Edit Previous Round =====
function editRound(roundIndex) {
  const round = state.schedule[roundIndex];
  if (!round || !round.completed) return;

  // Confirm if there are subsequent rounds that will be lost
  const hasSubsequentRounds = state.schedule.length > roundIndex + 1;
  if (hasSubsequentRounds) {
    const confirmEdit = confirm(
      `Editing Round ${roundIndex + 1} will remove ${
        state.schedule.length - roundIndex - 1
      } subsequent round(s). Continue?`
    );
    if (!confirmEdit) return;
  }

  // Subtract points for this round and all subsequent rounds
  for (let i = roundIndex; i < state.schedule.length; i++) {
    const r = state.schedule[i];
    if (r.completed) {
      r.matches.forEach((match) => {
        subtractPlayerPoints(match.team1[0].id, match.score1 || 0);
        subtractPlayerPoints(match.team1[1].id, match.score1 || 0);
        subtractPlayerPoints(match.team2[0].id, match.score2 || 0);
        subtractPlayerPoints(match.team2[1].id, match.score2 || 0);
      });
    }
  }

  // Remove subsequent rounds
  state.schedule = state.schedule.slice(0, roundIndex + 1);

  // Mark this round as incomplete
  round.completed = false;

  // Update current round counter
  state.currentRound = roundIndex;

  // Re-render
  renderLeaderboard();
  renderSchedule();
  saveState();

  showToast(`📝 Editing Round ${roundIndex + 1}`);
}

function subtractPlayerStats(
  playerId,
  pointsFor,
  pointsAgainst,
  isWin,
  isDraw
) {
  const player = state.leaderboard.find((p) => p.id === playerId);
  if (player) {
    player.points -= pointsFor;
    player.played -= 1;
    player.pointsLost = (player.pointsLost || 0) - pointsAgainst;

    if (isWin) player.wins = (player.wins || 0) - 1;
    else if (!isDraw) player.losses = (player.losses || 0) - 1;

    if (player.played < 0) player.played = 0;
    if (player.points < 0) player.points = 0;
    if (player.wins < 0) player.wins = 0;
    if (player.losses < 0) player.losses = 0;
    if (player.pointsLost < 0) player.pointsLost = 0;
  }
}

window.editRound = editRound;

// ===== Settings Lock/Unlock UI =====
function updateSetupUI() {
  const format = elements.format ? elements.format.value : "americano";
  const isTeam = format === "team" || format === "teamMexicano";

  // Update UI labels for Team Mode
  const playersHeader = document.getElementById("playersHeader");
  if (playersHeader) {
    // Preserves the span (player count)
    const countSpan = playersHeader.querySelector(".player-count");
    if (playersHeader.firstChild) {
      playersHeader.firstChild.textContent = isTeam ? "Teams " : "Players ";
    }
  }

  if (elements.addPlayerBtn) {
    elements.addPlayerBtn.textContent = isTeam ? "+ Add Team" : "+ Add Player";
  }

  if (elements.playerNameInput) {
    elements.playerNameInput.placeholder = isTeam
      ? "Enter team name..."
      : "Enter name...";
  }

  const setupCard = document.querySelector(".setup-card");
  if (!setupCard) return;

  // Disable form inputs when locked
  const inputs = setupCard.querySelectorAll("input, select, button");
  inputs.forEach((input) => {
    if (state.isLocked && !input.classList.contains("always-enabled")) {
      input.disabled = true;
      input.classList.add("locked");
    } else {
      input.disabled = false;
      input.classList.remove("locked");
    }
  });

  // Update generate button text
  if (state.isLocked) {
    elements.generateBtn.textContent = "🔒 Tournament Running";
    elements.generateBtn.disabled = true;
  } else {
    elements.generateBtn.textContent = "Generate Schedule";
    elements.generateBtn.disabled = false;
  }
}

// ===== Late Arrival =====
function promptAddLatePlayer() {
  const isTeam = state.format === "team";
  // Check if showInputModal is defined (it might not be if previous edits failed)
  if (typeof showInputModal === "function") {
    showInputModal(
      isTeam ? "Add Late Team" : "Add Late Player",
      isTeam ? "Enter new team name:" : "Enter new player name:",
      (name) => {
        if (name && name.trim()) {
          addLatePlayer(name.trim());
        }
      }
    );
  } else {
    // Fallback to native prompt if modal logic is missing
    const name = prompt(
      isTeam ? "Enter new team name:" : "Enter new player name:"
    );
    if (name && name.trim()) {
      addLatePlayer(name.trim());
    }
  }
}

window.promptAddLatePlayer = promptAddLatePlayer;

function addLatePlayer(name) {
  // Check if Americano/Team and warn about format switch
  if (state.format === "americano" || state.format === "team") {
    const confirmSwitch = confirm(
      "Adding a player/team mid-tournament will switch the remaining rounds to Mexicano (Dynamic) logic to accommodate the change. Continue?"
    );
    if (!confirmSwitch) return;

    // Switch format to Mexicano to allow dynamic generation
    state.format = "mexicano";
    state.allRounds = null; // Clear pre-generated rounds
    showToast("Switched to Mexicano format");
  }

  const newPlayer = {
    id: Date.now(),
    name: name,
    points: 0,
    wins: 0,
    losses: 0,
    played: 0,
    pointsLost: 0,
    byeCount: 0,
    playedWith: [],
  };

  state.players.push(newPlayer);
  state.leaderboard.push(newPlayer);

  const countSpan = document.getElementById("playerCount");
  if (countSpan) {
    countSpan.textContent = `(${state.players.length})`;
  }

  renderLeaderboard();
  showToast(`Added ${name} to tournament`);
  saveState();
}

// ===== UI Helpers =====
function showConfirmModal(title, message, confirmText = "Confirm", onConfirm) {
  // Remove existing modal
  const existing = document.querySelector(".confirm-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.className = "modal-overlay confirm-modal";
  modal.style.display = "flex";

  modal.innerHTML = `
    <div class="modal" style="max-width: 400px; text-align: center;">
      <div class="modal-header">
        <h3>${title}</h3>
      </div>
      <div class="modal-body">
        <p>${message}</p>
      </div>
      <div class="modal-footer" style="justify-content: center; gap: 10px;">
        <button class="btn btn-secondary" id="modalCancelBtn">Cancel</button>
        <button class="btn btn-primary" id="modalConfirmBtn">${confirmText}</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Stop clicks inside modal from bubbling to overlay
  const innerModal = modal.querySelector(".modal");
  if (innerModal) {
    innerModal.addEventListener("click", (e) => e.stopPropagation());
  }

  const cancelBtn = modal.querySelector("#modalCancelBtn");
  const confirmBtn = modal.querySelector("#modalConfirmBtn");

  console.log("Modal buttons found:", {
    cancelBtn: !!cancelBtn,
    confirmBtn: !!confirmBtn,
  });

  const close = () => modal.remove();

  if (cancelBtn) {
    cancelBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Cancel clicked");
      close();
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Confirm button clicked!");
      close();
      onConfirm();
    });
  }

  // Click outside (on overlay) to dismiss
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
}

function showInputModal(title, placeholder, onConfirm) {
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

// ===== End Tournament =====
function endTournament() {
  showConfirmModal(
    "🏁 End Tournament?",
    "This will show final standings. This action cannot be undone.",
    "End Tournament",
    () => {
      // Unlock settings
      state.isLocked = false;
      state.hideLeaderboard = false;
      updateSetupUI();

      // Show final stats modal
      const sorted = [...state.leaderboard].sort((a, b) => b.points - a.points);
      showFinalStandings(sorted);

      saveState();
    }
  );
}

function showFinalStandings(standings) {
  // Remove existing modal
  const existing = document.querySelector(".final-modal");
  if (existing) existing.remove();

  const medal = (i) =>
    i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;

  const modal = document.createElement("div");
  modal.className = "final-modal";
  modal.innerHTML = `
    <div class="final-modal-content">
      <h2>🏆 Tournament Complete!</h2>
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
      <button class="btn btn-primary" onclick="closeFinalModal()">Close</button>
    </div>
  `;
  document.body.appendChild(modal);

  // Animate in
  setTimeout(() => modal.classList.add("visible"), 10);
}

function closeFinalModal() {
  const modal = document.querySelector(".final-modal");
  if (modal) {
    modal.classList.remove("visible");
    setTimeout(() => modal.remove(), 300);
  }
}

window.closeFinalModal = closeFinalModal;

window.endTournament = endTournament;

// ===== Toggle Leaderboard Visibility =====
function toggleLeaderboardVisibility() {
  state.hideLeaderboard = !state.hideLeaderboard;
  renderLeaderboard();
  saveState();
}

window.toggleLeaderboardVisibility = toggleLeaderboardVisibility;

// ===== Toggle Position Changes =====
function togglePositionChanges() {
  state.showPositionChanges = !state.showPositionChanges;
  renderLeaderboard();
  saveState();
}

window.togglePositionChanges = togglePositionChanges;

// Make completeRound available globally
window.completeRound = completeRound;

function updateRankingCriteria() {
  const select = document.getElementById("rankingCriteria");
  if (select) {
    state.rankingCriteria = select.value;
    renderLeaderboard();
    saveState();
  }
}
window.updateRankingCriteria = updateRankingCriteria;

function renderLeaderboard() {
  if (!state.leaderboard || state.leaderboard.length === 0) {
    elements.leaderboardBody.innerHTML =
      '<tr><td colspan="7" class="text-center">No players yet</td></tr>';
    return;
  }

  // Sort Logic
  const sorted = [...state.leaderboard].sort((a, b) => {
    switch (state.rankingCriteria) {
      case "wins":
        // Wins -> Points -> Diff
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.points !== a.points) return b.points - a.points;
        return b.points - b.pointsLost - (a.points - a.pointsLost);

      case "winRatio":
        // Win Rate -> Wins -> Points
        const aRate = a.played > 0 ? a.wins / a.played : 0;
        const bRate = b.played > 0 ? b.wins / b.played : 0;
        if (Math.abs(bRate - aRate) > 0.001) return bRate - aRate;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.points - a.points;

      case "pointRatio":
        // Point Win % -> Points -> Wins
        const aTotal = a.points + a.pointsLost;
        const bTotal = b.points + b.pointsLost;
        const aPRate = aTotal > 0 ? a.points / aTotal : 0;
        const bPRate = bTotal > 0 ? b.points / bTotal : 0;
        if (Math.abs(bPRate - aPRate) > 0.001) return bPRate - aPRate;
        return b.points - a.points;

      case "points":
      default:
        // Points -> Wins -> Diff
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.points - b.pointsLost - (a.points - a.pointsLost);
    }
  });

  if (state.hideLeaderboard) {
    // Show just names in random order (no ranking visible)
    const shuffled = [...sorted].sort(() => Math.random() - 0.5);
    elements.leaderboardBody.innerHTML = shuffled
      .map(
        (player) => `
    <tr>
      <td>-</td>
      <td>${player.name}</td>
      <td>🔒</td>
      <td>🔒</td>
      <td>🔒</td>
      <td>🔒</td>
      <td>${player.played}</td>
    </tr>
  `
      )
      .join("");
  } else {
    // Calculate position changes
    sorted.forEach((player, index) => {
      const currentRank = index + 1;
      const prevRank = player.previousRank || currentRank;
      player.rankChange = prevRank - currentRank;
      player.previousRank = currentRank;
    });

    elements.leaderboardBody.innerHTML = sorted
      .map((player, index) => {
        let changeIndicator = "";
        if (state.showPositionChanges && player.played > 0) {
          if (player.rankChange > 0) {
            changeIndicator = '<span class="rank-up">▲</span>';
          } else if (player.rankChange < 0) {
            changeIndicator = '<span class="rank-down">▼</span>';
          } else {
            changeIndicator = '<span class="rank-same">●</span>';
          }
        }

        // Stats calculation
        const diff = player.points - (player.pointsLost || 0);
        const winRate =
          player.played > 0
            ? Math.round(((player.wins || 0) / player.played) * 100)
            : 0;
        const diffSign = diff > 0 ? "+" : "";

        return `
    <tr>
      <td>${index + 1} ${changeIndicator}</td>
      <td class="player-name-cell">${player.name}</td>
      <td class="font-bold">${player.points}</td>
      <td>${player.wins || 0}</td>
      <td class="${
        diff > 0 ? "text-success" : diff < 0 ? "text-error" : ""
      }">${diffSign}${diff}</td>
      <td>${winRate}%</td>
      <td>${player.played}</td>
    </tr>
  `;
      })
      .join("");
  }
}

function resetSchedule() {
  showConfirmModal(
    "↺ Reset Tournament?",
    "This will clear all rounds and scores.",
    "Reset",
    () => {
      // Reset all tournament state
      state.schedule = [];
      state.currentRound = 0;
      state.leaderboard = [];
      state.allRounds = null;
      state.isLocked = false;
      state.hideLeaderboard = false;
      state.manualByes = [];

      // Hide sections
      elements.scheduleSection.style.display = "none";
      elements.leaderboardSection.style.display = "none";

      // Unlock settings
      updateSetupUI();

      saveState();
      showToast("✅ Tournament reset");
    }
  );
}

function saveState() {
  localStorage.setItem(
    "tournament-state",
    JSON.stringify({
      // Settings
      players: state.players,
      format: state.format,
      courts: state.courts,
      scoringMode: state.scoringMode,
      pointsPerMatch: state.pointsPerMatch,
      courtFormat: state.courtFormat,
      customCourtNames: state.customCourtNames,
      maxRepeats: state.maxRepeats,
      pairingStrategy: state.pairingStrategy,
      preferredPartners: state.preferredPartners,
      // Active tournament state
      schedule: state.schedule,
      currentRound: state.currentRound,
      leaderboard: state.leaderboard,
      allRounds: state.allRounds,
      isLocked: state.isLocked,
      hideLeaderboard: state.hideLeaderboard,
      manualByes: state.manualByes,
      gridColumns: state.gridColumns,
      textSize: state.textSize,
    })
  );
}

function loadState() {
  const saved = localStorage.getItem("tournament-state");
  if (saved) {
    const data = JSON.parse(saved);

    // Load settings
    state.players = data.players || [];
    state.format = data.format || "americano";
    state.courts = data.courts || 2;
    state.pointsPerMatch = data.pointsPerMatch || 24;
    state.courtFormat = data.courtFormat || "court";
    state.customCourtNames = data.customCourtNames || [];
    state.maxRepeats = data.maxRepeats !== undefined ? data.maxRepeats : 99;
    state.pairingStrategy = data.pairingStrategy || "optimal";
    state.preferredPartners = data.preferredPartners || [];

    // Load active tournament state
    state.schedule = data.schedule || [];
    state.currentRound = data.currentRound || 0;
    state.leaderboard = data.leaderboard || [];
    state.allRounds = data.allRounds || null;
    state.isLocked = data.isLocked || false;
    state.hideLeaderboard = data.hideLeaderboard || false;
    state.manualByes = data.manualByes || [];
    state.gridColumns = data.gridColumns || 0;
    state.textSize = data.textSize || 100;

    // Update UI for settings
    elements.format.value = state.format;
    elements.courts.value = state.courts;
    elements.points.value = state.pointsPerMatch;
    elements.courtFormat.value = state.courtFormat;
    elements.maxRepeats.value = state.maxRepeats;
    if (elements.pairingStrategy)
      elements.pairingStrategy.value = state.pairingStrategy;
    toggleCustomCourtNames();
    renderPlayers();

    // Restore active tournament if exists
    if (state.schedule.length > 0) {
      elements.scheduleSection.style.display = "block";
      elements.leaderboardSection.style.display = "block";
      renderSchedule();
      renderLeaderboard();
      updateSetupUI();
      updateGridColumns();
    }
  }
}

// ===== Event Listeners =====
function initEventListeners() {
  // Theme toggle
  elements.themeToggle.addEventListener("click", toggleTheme);

  // Player management
  elements.addPlayerBtn.addEventListener("click", showPlayerInput);
  elements.cancelAddBtn.addEventListener("click", hidePlayerInput);
  if (elements.clearAllPlayersBtn) {
    elements.clearAllPlayersBtn.addEventListener("click", removeAllPlayers);
  }

  // Bulk Import
  elements.importPlayersBtn.addEventListener("click", showImportModal);
  elements.closeImportModal.addEventListener("click", hideImportModal);
  elements.cancelImportBtn.addEventListener("click", hideImportModal);
  elements.confirmImportBtn.addEventListener("click", importPlayers);

  elements.confirmAddBtn.addEventListener("click", () => {
    if (addPlayer(elements.playerNameInput.value)) {
      elements.playerNameInput.value = "";
      elements.playerNameInput.focus();
    }
  });
  elements.playerNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (addPlayer(elements.playerNameInput.value)) {
        elements.playerNameInput.value = "";
      }
    } else if (e.key === "Escape") {
      hidePlayerInput();
    }
  });

  // Form changes
  elements.format.addEventListener("change", () => {
    state.format = elements.format.value;
    saveState();
  });
  elements.courts.addEventListener("change", () => {
    state.courts = parseInt(elements.courts.value);
    saveState();
  });
  elements.points.addEventListener("change", () => {
    state.pointsPerMatch = parseInt(elements.points.value);
    saveState();
  });
  elements.scoringMode.addEventListener("change", () => {
    state.scoringMode = elements.scoringMode.value;
    saveState();
  });
  elements.courtFormat.addEventListener("change", () => {
    state.courtFormat = elements.courtFormat.value;
    toggleCustomCourtNames();
    saveState();
  });

  // Also re-render custom names when courts count changes
  elements.courts.addEventListener("input", () => {
    if (state.courtFormat === "custom") {
      renderCustomCourtNames();
    }
  });

  // Matchup settings
  elements.maxRepeats.addEventListener("change", () => {
    state.maxRepeats = parseInt(elements.maxRepeats.value);
    saveState();
  });
  if (elements.pairingStrategy) {
    elements.pairingStrategy.addEventListener("change", () => {
      state.pairingStrategy = elements.pairingStrategy.value;
      saveState();
    });
  }
  elements.addPartnerPairBtn.addEventListener("click", addPreferredPair);

  const removeAllBtn = document.getElementById("removeAllPlayersBtn");
  if (removeAllBtn) {
    removeAllBtn.addEventListener("click", removeAllPlayers);
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
}

// ===== Grid Columns Control =====
function updateGridColumns() {
  const cols = state.gridColumns;
  const label = elements.gridColumnsLabel;
  const grids = document.querySelectorAll(".matches-grid");

  if (elements.gridColumns) {
    elements.gridColumns.value = cols;
  }

  if (cols === 0) {
    if (label) label.textContent = "Auto";
    grids.forEach((grid) => {
      grid.style.gridTemplateColumns = "";
    });
  } else {
    if (label) label.textContent = cols;
    grids.forEach((grid) => {
      grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    });
  }
}

// Update slider max based on number of courts
function updateSliderMax() {
  if (!elements.gridColumns) return;

  // Get max courts from current round or state
  let maxCourts = state.courts || 2;

  // Also check actual matches in schedule
  if (state.schedule.length > 0) {
    const currentRound = state.schedule[state.schedule.length - 1];
    if (currentRound && currentRound.matches) {
      maxCourts = Math.max(maxCourts, currentRound.matches.length);
    }
  }

  // Limit to 1-6 range
  maxCourts = Math.min(Math.max(maxCourts, 1), 6);

  elements.gridColumns.max = maxCourts;
  state.maxCourts = maxCourts; // Store for auto-calculation

  // If current value exceeds new max, reset to max or auto
  if (state.gridColumns > maxCourts && state.gridColumns !== 0) {
    state.gridColumns = maxCourts;
    updateGridColumns();
  }
}

// Calculate optimal columns based on window width
function calculateAutoColumns() {
  const grid = document.querySelector(".matches-grid");
  if (!grid) return state.maxCourts || 2;

  const gridWidth = grid.offsetWidth;
  const minCardWidth = 180; // Minimum comfortable card width
  const optimalColumns = Math.floor(gridWidth / minCardWidth);

  // Clamp to max courts available
  const maxCourts = state.maxCourts || state.courts || 2;
  return Math.min(Math.max(optimalColumns, 1), maxCourts);
}

// Auto-resize handler
let isManualMode = false;

function handleResize() {
  if (isManualMode || state.gridColumns !== 0) return; // Skip if manual mode

  const autoCols = calculateAutoColumns();
  const grids = document.querySelectorAll(".matches-grid");

  grids.forEach((grid) => {
    grid.style.gridTemplateColumns = `repeat(${autoCols}, 1fr)`;
  });

  // Update slider to show current auto value
  if (elements.gridColumns) {
    elements.gridColumns.value = autoCols;
  }
  if (elements.gridColumnsLabel) {
    elements.gridColumnsLabel.textContent = `Auto (${autoCols})`;
  }
}

// Set up resize listener
window.addEventListener("resize", handleResize);

// Override when user manually changes slider
function onSliderManualChange() {
  const value = parseInt(elements.gridColumns.value);
  if (value === 0) {
    isManualMode = false;
    handleResize(); // Re-enable auto mode
  } else {
    isManualMode = true;
  }
  state.gridColumns = value;
  updateGridColumns();
  saveState();
}

// ===== Text Size Control =====
function updateTextSize() {
  const size = state.textSize;
  const scale = size / 100;

  // Set CSS variable on schedule section for all cards to inherit
  const scheduleSection = document.getElementById("scheduleSection");
  if (scheduleSection) {
    scheduleSection.style.setProperty("--text-scale", scale);
  }

  // Update slider and label
  if (elements.textSize) {
    elements.textSize.value = size;
  }
  if (elements.textSizeLabel) {
    elements.textSizeLabel.textContent = `${size}%`;
  }
}

// ===== Make removePlayer available globally =====
window.removePlayer = removePlayer;

// ===== Initialize =====
function init() {
  initTheme();
  loadState();
  initEventListeners();
}

init();
