/**
 * Multi-Bracket Preview
 * Renders dual and multi-bracket previews.
 */

import { SIDE_CONFIGS, getSideConfigs } from "./sideConfig.js";
import {
  renderMiniBracketPreview,
  renderMiniBracketPreviewReversed,
  renderSideContainer,
  renderGrandFinalPreview,
} from "./previewRenderers.js";

/**
 * Render a complete dual bracket preview.
 * @param {number} totalTeams - Total number of teams
 * @param {Object} leftSide - Left side configuration
 * @param {Object} rightSide - Right side configuration
 * @param {boolean} sharedFinal - Whether to show a shared grand final
 * @returns {string} HTML string
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
 * Render a multi-bracket preview (1-6 brackets).
 * @param {number} totalTeams - Total number of teams
 * @param {number} bracketCount - Number of brackets (1-6)
 * @param {boolean} sharedFinal - Whether to show a shared grand final
 * @returns {string} HTML string
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

  // Render each bracket side
  const brackets = sides.map((side, i) => {
    const isLast = i === sides.length - 1;
    const teamCount = isLast
      ? totalTeams - teamsPerBracket * i
      : teamsPerBracket;
    const rounds = Math.ceil(Math.log2(Math.max(teamCount, 2)));
    const byes = Math.pow(2, rounds) - teamCount;

    const isReversed = i % 2 === 1;
    const bracketHTML = isReversed
      ? renderMiniBracketPreviewReversed(teamCount, side, !sharedFinal)
      : renderMiniBracketPreview(teamCount, side, !sharedFinal);
    return renderSideContainer(side, teamCount, bracketHTML, byes > 0);
  });

  // For 2 brackets
  if (bracketCount === 2) {
    const finalHTML = sharedFinal
      ? renderGrandFinalPreview(sides[0], sides[1])
      : "";
    return `
      <div style="text-align: center; margin-bottom: 12px;">
        <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${totalTeams} Teams → 2 Brackets</span>
      </div>
      <div class="preview-mobile-tabs" style="display: none; justify-content: center; gap: 8px; margin-bottom: 12px;">
        <button class="preview-tab-btn active" data-preview="A" style="padding: 6px 14px; border-radius: 16px; border: 1px solid var(--border-color); background: var(--accent); color: white; font-size: 0.8rem; cursor: pointer;">Side A</button>
        <button class="preview-tab-btn" data-preview="Final" style="padding: 6px 14px; border-radius: 16px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-muted); font-size: 0.8rem; cursor: pointer;">Final</button>
        <button class="preview-tab-btn" data-preview="B" style="padding: 6px 14px; border-radius: 16px; border: 1px solid var(--border-color); background: var(--bg-surface); color: var(--text-muted); font-size: 0.8rem; cursor: pointer;">Side B</button>
      </div>
      <div class="dual-bracket-container" style="display: flex; align-items: stretch; justify-content: center; gap: 10px; overflow-x: auto; padding-bottom: 10px;">
        <div class="preview-side preview-side-a" style="flex: 1; min-width: 200px;">${brackets[0]}</div>
        <div class="preview-final">${finalHTML}</div>
        <div class="preview-side preview-side-b" style="flex: 1; min-width: 200px;">${brackets[1]}</div>
      </div>
    `;
  }

  // For 3+ brackets
  const bracketItems = brackets.map(
    (b, i) =>
      `<div class="preview-bracket preview-bracket-${i}" data-bracket="${i}" style="display: flex; align-items: stretch; justify-content: center; gap: 8px; overflow-x: auto;">${b}</div>`
  );

  const bracketTabs = sides
    .map(
      (side, idx) =>
        `<button class="preview-tab-btn ${
          idx === 0 ? "active" : ""
        }" data-preview-bracket="${idx}" style="padding: 6px 12px; border-radius: 16px; border: 2px solid ${
          side.color
        }; background: ${
          idx === 0 ? side.color : "var(--bg-surface)"
        }; color: ${
          idx === 0 ? "white" : side.color
        }; font-size: 0.8rem; font-weight: 600; cursor: pointer;">${
          side.name.split(" ")[1]
        }</button>`
    )
    .join("");

  return `
    <div style="text-align: center; margin-bottom: 12px;">
      <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${totalTeams} Teams → ${bracketCount} Brackets</span>
    </div>
    <div class="preview-mobile-tabs preview-bracket-tabs" style="display: none; justify-content: center; gap: 6px; margin-bottom: 12px; flex-wrap: wrap;">
      ${bracketTabs}
    </div>
    <div class="multi-bracket-container" style="display: flex; flex-direction: column; gap: 15px; overflow-x: auto;">
      ${bracketItems.join("")}
    </div>
  `;
}
