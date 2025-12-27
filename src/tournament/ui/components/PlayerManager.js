/**
 * Player Manager Component
 * Standardized unified component for managing lists of players or teams.
 *
 * @param {Object} props
 * @param {Array} props.items - Array of items to display
 * @param {string} props.mode - "players" or "teams"
 * @param {string} props.inputId - ID for the main text input
 * @param {string} props.addBtnId - ID for the Add button
 * @param {string} props.importBtnId - ID for the Import button
 * @param {string} props.clearBtnId - ID for the Clear All button
 * @param {string} props.listId - ID for the list container
 * @param {string} props.toggleBtnId - ID for the Show All toggle button (optional)
 * @param {string} props.hintId - ID for the hint text
 * @param {Function} props.renderItem - Function receiving (item, index) returning HTML string
 * @param {string} [props.customInputSlot] - HTML to inject next to the name input (e.g. Skill select)
 * @param {string} [props.customListContent] - HTML to use for the list instead of default mapping
 * @param {string} [props.hintText] - Text content for the hint paragraph
 * @param {string} [props.helpId] - ID for a help button in header
 * @returns {string} HTML string
 */
export function PlayerManager({
  items,
  mode = "players",
  inputId,
  addBtnId,
  importBtnId,
  clearBtnId,
  listId,
  toggleBtnId,
  hintId,
  renderItem,
  customInputSlot = "",
  customListContent = null,
  hintText = "",
  helpId = null,
}) {
  const count = items.length;
  const label = mode === "teams" ? "Teams" : "Players";
  const singularLabel = mode === "teams" ? "Team" : "Player";
  const placeholder = `Enter ${singularLabel.toLowerCase()} name...`;

  // Provide default toggle ID if not specified but potentially needed
  const actualToggleBtnId = toggleBtnId || `${listId}-toggle`;

  return `
    <div class="player-manager">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <h3 style="margin: 0;">${label} <span class="count-badge">(${count})</span></h3>
          ${
            helpId
              ? `<button class="help-icon" id="${helpId}" style="width: 24px; height: 24px; font-size: 0.9rem; font-weight: bold;">?</button>`
              : ""
          }
        </div>
        <div class="player-actions">
          <button class="btn btn-sm btn-secondary" id="${importBtnId}">Import...</button>
          <button class="btn btn-sm btn-danger" id="${clearBtnId}">Clear All</button>
        </div>
      </div>
      
      <div class="player-input-row" style="display: flex; gap: 12px; align-items: flex-end; margin-bottom: 16px;">
        <div class="input-group" style="flex: 1;">
          <label for="${inputId}" style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 4px;">${singularLabel} Name</label>
          <input type="text" id="${inputId}" class="form-input" placeholder="${placeholder}" />
        </div>
        ${customInputSlot}
        <button class="btn btn-primary" id="${addBtnId}" style="height: 44px;">Add</button>
      </div>
      
      <ul id="${listId}" class="player-list custom-scrollbar-y" style="max-height: 400px; overflow-y: auto; display: grid; gap: 10px; padding: 4px; margin: 0;">
        ${
          customListContent
            ? customListContent
            : items.length > 0
            ? items.map((item, i) => renderItem(item, i)).join("")
            : `<li class="empty-list-message" style="text-align: center; color: var(--text-muted); padding: 20px; grid-column: 1 / -1;">No ${label.toLowerCase()} added yet</li>`
        }
      </ul>
      
      <button class="btn btn-sm btn-secondary" id="${actualToggleBtnId}" style="width: 100%; margin-top: 8px; display: none;">Show All (${count})</button>
      
      <p class="players-hint" id="${hintId}" style="margin-top: 12px; text-align: center;">${hintText}</p>
    </div>
  `;
}
