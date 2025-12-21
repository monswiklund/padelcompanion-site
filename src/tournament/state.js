// Tournament Generator - State Management
// Central state object with reactive updates

export const state = {
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
  isLocked: false, // Lock settings after tournament starts
  schedule: [],
  currentRound: 0,
  leaderboard: [],
  allRounds: null,
  maxCourts: 2,
};

// Undo History
const historyStack = [];
const MAX_HISTORY = 20;

export function pushHistory() {
  const snapshot = JSON.parse(JSON.stringify(state));
  historyStack.push(snapshot);
  if (historyStack.length > MAX_HISTORY) {
    historyStack.shift();
  }
}

export function undoLastAction() {
  if (historyStack.length === 0) return false;
  const previousState = historyStack.pop();

  restoreState(previousState);
  return true;
}

export function canUndo() {
  return historyStack.length > 0;
}

// LocalStorage key
const STORAGE_KEY = "tournament-state";

/**
 * Save state to localStorage
 */
export function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
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

/**
 * Load state from localStorage
 * @returns {boolean} True if state was loaded
 */
export function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return false;

  try {
    const data = JSON.parse(saved);

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

    return true;
  } catch (e) {
    console.error("Failed to load tournament state:", e);
    return false;
  }
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
