// Tournament Generator - State Management
// Central state object with reactive updates

// Current state version - increment when schema changes
const STATE_VERSION = 1;

export const state = {
  version: STATE_VERSION,

  // ===== Existing Americano/Mexicano fields =====
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
  hideLeaderboard: true, // Toggle to hide standings during tournament (default: hidden)
  showPositionChanges: true, // Show up/down arrows in leaderboard
  gridColumns: 0, // 0 = auto, 1-6 = fixed columns
  textSize: 100, // Text size percentage (50-150)
  bracketScale: 100, // Bracket view scale percentage (50-150)
  isLocked: false, // Lock settings after tournament starts
  tournamentName: "", // Custom tournament name
  tournamentNotes: "", // Optional notes
  schedule: [],
  currentRound: 0,
  leaderboard: [],
  allRounds: null,
  maxCourts: 2,

  // ===== Bracket Tournament (namespaced) =====
  tournament: {
    format: "single", // 'single' | 'double'
    teams: [],
    matches: [],
    standings: [],
    meta: { name: "", notes: "", createdAt: null },
  },

  // ===== Winners Court Mode =====
  winnersCourt: null, // { players, courts, courtCount, twist, round }

  // ===== UI State =====
  ui: {
    currentRoute: "",
    selectedMatchId: null,
    activeBracketTab: "A",
  },
};

// Undo History
const historyStack = [];
const MAX_HISTORY = 20;

function updateUndoButton() {
  const undoBtn = document.getElementById("undoBtn");
  if (undoBtn) {
    undoBtn.disabled = historyStack.length === 0;
  }
}

export function pushHistory() {
  const snapshot = JSON.parse(JSON.stringify(state));
  historyStack.push(snapshot);
  if (historyStack.length > MAX_HISTORY) {
    historyStack.shift();
  }
  updateUndoButton();
}

export function undoLastAction() {
  if (historyStack.length === 0) return false;
  const previousState = historyStack.pop();

  restoreState(previousState);
  updateUndoButton();
  return true;
}

export function canUndo() {
  return historyStack.length > 0;
}

import { StorageService } from "../shared/storage.js";

// LocalStorage key
const STORAGE_KEY = "tournament-state";

/**
 * Save state to localStorage
 */
export function saveState() {
  StorageService.setItem(STORAGE_KEY, {
    // Version for migrations
    version: state.version,
    // Settings
    players: state.players,
    format: state.format,
    courts: state.courts,
    scoringMode: state.scoringMode,
    pointsPerMatch: state.pointsPerMatch,
    rankingCriteria: state.rankingCriteria,
    courtFormat: state.courtFormat,
    customCourtNames: state.customCourtNames,
    maxRepeats: state.maxRepeats,
    pairingStrategy: state.pairingStrategy,
    preferredPartners: state.preferredPartners,
    tournamentName: state.tournamentName,
    tournamentNotes: state.tournamentNotes,
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
    // Bracket tournament (v1+)
    tournament: state.tournament,
    // UI state (v1+)
    ui: state.ui,
    // Winners Court (v1+)
    winnersCourt: state.winnersCourt,
  });
}

/**
 * Load state from localStorage
 * @returns {boolean} True if state was loaded
 */
export function loadState() {
  let data = StorageService.getItem(STORAGE_KEY);
  if (!data) return false;

  try {
    // Migrate old state versions
    data = migrateState(data);

    // Load settings with validation
    state.players = Array.isArray(data.players)
      ? data.players.slice(0, 200)
      : []; // Max 200 players
    state.format = data.format || "americano";
    state.courts = Math.max(1, Math.min(50, data.courts || 2));
    state.scoringMode = data.scoringMode || "total";
    state.pointsPerMatch = Math.max(
      1,
      Math.min(999, data.pointsPerMatch || 24)
    );
    state.rankingCriteria = data.rankingCriteria || "points";
    state.courtFormat = data.courtFormat || "court";
    state.customCourtNames = Array.isArray(data.customCourtNames)
      ? data.customCourtNames.slice(0, 50)
      : [];
    state.maxRepeats = Math.max(
      0,
      Math.min(99, data.maxRepeats !== undefined ? data.maxRepeats : 99)
    );
    state.pairingStrategy = data.pairingStrategy || "optimal";
    state.preferredPartners = Array.isArray(data.preferredPartners)
      ? data.preferredPartners.slice(0, 100)
      : [];
    state.tournamentName = data.tournamentName || "";
    state.tournamentNotes = data.tournamentNotes || "";

    // Load active tournament state
    state.schedule = Array.isArray(data.schedule) ? data.schedule : [];
    state.currentRound = Math.max(0, Math.min(100, data.currentRound || 0));
    state.leaderboard = Array.isArray(data.leaderboard) ? data.leaderboard : [];
    state.allRounds = data.allRounds || null;
    state.isLocked = data.isLocked || false;
    state.hideLeaderboard =
      data.hideLeaderboard !== undefined ? data.hideLeaderboard : true;
    state.manualByes = Array.isArray(data.manualByes) ? data.manualByes : [];
    state.gridColumns = Math.max(0, Math.min(10, data.gridColumns || 0));
    state.textSize = Math.max(50, Math.min(200, data.textSize || 100));
    state.bracketScale = Math.max(50, Math.min(200, data.bracketScale || 100));

    // Load bracket tournament state (v1+)
    if (data.tournament) {
      state.tournament = {
        format: data.tournament.format || "single",
        teams: data.tournament.teams || [],
        matches: data.tournament.matches || [],
        standings: data.tournament.standings || [],
        meta: data.tournament.meta || { name: "", notes: "", createdAt: null },
      };
    }

    // Load UI state (v1+)
    if (data.ui) {
      // Load UI state (v1+)
      if (data.ui) {
        state.ui = {
          currentRoute: data.ui.currentRoute || "",
          selectedMatchId: data.ui.selectedMatchId || null,
          activeBracketTab: data.ui.activeBracketTab || "A", // "A", "B", or "Final"
        };
      }
    }

    // Load Winners Court state
    state.winnersCourt = data.winnersCourt || null;

    return true;
  } catch (e) {
    console.error("Failed to load tournament state:", e);
    return false;
  }
}

/**
 * Migrate state from older versions.
 * @param {Object} data - Saved state data
 * @returns {Object} Migrated state data
 */
function migrateState(data) {
  const savedVersion = data.version || 0;

  if (savedVersion < STATE_VERSION) {
    console.log(`[State] Migrating from v${savedVersion} to v${STATE_VERSION}`);

    // v0 -> v1: Add tournament and ui namespaces
    if (savedVersion < 1) {
      data.tournament = data.tournament || {
        format: "single",
        teams: [],
        matches: [],
        standings: [],
        meta: { name: "", notes: "", createdAt: null },
      };
      data.ui = data.ui || {
        currentRoute: "",
        selectedMatchId: null,
      };
    }

    // Future migrations go here:
    // if (savedVersion < 2) { ... }

    data.version = STATE_VERSION;
  }

  return data;
}

/**
 * Reset tournament state (keep players)
 */
export function resetTournamentState() {
  state.schedule = [];
  state.currentRound = 0;
  state.leaderboard = [];
  state.allRounds = null;
  state.isLocked = false;
  state.hideLeaderboard = true;
  state.manualByes = [];
}

/**
 * Initialize leaderboard from players
 */
export function initLeaderboard() {
  state.leaderboard = state.players.map((p) => ({
    ...p,
    points: 0,
    wins: 0,
    losses: 0,
    pointsLost: 0,
    played: 0,
    byeCount: 0,
    playedWith: [],
  }));
}

/**
 * Get a full snapshot of the current state
 */
export function getStateSnapshot() {
  return JSON.parse(JSON.stringify(state));
}

/**
 * Restore state from a snapshot object
 * @param {Object} snapshot
 */
export function restoreState(snapshot) {
  if (!snapshot) return;

  // Restore all keys from snapshot to state
  Object.keys(state).forEach((key) => {
    if (snapshot.hasOwnProperty(key)) {
      state[key] = snapshot[key];
    }
  });

  // Ensure type safety for critical numeric values if needed
  state.players = state.players || [];
  state.schedule = state.schedule || [];
  state.leaderboard = state.leaderboard || [];

  saveState();
}
