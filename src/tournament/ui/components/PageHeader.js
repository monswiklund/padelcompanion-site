/**
 * Page Header Component
 * Standardized header with title, subtitle, and optional action button.
 *
 * @param {Object} props
 * @param {string} props.title - Main title
 * @param {string} props.subtitle - Subtitle description
 * @param {string} [props.actionId] - ID for the action button
 * @param {string} [props.actionIcon] - Icon/Text for the action button (e.g. "?")
 * @returns {string} HTML string
 */
export function PageHeader({ title, subtitle, actionId, actionIcon = "?" }) {
  return `
    <div class="page-intro-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <h2>${title}</h2>
        <p>${subtitle}</p>
      </div>
      ${
        actionId
          ? `<button class="help-icon" id="${actionId}" style="width: 28px; height: 28px; font-size: 1rem; font-weight: bold; margin-top: 4px;">${actionIcon}</button>`
          : ""
      }
    </div>
  `;
}
