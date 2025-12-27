/**
 * Legacy Window Functions Module
 * Provides backward compatibility for onclick="" handlers.
 * These support legacy HTML until all elements are migrated to data-action.
 *
 * @deprecated These window functions are maintained for backward compatibility.
 * New code should use data-action attributes handled by eventDelegation.js.
 *
 * Legacy dependencies still requiring these:
 * - ui/courts.js: window.updateCustomCourtName (inline oninput)
 * - history.js: window.deleteHistoryItem, window.loadTournament, etc.
 */

import {
  updateCustomCourtName,
  autoFillScore,
  toggleManualBye,
  toggleRoundCollapse,
  completeRound,
  editRound,
  toggleLeaderboardVisibility,
  togglePositionChanges,
  updateRankingCriteria,
  validateCourts,
  toggleToolbar,
  exportTournamentData,
  shareResults,
} from "../ui/index.js";
import { showFinalStandings } from "../core/modals.js";

/**
 * Setup legacy window functions for backward compatibility.
 * @param {Function} endTournament - End tournament function
 * @param {Function} promptAddLatePlayer - Late player prompt function
 */
export function setupLegacyWindowFunctions(endTournament, promptAddLatePlayer) {
  window.updateCustomCourtName = updateCustomCourtName;
  window.autoFillScore = autoFillScore;
  window.toggleManualBye = toggleManualBye;
  window.toggleRoundCollapse = toggleRoundCollapse;
  window.completeRound = completeRound;
  window.editRound = editRound;
  window.toggleLeaderboardVisibility = toggleLeaderboardVisibility;
  window.togglePositionChanges = togglePositionChanges;
  window.updateRankingCriteria = updateRankingCriteria;
  window.endTournament = () => endTournament(showFinalStandings);
  window.validateCourts = validateCourts;
  window.toggleToolbar = toggleToolbar;
  window.exportTournamentData = exportTournamentData;
  window.shareResults = shareResults;
  window.promptAddLatePlayer = promptAddLatePlayer;
}
