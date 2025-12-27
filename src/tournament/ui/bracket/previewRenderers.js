/**
 * Bracket Preview Renderers
 * Mini and single bracket preview HTML generators.
 */

import { getRoundName, getSideConfigs } from "./sideConfig.js";

/**
 * Render a mini bracket preview (left-to-right flow).
 * @param {number} teamCount - Number of teams
 * @param {Object} sideConfig - Side configuration
 * @param {boolean} showWinner - Whether to show winner at the end
 * @returns {string} HTML string
 */
export function renderMiniBracketPreview(
  teamCount,
  sideConfig,
  showWinner = true
) {
  if (teamCount < 2) return "";

  const rounds = Math.ceil(Math.log2(teamCount));
  const bracketSize = Math.pow(2, rounds);
  const byeCount = bracketSize - teamCount;

  let html = `<div class="mini-bracket" style="display: flex; align-items: center; gap: 8px; padding: 8px;">`;

  for (let r = 1; r <= rounds; r++) {
    const matchesInRound = bracketSize / Math.pow(2, r);
    html += `
      <div class="mini-round" style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
        <div style="font-size: 0.65rem; color: var(--text-muted); margin-bottom: 2px;">${getRoundName(
          r,
          rounds
        )}</div>
        <div style="display: flex; flex-direction: column; gap: 3px;">
    `;

    for (let m = 0; m < matchesInRound; m++) {
      const isBye = r === 1 && m >= teamCount / 2;
      html += `
        <div class="mini-match" style="
          width: 24px; height: 12px; 
          background: ${isBye ? "var(--bg-tertiary)" : sideConfig.bgColor}; 
          border: 1px solid ${
            isBye ? "var(--border-color)" : sideConfig.color
          }; 
          border-radius: 3px;
          opacity: ${isBye ? 0.4 : 1};
        "></div>
      `;
    }

    html += `</div></div>`;

    if (r < rounds) {
      html += `<div style="color: var(--text-muted); font-size: 0.7rem;">→</div>`;
    }
  }

  if (showWinner) {
    html += `
      <div style="color: var(--text-muted); font-size: 0.7rem;">→</div>
      <div style="font-size: 0.85rem;">🏆</div>
    `;
  }

  html += `</div>`;

  if (byeCount > 0) {
    html += `<div style="font-size: 0.7rem; color: var(--warning); margin-top: 4px; text-align: center;">${byeCount} bye${
      byeCount > 1 ? "s" : ""
    }</div>`;
  }

  return html;
}

/**
 * Render a mini bracket preview (right-to-left / reversed flow).
 * @param {number} teamCount - Number of teams
 * @param {Object} sideConfig - Side configuration
 * @param {boolean} showWinner - Whether to show winner at the start
 * @returns {string} HTML string
 */
export function renderMiniBracketPreviewReversed(
  teamCount,
  sideConfig,
  showWinner = true
) {
  if (teamCount < 2) return "";

  const rounds = Math.ceil(Math.log2(teamCount));
  const bracketSize = Math.pow(2, rounds);
  const byeCount = bracketSize - teamCount;

  let html = `<div class="mini-bracket reversed" style="display: flex; align-items: center; gap: 8px; padding: 8px; flex-direction: row-reverse;">`;

  for (let r = 1; r <= rounds; r++) {
    const matchesInRound = bracketSize / Math.pow(2, r);
    html += `
      <div class="mini-round" style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
        <div style="font-size: 0.65rem; color: var(--text-muted); margin-bottom: 2px;">${getRoundName(
          r,
          rounds
        )}</div>
        <div style="display: flex; flex-direction: column; gap: 3px;">
    `;

    for (let m = 0; m < matchesInRound; m++) {
      const isBye = r === 1 && m >= teamCount / 2;
      html += `
        <div class="mini-match" style="
          width: 24px; height: 12px; 
          background: ${isBye ? "var(--bg-tertiary)" : sideConfig.bgColor}; 
          border: 1px solid ${
            isBye ? "var(--border-color)" : sideConfig.color
          }; 
          border-radius: 3px;
          opacity: ${isBye ? 0.4 : 1};
        "></div>
      `;
    }

    html += `</div></div>`;

    if (r < rounds) {
      html += `<div style="color: var(--text-muted); font-size: 0.7rem;">←</div>`;
    }
  }

  if (showWinner) {
    html += `
      <div style="color: var(--text-muted); font-size: 0.7rem;">←</div>
      <div style="font-size: 0.85rem;">🏆</div>
    `;
  }

  html += `</div>`;

  if (byeCount > 0) {
    html += `<div style="font-size: 0.7rem; color: var(--warning); margin-top: 4px; text-align: center;">${byeCount} bye${
      byeCount > 1 ? "s" : ""
    }</div>`;
  }

  return html;
}

/**
 * Render a side container (wrapper for bracket side).
 * @param {Object} sideConfig - Side configuration
 * @param {number} teamCount - Number of teams
 * @param {string} bracketContentHTML - Inner bracket HTML
 * @param {boolean} hasByes - Whether this side has byes
 * @returns {string} HTML string
 */
export function renderSideContainer(
  sideConfig,
  teamCount,
  bracketContentHTML,
  hasByes = false
) {
  return `
    <div class="bracket-side-container" style="
      border: 2px solid ${sideConfig.color};
      border-radius: 12px;
      padding: 12px;
      background: ${sideConfig.bgColor};
      flex: 1;
      min-width: 200px;
    ">
      <div style="text-align: center; margin-bottom: 8px;">
        <span style="font-weight: 700; color: ${sideConfig.color};">${
    sideConfig.name
  }</span>
        <span style="color: var(--text-muted); font-size: 0.85rem; margin-left: 6px;">(${teamCount})</span>
        ${
          hasByes
            ? '<span style="color: var(--warning); font-size: 0.75rem; margin-left: 4px;">⚠️</span>'
            : ""
        }
      </div>
      ${bracketContentHTML}
    </div>
  `;
}

/**
 * Render a Grand Final box.
 * @param {Object} leftSide - Left side config
 * @param {Object} rightSide - Right side config
 * @returns {string} HTML string
 */
export function renderGrandFinalPreview(leftSide, rightSide) {
  return `
    <div class="grand-final-preview" style="
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 16px;
      background: linear-gradient(135deg, ${leftSide.bgColor}, ${rightSide.bgColor});
      border: 2px solid var(--success);
      border-radius: 12px;
    ">
      <div style="font-size: 0.75rem; color: var(--success); font-weight: 700; margin-bottom: 6px;">
        🏆 GRAND FINAL 🏆
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="color: ${leftSide.color}; font-weight: 600;">${leftSide.name}</span>
        <span style="color: var(--text-muted);">vs</span>
        <span style="color: ${rightSide.color}; font-weight: 600;">${rightSide.name}</span>
      </div>
    </div>
  `;
}
