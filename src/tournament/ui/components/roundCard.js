import { getCourtName } from "../courts.js";

/**
 * Render a single round card HTML
 * @param {Object} round - The round object
 * @param {Number} roundIndex - The index of the round
 * @param {Object} options - Configuration options
 * @param {String} options.scoringMode - 'total', 'race', or 'time'
 * @param {Number} options.pointsPerMatch - Points or minutes
 * @param {Array} options.manualByes - List of player IDs manually selected for bye
 * @param {Array} options.leaderboard - List of players for bye chips
 * @returns {String} HTML string
 */
export function renderRoundCard(round, roundIndex, options = {}) {
  const {
    scoringMode = "total",
    pointsPerMatch = 24,
    manualByes = [],
    leaderboard = [],
    lastRoundIndex = -1,
  } = options;

  const isLastRound = roundIndex === lastRoundIndex;
  const isCompleted = round.completed;
  const isCollapsed = isCompleted && !isLastRound;

  const roundSummary = isCompleted
    ? round.matches.map((m) => `${m.score1}-${m.score2}`).join(" · ")
    : "";

  return `
    <div class="round ${isCompleted ? "completed" : "ongoing"} ${
    isCollapsed ? "collapsed" : ""
  }" 
         id="round-${roundIndex}" 
         data-round="${roundIndex}">
      <div class="round-header" data-action="toggle-round" data-round="${roundIndex}">
        <span class="round-title">
          Round ${round.number}
          ${
            isCompleted
              ? `<span class="round-status completed">✓ Completed</span>`
              : `<span class="round-status ongoing">● Ongoing</span>`
          }
        </span>
        ${
          isCompleted
            ? `<span class="round-summary" style="${
                isCollapsed ? "" : "display: none"
              }">${roundSummary}</span>`
            : ""
        }
        ${
          isCompleted
            ? `<span class="collapse-icon">${isCollapsed ? "▶" : "▼"}</span>`
            : ""
        }
      </div>
      <div class="round-content">
        <div class="matches-grid">
          ${round.matches
            .map(
              (match, matchIndex) => `
            <div class="match-card-wrapper">
              <div class="match-card-header">
                <span class="court-label">${getCourtName(match.court)}</span>
                <span class="match-info-sub">
                  ${
                    scoringMode === "total"
                      ? `Total ${pointsPerMatch}`
                      : scoringMode === "race"
                      ? `Race to ${pointsPerMatch}`
                      : `${pointsPerMatch} mins`
                  }
                </span>
                ${
                  match.relaxedConstraint
                    ? `<span class="constraint-badge" title="${
                        match.relaxedConstraint === "repeats"
                          ? "Repeat allowed (Priority: Pattern)"
                          : match.relaxedConstraint === "pattern"
                          ? "Pattern override (Priority: Repeats)"
                          : "Constraint relaxed (Best effort)"
                      }">i</span>`
                    : ""
                }
              </div>
              <div class="match-card">
                <div class="match-teams">
                  <div class="team">
                    <span>${match.team1[0].name}</span>
                    ${
                      match.team1[1]
                        ? `<span>${match.team1[1].name}</span>`
                        : ""
                    }
                  </div>
                  <div class="team">
                    <span>${match.team2[0].name}</span>
                    ${
                      match.team2[1]
                        ? `<span>${match.team2[1].name}</span>`
                        : ""
                    }
                  </div>
                </div>
              </div>
              <div class="match-card-footer">
                ${
                  !isCompleted
                    ? `
                <div class="score-input-row">
                  <input type="number" class="score-input" id="score-${roundIndex}-${matchIndex}-1" 
                         min="0" max="${
                           scoringMode === "total" ? pointsPerMatch : 999
                         }" placeholder="0" 
                         value="${match.score1 || ""}"
                         data-action="autofill-score" data-round="${roundIndex}" data-match="${matchIndex}" data-team="1">
                  <span class="score-separator">-</span>
                  <input type="number" class="score-input" id="score-${roundIndex}-${matchIndex}-2" 
                         min="0" max="${
                           scoringMode === "total" ? pointsPerMatch : 999
                         }" placeholder="0"
                         value="${match.score2 || ""}"
                         data-action="autofill-score" data-round="${roundIndex}" data-match="${matchIndex}" data-team="2">
                </div>
                `
                    : `
                <div class="score-input-row">
                  <span class="score-display">${match.score1} - ${match.score2}</span>
                  <button class="btn btn-sm btn-ghost edit-score-btn" data-action="edit-round" data-round="${roundIndex}">Edit</button>
                </div>
                `
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>
        ${
          round.byes && round.byes.length > 0
            ? `
        <div class="waiting-players">
          <span class="waiting-label">Resting:</span>
          <span class="waiting-names">${round.byes
            .map((p) => p.name)
            .join(", ")}</span>
        </div>
        `
            : ""
        }
        ${
          !isCompleted && isLastRound
            ? `
        <div class="bye-selector">
          <div class="bye-selector-header">
            <span class="bye-selector-label">Toggle who rests next round:</span>
            <small class="bye-hint">(${manualByes.length} selected)</small>
          </div>
          <div class="bye-chips">
            ${leaderboard
              .map(
                (p) => `
              <button class="bye-chip ${
                manualByes.includes(p.id) ? "selected" : ""
              }" 
                      data-action="toggle-bye" data-id="${p.id}">
                ${p.name}
                <span class="bye-count">(${p.byeCount || 0})</span>
              </button>
            `
              )
              .join("")}
          </div>
        </div>
        <button class="btn btn-success complete-round-btn" data-action="complete-round">
          Complete Round ${round.number}
        </button>
        `
            : ""
        }
      </div>
    </div>
  `;
}
