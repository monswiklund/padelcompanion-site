// UI Module Barrel Export
// Re-exports all UI sub-modules for backward compatibility

// Core
export { initElements, getElements } from "./elements.js";

// Domain modules
export {
  getCourtName,
  validateCourts,
  toggleCustomCourtNames,
  renderCustomCourtNames,
  updateCustomCourtName,
} from "./courts.js";

export {
  renderPlayers,
  togglePlayerList,
  showImportModal,
  hideImportModal,
} from "./players.js";

export {
  renderPreferredPartners,
  updateAddPartnerPairButton,
} from "./partners.js";

export {
  renderSchedule,
  autoFillScore,
  toggleRoundCollapse,
  toggleManualBye,
  completeRound,
  editRound,
  renderGameDetails,
} from "./schedule/index.js";

export {
  renderLeaderboard,
  toggleLeaderboardVisibility,
  togglePositionChanges,
  updateRankingCriteria,
} from "./leaderboard.js";

export {
  updateGridColumns,
  updateScoringLabel,
  updateSliderMax,
  handleResize,
  onSliderManualChange,
  updateTextSize,
  updateRoundScale,
} from "./controls.js";

export { setupCustomSelects } from "./customSelect.js";

export {
  updateSetupUI,
  generateSchedule,
  resetSchedule,
  endTournament,
  toggleToolbar,
  exportTournamentData,
  shareResults,
  renderTournamentSummary,
  setRenderTournamentConfigCallback,
} from "./setup.js";

export {
  renderTournamentConfig,
  initTournamentConfig,
} from "./tournamentConfig.js";
