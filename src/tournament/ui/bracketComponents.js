/**
 * Bracket Components Module
 * Reusable bracket rendering components with configurable sides.
 */

/**
 * Default side configurations
 */
export const SIDE_CONFIGS = {
  A: {
    name: "Side A",
    color: "var(--accent)",
    bgColor: "rgba(59, 130, 246, 0.05)",
  },
  B: {
    name: "Side B",
    color: "var(--warning)",
    bgColor: "rgba(245, 158, 11, 0.05)",
  },
  C: {
    name: "Side C",
    color: "var(--success)",
    bgColor: "rgba(34, 197, 94, 0.05)",
  },
  D: {
    name: "Side D",
    color: "var(--error)",
    bgColor: "rgba(239, 68, 68, 0.05)",
  },
  E: {
    name: "Side E",
    color: "#a855f7", // Purple
    bgColor: "rgba(168, 85, 247, 0.05)",
  },
  F: {
    name: "Side F",
    color: "#06b6d4", // Cyan
    bgColor: "rgba(6, 182, 212, 0.05)",
  },
};

/**
 * Get side config by letter (A, B, C, D, E, F)
 */
export function getSideConfig(letter) {
  return SIDE_CONFIGS[letter.toUpperCase()] || SIDE_CONFIGS.A;
}

/**
 * Get array of side configs for N brackets
 */
export function getSideConfigs(count) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  return letters.slice(0, count).map((l) => SIDE_CONFIGS[l]);
}

/**
 * Create a custom side configuration
 * @param {string} name - Display name (e.g., "Pool A", "Winners", "Losers")
 * @param {string} color - CSS color for accents
 * @param {string} bgColor - CSS background color (with transparency)
 * @returns {Object} Side configuration object
 */
export function createSideConfig(name, color, bgColor = null) {
  return {
    name,
    color,
    bgColor: bgColor || `${color}10`, // Default to 10% opacity of color
  };
}

/**
 * Get round name based on position
 * @param {number} round - Round number (1-indexed)
 * @param {number} totalRounds - Total number of rounds
 * @returns {string} Round name (e.g., "Final", "Semi-Finals", "QF")
 */
export function getRoundName(round, totalRounds) {
  const fromEnd = totalRounds - round;
  if (fromEnd === 0) return "Final";
  if (fromEnd === 1) return "SF";
  if (fromEnd === 2) return "QF";
  return `R${Math.pow(2, fromEnd + 1)}`;
}

/**
 * Render a mini bracket preview (left-to-right flow)
 * @param {number} teamCount - Number of teams
 * @param {Object} sideConfig - Side configuration {name, color, bgColor}
 * @param {boolean} showWinner - Whether to show winner at the end
 * @returns {string} HTML string for the bracket preview
 */
export function renderMiniBracketPreview(
  teamCount,
  sideConfig,
  showWinner = true
) {
  const rounds = Math.ceil(Math.log2(teamCount));
  const color = sideConfig.color;

  let html =
    '<div style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding: 5px 0;">';

  // Render each round
  for (let r = 0; r < rounds; r++) {
    const matchesInRound = Math.pow(2, rounds - r - 1);
    const roundName = getRoundName(r + 1, rounds);

    if (r > 0) {
      html +=
        '<div style="color: var(--text-muted); font-size: 0.8rem;">→</div>';
    }

    html += `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
        <div style="font-size: 0.65rem; color: ${color}; font-weight: 600;">${roundName}</div>
        <div style="display: flex; flex-direction: column; gap: 3px;">
          ${Array.from(
            { length: matchesInRound },
            () => `
            <div style="width: 70px; height: 36px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 4px; position: relative;">
              <div style="position: absolute; left: 4px; right: 4px; top: 50%; height: 1px; background: var(--border-color);"></div>
            </div>
          `
          ).join("")}
        </div>
      </div>
    `;
  }

  // Winner
  if (showWinner) {
    html += `
      <div style="color: var(--text-muted); font-size: 0.8rem;">→</div>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
        <div style="font-size: 1.2rem;">🏆</div>
        <div style="font-size: 0.7rem; color: var(--success); font-weight: 600;">Winner!</div>
      </div>
    `;
  }

  html += "</div>";
  return html;
}

/**
 * Render a mini bracket preview (right-to-left / reversed flow)
 * @param {number} teamCount - Number of teams
 * @param {Object} sideConfig - Side configuration {name, color, bgColor}
 * @param {boolean} showWinner - Whether to show winner at the start
 * @returns {string} HTML string for the reversed bracket preview
 */
export function renderMiniBracketPreviewReversed(
  teamCount,
  sideConfig,
  showWinner = true
) {
  const rounds = Math.ceil(Math.log2(teamCount));
  const color = sideConfig.color;

  // Build rounds array and reverse it
  const roundsData = [];
  for (let i = 0; i < rounds; i++) {
    const matchesInRound = Math.pow(2, rounds - i - 1);
    roundsData.push({
      name: getRoundName(i + 1, rounds),
      matches: matchesInRound,
    });
  }
  roundsData.reverse();

  let html =
    '<div style="display: flex; align-items: center; gap: 8px; overflow-x: auto; padding: 5px 0;">';

  // Winner first (if shown)
  if (showWinner) {
    html += `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
        <div style="font-size: 1.2rem;">🏆</div>
        <div style="font-size: 0.7rem; color: var(--success); font-weight: 600;">Winner!</div>
      </div>
      <div style="color: var(--text-muted); font-size: 0.8rem;">←</div>
    `;
  }

  // Render each round (reversed order)
  for (let r = 0; r < roundsData.length; r++) {
    const { name, matches } = roundsData[r];

    if (r > 0) {
      html +=
        '<div style="color: var(--text-muted); font-size: 0.8rem;">←</div>';
    }

    html += `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 3px;">
        <div style="font-size: 0.65rem; color: ${color}; font-weight: 600;">${name}</div>
        <div style="display: flex; flex-direction: column; gap: 3px;">
          ${Array.from(
            { length: matches },
            () => `
            <div style="width: 70px; height: 36px; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 4px; position: relative;">
              <div style="position: absolute; left: 4px; right: 4px; top: 50%; height: 1px; background: var(--border-color);"></div>
            </div>
          `
          ).join("")}
        </div>
      </div>
    `;
  }

  html += "</div>";
  return html;
}

/**
 * Render a side container (wrapper for bracket side)
 * @param {Object} sideConfig - Side configuration {name, color, bgColor}
 * @param {number} teamCount - Number of teams
 * @param {string} bracketContentHTML - Inner bracket HTML
 * @param {boolean} hasByes - Whether this side has byes
 * @returns {string} HTML string for the side container
 */
export function renderSideContainer(
  sideConfig,
  teamCount,
  bracketContentHTML,
  hasByes = false
) {
  return `
    <div style="flex: 1; border: 2px solid ${
      sideConfig.color
    }; border-radius: 12px; padding: 16px; background: ${sideConfig.bgColor};">
      <div style="text-align: center; margin-bottom: 16px;">
        <span style="font-weight: 700; font-size: 1.1rem; color: ${
          sideConfig.color
        };">${sideConfig.name}</span>
        <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 8px;">(${teamCount} teams)</span>
        ${
          hasByes
            ? '<span style="color: var(--warning); font-size: 0.75rem;" title="Has byes"> ⚠️</span>'
            : ""
        }
      </div>
      ${bracketContentHTML}
    </div>
  `;
}

/**
 * Render a Grand Final box
 * @param {Object} leftSide - Left side config
 * @param {Object} rightSide - Right side config
 * @returns {string} HTML string for grand final
 */
export function renderGrandFinalPreview(leftSide, rightSide) {
  return `
    <div style="flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 10px;">
      <div style="font-size: 0.7rem; color: var(--success); font-weight: 600;">GRAND FINAL</div>
      <div style="width: 80px; height: 50px; background: linear-gradient(135deg, ${
        leftSide.color
      }, ${
    rightSide.color
  }); border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;">
        <span style="font-size: 1.2rem;">🏆</span>
      </div>
      <div style="display: flex; gap: 4px; font-size: 0.65rem; font-weight: 600;">
        <span style="color: ${leftSide.color};">${
    leftSide.name.split(" ")[1] || "L"
  }</span>
        <span style="color: var(--text-muted);">vs</span>
        <span style="color: ${rightSide.color};">${
    rightSide.name.split(" ")[1] || "R"
  }</span>
      </div>
    </div>
  `;
}

/**
 * Render a complete dual bracket preview
 * @param {number} totalTeams - Total number of teams
 * @param {Object} leftSide - Left side configuration
 * @param {Object} rightSide - Right side configuration
 * @param {boolean} sharedFinal - Whether to show a shared grand final
 * @returns {string} HTML string for the dual bracket preview
 */
export function renderDualBracketPreview(
  totalTeams,
  leftSide,
  rightSide,
  sharedFinal = true
) {
  const halfCount = Math.ceil(totalTeams / 2);
  const leftCount = halfCount;
  const rightCount = totalTeams - halfCount;

  const leftRounds = Math.ceil(Math.log2(leftCount));
  const rightRounds = Math.ceil(Math.log2(rightCount));
  const leftByes = Math.pow(2, leftRounds) - leftCount;
  const rightByes = Math.pow(2, rightRounds) - rightCount;

  const leftBracket = renderMiniBracketPreview(
    leftCount,
    leftSide,
    !sharedFinal
  );
  const rightBracket = renderMiniBracketPreviewReversed(
    rightCount,
    rightSide,
    !sharedFinal
  );

  const leftContainer = renderSideContainer(
    leftSide,
    leftCount,
    leftBracket,
    leftByes > 0
  );
  const rightContainer = renderSideContainer(
    rightSide,
    rightCount,
    rightBracket,
    rightByes > 0
  );

  return `
    <div style="text-align: center; margin-bottom: 12px;">
      <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${totalTeams} Teams → 2 ${
    sharedFinal ? "Brackets" : "Separate Tournaments"
  }</span>
    </div>
    <div class="dual-bracket-container" style="display: flex; align-items: stretch; justify-content: center; gap: 10px; flex-wrap: wrap;">
      ${leftContainer}
      ${sharedFinal ? renderGrandFinalPreview(leftSide, rightSide) : ""}
      ${rightContainer}
    </div>
  `;
}

/**
 * Render a multi-bracket preview (1-6 brackets)
 * @param {number} totalTeams - Total number of teams
 * @param {number} bracketCount - Number of brackets (1-6)
 * @param {boolean} sharedFinal - Whether to show a shared grand final
 * @returns {string} HTML string for the multi-bracket preview
 */
export function renderMultiBracketPreview(
  totalTeams,
  bracketCount = 2,
  sharedFinal = true
) {
  // Single bracket mode
  if (bracketCount <= 1) {
    return renderMiniBracketPreview(totalTeams, SIDE_CONFIGS.A, true);
  }

  // Get side configs for this bracket count
  const sides = getSideConfigs(bracketCount);
  const teamsPerBracket = Math.ceil(totalTeams / bracketCount);

  // Render each bracket side (alternate: A, C, E = normal; B, D, F = reversed)
  const brackets = sides.map((side, i) => {
    const isLast = i === sides.length - 1;
    const teamCount = isLast
      ? totalTeams - teamsPerBracket * i
      : teamsPerBracket;
    const rounds = Math.ceil(Math.log2(Math.max(teamCount, 2)));
    const byes = Math.pow(2, rounds) - teamCount;

    // Even indices (0, 2, 4 = A, C, E) flow left-to-right
    // Odd indices (1, 3, 5 = B, D, F) flow right-to-left (reversed)
    const isReversed = i % 2 === 1;
    const bracketHTML = isReversed
      ? renderMiniBracketPreviewReversed(teamCount, side, !sharedFinal)
      : renderMiniBracketPreview(teamCount, side, !sharedFinal);
    return renderSideContainer(side, teamCount, bracketHTML, byes > 0);
  });

  // For 2 brackets, render side by side with single final
  if (bracketCount === 2) {
    const finalHTML = sharedFinal
      ? renderGrandFinalPreview(sides[0], sides[1])
      : "";
    return `
      <div style="text-align: center; margin-bottom: 12px;">
        <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${totalTeams} Teams → 2 Brackets</span>
      </div>
      <div class="dual-bracket-container" style="display: flex; align-items: stretch; justify-content: center; gap: 10px; flex-wrap: wrap;">
        ${brackets[0]}
        ${finalHTML}
        ${brackets[1]}
      </div>
    `;
  }

  // For 3+ brackets, group in pairs (A+B, C+D, E+F) each with their own final
  const pairRows = [];
  for (let i = 0; i < brackets.length; i += 2) {
    const leftBracket = brackets[i];
    const rightBracket = brackets[i + 1] || "";
    const leftSide = sides[i];
    const rightSide = sides[i + 1];

    // Paired final between this pair
    const pairFinalHTML =
      sharedFinal && rightSide
        ? `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 10px;">
        <div style="font-size: 0.65rem; color: var(--success); font-weight: 600; text-align: center;">${
          leftSide.name.split(" ")[1]
        } vs ${rightSide.name.split(" ")[1]}<br/>Final</div>
        <div style="width: 60px; height: 40px; background: linear-gradient(135deg, ${
          leftSide.color
        }, ${
            rightSide.color
          }); border-radius: 6px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 1rem;">🏆</span>
        </div>
      </div>
    `
        : "";

    pairRows.push(`
      <div class="bracket-pair" style="display: flex; align-items: stretch; justify-content: center; gap: 8px; grid-column: span 2;">
        ${leftBracket}
        ${pairFinalHTML}
        ${rightBracket}
      </div>
    `);
  }

  // Grand final between pair winners (only for exactly 2 pairs = 4 brackets)
  // 3+ pairs would need semi-finals which is more complex
  const numPairs = Math.ceil(bracketCount / 2);
  const grandFinalHTML =
    sharedFinal && numPairs === 2
      ? `
    <div style="grid-column: span 2; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 15px; margin-top: 10px; border-top: 1px solid var(--border-color);">
      <div style="font-size: 0.7rem; color: var(--success); font-weight: 700;">🏆 GRAND FINAL 🏆</div>
      <div style="width: 100px; height: 50px; background: linear-gradient(135deg, ${sides
        .filter((_, i) => i % 2 === 0)
        .map((s) => s.color)
        .join(
          ", "
        )}); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 1.3rem;">👑</span>
      </div>
      <div style="font-size: 0.6rem; color: var(--text-muted);">
        ${Array.from(
          { length: numPairs },
          (_, i) =>
            `${String.fromCharCode(65 + i * 2)}/${String.fromCharCode(
              66 + i * 2
            )}`
        ).join(" vs ")} Winner
      </div>
    </div>
  `
      : "";

  return `
    <div style="text-align: center; margin-bottom: 12px;">
      <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${totalTeams} Teams → ${bracketCount} Brackets (${numPairs} pairs)</span>
    </div>
    <div class="multi-bracket-container" style="display: grid; grid-template-columns: 1fr; gap: 15px;">
      ${pairRows.join("")}
      ${grandFinalHTML}
    </div>
  `;
}
