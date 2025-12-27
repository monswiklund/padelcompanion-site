/**
 * Settings Card Component
 * Standardized white card container for settings.
 *
 * @param {Object} props
 * @param {string} props.content - HTML content inside the card
 * @param {string} [props.className] - Additional classes
 * @param {string} [props.style] - Additional inline styles
 * @returns {string} HTML string
 */
export function SettingsCard({ content, className = "", style = "" }) {
  return `
    <div class="setup-card ${className}" style="${style}">
      ${content}
    </div>
  `;
}
