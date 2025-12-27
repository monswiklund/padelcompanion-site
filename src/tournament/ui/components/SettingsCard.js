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
    <div class="settings-card ${className}" style="max-width: 700px; margin: 0 auto 20px; padding: 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-color); ${style}">
      ${content}
    </div>
  `;
}
