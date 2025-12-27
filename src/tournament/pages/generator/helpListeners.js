/**
 * Generator Help Listeners
 * Handles help button event listeners.
 */

import { showInfoModal } from "../../core/modals.js";
import {
  HELP_FORMATS,
  HELP_SCORING,
  HELP_MATCHUP,
  HELP_LEADERBOARD,
} from "../../content/help.js";

/**
 * Attach help button event listeners.
 * @param {Function} addListener - Listener tracker function
 */
export function attachHelpListeners(addListener) {
  const helpFormat = document.getElementById("helpFormat");
  if (helpFormat) {
    addListener(helpFormat, "click", () => {
      showInfoModal("Tournament Formats", HELP_FORMATS);
    });
  }

  const helpScoring = document.getElementById("helpScoring");
  if (helpScoring) {
    addListener(helpScoring, "click", () => {
      showInfoModal("Scoring Modes", HELP_SCORING);
    });
  }

  const helpMatchup = document.getElementById("helpMatchup");
  if (helpMatchup) {
    addListener(helpMatchup, "click", () => {
      showInfoModal("Matchup Rules", HELP_MATCHUP);
    });
  }

  const helpLeaderboard = document.getElementById("helpLeaderboard");
  if (helpLeaderboard) {
    addListener(helpLeaderboard, "click", () => {
      showInfoModal("Leaderboard Guide", HELP_LEADERBOARD);
    });
  }
}
