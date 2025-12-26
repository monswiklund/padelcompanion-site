/**
 * Shared Player List Component
 * Common rendering logic for player/team lists in Generator and Winners Court.
 */

/**
 * Render a single player/team list item.
 *
 * @param {Object} item - Player/Team object or name string
 * @param {number} index - Index in the list
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function renderPlayerListItem(item, index, options = {}) {
  const {
    isTeam = false,
    showSkill = false,
    showSide = false, // 'A' or 'B'
    onRemove = null,
    onToggleSide = null,
  } = options;

  // Normalize item
  const name = typeof item === "string" ? item : item.name;
  const skill = item.skill || 0;
  const side = item.side || null;

  // Build Side Toggle HTML
  let sideToggleHtml = "";
  if (showSide) {
    sideToggleHtml = `
      <label class="side-toggle" data-index="${index}" style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 0.75rem; margin: 0 8px;">
        <span style="color: ${
          side !== "B" ? "var(--accent)" : "var(--text-muted)"
        }; font-weight: ${side !== "B" ? "600" : "400"};">A</span>
        <div class="toggle-track" style="width: 28px; height: 16px; background: ${
          side === "B" ? "var(--warning)" : "var(--accent)"
        }; border-radius: 8px; position: relative;">
          <div class="toggle-thumb" style="width: 12px; height: 12px; background: white; border-radius: 50%; position: absolute; top: 2px; left: ${
            side === "B" ? "14px" : "2px"
          }; transition: left 0.2s;"></div>
        </div>
        <span style="color: ${
          side === "B" ? "var(--warning)" : "var(--text-muted)"
        }; font-weight: ${side === "B" ? "600" : "400"};">B</span>
      </label>
    `;
  }

  // Build Skill Badge or Select HTML
  let skillHtml = "";
  if (showSkill) {
    if (options.editableSkill) {
      // Editable Select
      const opts = Array.from({ length: 11 }, (_, i) => {
        const val = i;
        const label = i === 0 ? "-" : i;
        return `<option value="${val}" ${
          skill === val ? "selected" : ""
        }>${label}</option>`;
      }).join("");

      skillHtml = `
        <select class="form-select wc-skill-select compact-select skill-select" data-action="update-skill" data-index="${index}" style="margin-left:8px; width:50px; padding-right: 20px;">
          ${opts}
        </select>
      `;
    } else {
      // Static Badge
      const skillText = skill === 0 ? "-" : skill;
      skillHtml = `<span class="player-skill">${skillText}</span>`;
    }
  }

  // Main Item HTML
  return `
    <li class="player-item slide-in-up" data-index="${index}" style="animation-duration: 0.3s;">
      <span class="player-number">${index + 1}.</span>
      <span class="player-name text-truncate" title="${name}">${name}</span>
      
      ${sideToggleHtml}
      ${skillHtml}
      
      <button class="player-remove" data-index="${index}" title="Remove">×</button>
    </li>
  `;
}

/**
 * Render a complete list of items.
 *
 * @param {Array} items - List of items
 * @param {Object} options - Rendering options
 * @returns {string} HTML string
 */
export function renderPlayerList(items, options = {}) {
  if (!items || items.length === 0) return "";
  return items
    .map((item, i) => renderPlayerListItem(item, i, options))
    .join("");
}
