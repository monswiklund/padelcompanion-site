/**
 * Court Renderer Module
 * Renders individual court components for Winners Court.
 */

import { createTeams } from "./logic.js";

/**
 * Render a single court.
 * @param {Object} court - Court data
 * @param {boolean} twist - Whether twist mode is active
 * @param {number} round - Current round number
 * @param {boolean} readOnly - Disable interactions
 * @returns {string} Court HTML
 */
export function renderCourt(court, twist, round, readOnly = false) {
  const teams = createTeams(court.players, twist, round);
  const isComplete = court.winner != null;

  // If read-only, remove click handlers visually (pointer-events)
  const interactiveClass = !readOnly && !isComplete ? "interactive" : "";

  return `
    <div class="wc-court ${
      isComplete ? "complete" : ""
    } ${interactiveClass}" data-court-id="${court.id}" style="${
    readOnly ? "pointer-events: none;" : ""
  }">
        <div class="wc-court-header">Court ${court.id}</div>
        <div class="wc-court-body-horizontal">
          <div class="wc-team-horizontal wc-team1 ${
            court.winner === 1 ? "winner" : court.winner === 2 ? "loser" : ""
          }">
            <div class="wc-player-name">${teams?.team1[0]?.name || "?"}</div>
            <div class="wc-player-name">${teams?.team1[1]?.name || "?"}</div>
          </div>
          <div class="wc-vs-horizontal">VS</div>
          <div class="wc-team-horizontal wc-team2 ${
            court.winner === 2 ? "winner" : court.winner === 1 ? "loser" : ""
          }">
            <div class="wc-player-name">${teams?.team2[0]?.name || "?"}</div>
            <div class="wc-player-name">${teams?.team2[1]?.name || "?"}</div>
          </div>
        </div>
        ${
          court.players.length > 4
            ? `<div class="wc-bench">
               <strong>Bench:</strong> ${court.players
                 .slice(4)
                 .map((p) => p.name)
                 .join(", ")}
             </div>`
            : ""
        }
      </div>
    `;
}
