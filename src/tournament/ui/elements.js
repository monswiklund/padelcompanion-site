// UI Elements Module
// DOM element cache and initialization

// DOM element cache
let elements = null;

/**
 * Initialize DOM element references
 * @returns {Object} Elements object
 */
export function initElements() {
  elements = {
    // Page sections for routing
    playersSection: document.querySelector(".players-section"),
    tournamentConfig: document.getElementById("tournamentConfig"),
    // Form inputs
    format: document.getElementById("format"),
    courts: document.getElementById("courts"),
    scoringMode: document.getElementById("scoringMode"),
    points: document.getElementById("points"),
    matchTimerContainer: document.getElementById("matchTimerContainer"),
    timerDisplay: document.getElementById("timerDisplay"),
    timerStartBtn: document.getElementById("timerStartBtn"),
    timerPauseBtn: document.getElementById("timerPauseBtn"),
    timerResetBtn: document.getElementById("timerResetBtn"),
    timerAddBtn: document.getElementById("timerAddBtn"),
    timerSubBtn: document.getElementById("timerSubBtn"),
    courtFormat: document.getElementById("courtFormat"),
    customCourtNamesSection: document.getElementById("customCourtNamesSection"),
    customCourtNamesList: document.getElementById("customCourtNamesList"),
    maxRepeats: document.getElementById("maxRepeats"),
    pairingStrategy: document.getElementById("pairingStrategy"),
    preferredPartnersList: document.getElementById("preferredPartnersList"),
    addPartnerPairBtn: document.getElementById("addPartnerPairBtn"),
    advancedSettingsContent: document.getElementById("advancedSettingsContent"),
    playerList: document.getElementById("playerList"),
    playerCount: document.getElementById("playerCount"),
    playersHint: document.getElementById("playersHint"),
    playerInputRow: document.getElementById("playerInputRow"),
    playerNameInput: document.getElementById("playerNameInput"),
    confirmAddBtn: document.getElementById("confirmAddBtn"),
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
    runningBadge: document.getElementById("runningBadge"),
  };
  return elements;
}

/**
 * Get cached elements (init if needed)
 * @returns {Object} Elements object
 */
export function getElements() {
  if (!elements) initElements();
  return elements;
}
